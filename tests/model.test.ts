import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { applyUnitLabel, parseApply } from "../src/apply.ts"
import { parseLog } from "../src/log.ts"
import {
  buildReport,
  freshSources,
  loadSources,
  unifyNames,
  type RunReport,
  type Sources,
} from "../src/model.ts"
import { parsePlan } from "../src/plan.ts"
import { renderMarkdown } from "../src/render.ts"
import { parseReport } from "../src/report.ts"

const FIXTURES = fileURLToPath(new URL("./fixtures", import.meta.url))

function applyFiles(dir: string, name: string) {
  return readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((file) => path.basename(file) === name)
    .map((file) => ({
      unit: applyUnitLabel(path.join(dir, file), dir),
      path: path.join(dir, file),
    }))
}

function sources(
  scenario: "changes" | "failures" | "destroy",
  kind: "plan" | "apply" | "destroy",
): Sources {
  const dir = path.join(FIXTURES, scenario, kind)
  if (kind === "plan") {
    return loadSources({
      logFile: path.join(dir, "plan.log"),
      planJsonDir: path.join(dir, "plans"),
      planJsonFiles: applyFiles(path.join(dir, "json-into"), "plan.json"),
      reportFile: path.join(dir, "report.json"),
    })
  }
  return loadSources({
    logFile: path.join(dir, `${kind}.log`),
    applyJsonFiles: applyFiles(path.join(dir, "apply-json"), `${kind}.json`),
    reportFile: path.join(dir, "report.json"),
  })
}

function unit(report: RunReport, name: string) {
  const found = report.units.find((u) => u.name === `.terragrunt-stack/${name}`)
  if (!found) throw new Error(`no unit ${name}`)
  return found
}

const kinds = (report: RunReport, name: string) =>
  unit(report, name).changes.map((change) => [change.address, change.kind])

describe("buildReport for changes/plan", () => {
  const report = buildReport(sources("changes", "plan"))

  it("lists every unit in name order", () => {
    expect(report.kind).toBe("plan")
    expect(report.units.map((u) => u.name)).toEqual([
      ".terragrunt-stack/alpha",
      ".terragrunt-stack/beta",
      ".terragrunt-stack/delta",
      ".terragrunt-stack/epsilon",
      ".terragrunt-stack/gamma",
      ".terragrunt-stack/zeta",
    ])
  })

  it("has one create and two replaces in alpha, with the diff from the log", () => {
    expect(kinds(report, "alpha")).toEqual([
      ["local_file.extra[0]", "create"],
      ["local_file.main", "replace"],
      ["terraform_data.replace", "replace"],
    ])
    const replace = unit(report, "alpha").changes[2]
    expect(replace?.diff).toBe(
      '! id               = "8ecce4d8-5014-09f3-fdaf-bb93a9df3581" -> (known after apply)\n! triggers_replace = "phase-1" -> "phase-2"',
    )
    expect(replace?.reason).toBeUndefined()
    expect(replace?.outcome).toBeUndefined()
  })

  it("has one delete with its reason and one replace in beta", () => {
    expect(kinds(report, "beta")).toEqual([
      ["local_file.extra[0]", "delete"],
      ["local_file.main", "replace"],
    ])
    expect(unit(report, "beta").changes[0]?.reason).toBe(
      "because index [0] is out of range for count",
    )
  })

  it("has no changes in gamma", () => {
    const gamma = unit(report, "gamma")
    expect(gamma.changes).toEqual([])
    expect(gamma.counts).toEqual({ add: 0, change: 0, remove: 0 })
    expect(gamma.summaryLine).toBe("No changes. Your infrastructure matches the configuration.")
    expect(gamma.outputsDiff).toBeUndefined()
  })

  it("formats the outputs diff of alpha", () => {
    const lines = unit(report, "alpha").outputsDiff?.split("\n") ?? []
    expect(lines.filter((line) => line.startsWith("!"))).toHaveLength(2)
  })

  it("adds the totals and the unit counts", () => {
    expect(unit(report, "alpha").counts).toEqual({ add: 3, change: 0, remove: 2 })
    expect(unit(report, "alpha").durationSeconds).toBe(1)
    expect(report.totals).toEqual({ add: 6, change: 0, remove: 6, import: 0, forget: 0 })
    expect(report).toMatchObject({
      changedUnits: 4,
      unchangedUnits: 2,
      failedUnits: 0,
      earlyExitUnits: 0,
      empty: false,
      failed: false,
    })
  })
})

describe("buildReport with the -json-into files of a plan", () => {
  const dir = path.join(FIXTURES, "changes", "plan")
  const alone = buildReport(
    loadSources({
      logFile: path.join(dir, "plan.log"),
      planJsonDir: path.join(dir, "plans"),
      reportFile: path.join(dir, "report.json"),
    }),
  )
  const withFiles = buildReport(sources("changes", "plan"))

  it("takes the warnings of each unit from the files and keeps the changes", () => {
    expect(withFiles.kind).toBe("plan")
    for (const u of withFiles.units) {
      expect(u.diagnostics).toHaveLength(3)
      expect(u.diagnostics.every((d) => d.severity === "warning")).toBe(true)
    }
    expect(withFiles.units.map((u) => [u.name, u.changes, u.counts, u.summaryLine])).toEqual(
      alone.units.map((u) => [u.name, u.changes, u.counts, u.summaryLine]),
    )
    expect(alone.units.every((u) => u.diagnostics.length === 0)).toBe(true)
  })

  it("gives the kind plan for the files alone", () => {
    const planJson = sources("changes", "plan").planJson
    expect(buildReport({ planJson }).kind).toBe("plan")
  })

  it("warns about patterns that match no file", () => {
    expect(loadSources({ planJsonFiles: [] }).warnings).toEqual([
      "The patterns of the input plan-json-files match no file.",
    ])
  })

  it("ignores a file of an earlier run and warns about it", () => {
    const tmp = mkdtempSync(path.join(tmpdir(), "sources-"))
    try {
      const cache = path.join(tmp, "a", ".terragrunt-cache", "x", "y")
      mkdirSync(cache, { recursive: true })
      const file = path.join(cache, "plan.json")
      writeFileSync(file, created("a.stale", "2026-01-01T00:00:00Z"))
      const reportFile = path.join(tmp, "report.json")
      writeFileSync(
        reportFile,
        JSON.stringify([
          { Name: "a", Result: "failed", Cmd: "plan", Started: "2026-01-01T00:05:00Z" },
        ]),
      )
      const loaded = loadSources({ planJsonFiles: applyFiles(tmp, "plan.json"), reportFile })
      expect(loaded.warnings).toEqual([
        `The -json-into file of the unit a is from an earlier run, so the action ignored it: ${file}`,
      ])
      expect(loaded.planJson).toEqual([])
    } finally {
      rmSync(tmp, { recursive: true })
    }
  })
})

describe("buildReport for failures/plan", () => {
  const report = buildReport(sources("failures", "plan"))
  const zeta = unit(report, "zeta")

  it("marks zeta as failed with the report reason", () => {
    expect(zeta.result).toBe("failed")
    expect(zeta.reason).toBe("run error")
    expect(zeta.stderr?.startsWith("Error: Resource precondition failed")).toBe(true)
    expect(report.failed).toBe(true)
  })

  it("takes the changes of zeta from the log blocks, without a tfplan.json file", () => {
    expect(sources("failures", "plan").plans?.map((p) => p.unit)).not.toContain(
      ".terragrunt-stack/zeta",
    )
    expect(kinds(report, "zeta")).toEqual([["local_file.main", "replace"]])
    expect(zeta.changes[0]?.diff).toContain("+     zeta phase 3")
    expect(zeta.counts).toEqual({ add: 1, change: 0, remove: 1 })
  })
})

describe("buildReport for changes/apply", () => {
  const report = buildReport(sources("changes", "apply"))

  it("takes the changes from the planned_change messages with their outcome", () => {
    expect(report.kind).toBe("apply")
    expect(kinds(report, "epsilon")).toEqual([["local_file.main", "replace"]])
    for (const u of report.units) {
      for (const change of u.changes) {
        expect(change).toMatchObject({ outcome: "complete", elapsedSeconds: 0 })
      }
    }
  })

  it("takes the totals from the apply change_summary", () => {
    expect(unit(report, "beta").appliedCounts).toEqual({ add: 1, change: 0, remove: 2 })
    expect(unit(report, "beta").summaryLine).toBe(
      "Apply complete! Resources: 1 added, 0 changed, 2 destroyed.",
    )
    expect(report.totals).toEqual({ add: 7, change: 0, remove: 7, import: 0, forget: 0 })
  })
})

describe("buildReport for failures/apply", () => {
  const report = buildReport(sources("failures", "apply"))

  it("marks the errored resource of delta and keeps its diagnostic", () => {
    const delta = unit(report, "delta")
    expect(delta.result).toBe("failed")
    expect(delta.changes.map((c) => [c.address, c.outcome])).toEqual([
      ["local_file.main", "complete"],
      ["terraform_data.fail[0]", "errored"],
    ])
    expect(delta.diagnostics.map((d) => d.summary)).toEqual([
      "Redundant ignore_changes element",
      "Redundant ignore_changes element",
      "Redundant ignore_changes element",
      "local-exec provisioner error",
    ])
    expect(delta.counts).toEqual({ add: 2, change: 0, remove: 1 })
    expect(delta.appliedCounts).toEqual({ add: 1, change: 0, remove: 1 })
  })

  it("marks epsilon as an early exit caused by delta", () => {
    const epsilon = unit(report, "epsilon")
    expect(epsilon).toMatchObject({
      result: "early exit",
      reason: "ancestor error",
      cause: "delta",
    })
    expect(epsilon.changes).toEqual([])
    expect(epsilon.counts).toBeUndefined()
  })

  it("marks every change of zeta as pending", () => {
    const zeta = unit(report, "zeta")
    expect(zeta.diagnostics.map((d) => d.summary)).toEqual([
      "Redundant ignore_changes element",
      "Redundant ignore_changes element",
      "Redundant ignore_changes element",
      "Resource precondition failed",
    ])
    expect(zeta.changes.length).toBeGreaterThan(0)
    expect(
      zeta.changes.every((c) => c.outcome === "pending" && c.elapsedSeconds === undefined),
    ).toBe(true)
  })

  it("counts the failed units and the early exits", () => {
    expect(report).toMatchObject({
      failedUnits: 2,
      earlyExitUnits: 1,
      changedUnits: 2,
      unchangedUnits: 1,
      empty: false,
      failed: true,
    })
  })
})

describe("buildReport for destroy/destroy", () => {
  const report = buildReport(sources("destroy", "destroy"))
  const changes = report.units.flatMap((u) => u.changes)

  it("marks every change of every unit as a complete delete", () => {
    expect(report.kind).toBe("destroy")
    expect(report.units.every((u) => u.changes.length > 0)).toBe(true)
    for (const change of changes) {
      expect(change).toMatchObject({ kind: "delete", outcome: "complete" })
    }
  })

  it("counts every destroyed resource in the totals", () => {
    expect(report.totals).toEqual({
      add: 0,
      change: 0,
      remove: changes.length,
      import: 0,
      forget: 0,
    })
  })
})

describe("buildReport with one source", () => {
  it("builds the report from the log alone", () => {
    const report = buildReport({ log: sources("failures", "plan").log })
    expect(report.kind).toBe("run")
    expect(report.units).toHaveLength(6)
    expect(unit(report, "zeta").result).toBe("failed")
    expect(unit(report, "alpha").result).toBe("succeeded")
    expect(kinds(report, "alpha")).toEqual([
      ["local_file.extra[0]", "delete"],
      ["local_file.main", "replace"],
      ["terraform_data.replace", "replace"],
    ])
    expect(unit(report, "alpha").counts).toEqual({ add: 2, change: 0, remove: 3 })
  })

  it("builds the report from the tfplan.json files alone", () => {
    const report = buildReport({ plans: sources("changes", "plan").plans })
    expect(report.kind).toBe("plan")
    const beta = unit(report, "beta")
    expect(beta.changes[0]).toEqual({
      address: "local_file.extra[0]",
      kind: "delete",
      reason: "delete because count index",
    })
    expect(beta.outputsDiff).toBe("! content")
    expect(beta.summaryLine).toBe("Plan: 1 to add, 0 to change, 2 to destroy.")
  })

  it("builds the report from the -json-into files alone", () => {
    const report = buildReport({ applies: sources("failures", "apply").applies })
    expect(report.kind).toBe("apply")
    expect(unit(report, "delta").result).toBe("failed")
    expect(unit(report, "delta").changes[1]?.diff).toBeUndefined()
    expect(report.units.map((u) => u.result)).toEqual([
      "succeeded",
      "succeeded",
      "failed",
      "succeeded",
      "failed",
    ])
  })

  it("builds the report from the report file alone", () => {
    const report = buildReport({ report: sources("failures", "apply").report })
    expect(report.kind).toBe("apply")
    expect(report.units.map((u) => [u.name.split("/")[1], u.result])).toEqual([
      ["alpha", "succeeded"],
      ["beta", "succeeded"],
      ["delta", "failed"],
      ["epsilon", "early exit"],
      ["gamma", "succeeded"],
      ["zeta", "failed"],
    ])
    expect(report.units.every((u) => u.changes.length === 0)).toBe(true)
  })

  it("reports an empty run when no unit has a change", () => {
    const log = parseLog(
      [
        "12:00:00.000 STDOUT [a] tofu: No changes. Your infrastructure matches the configuration.",
        "12:00:00.000 STDOUT [b] tofu: No changes. Your infrastructure matches the configuration.",
      ].join("\n"),
    )
    expect(buildReport({ log })).toMatchObject({ empty: true, failed: false, unchangedUnits: 2 })
  })
})

describe("buildReport plan action kinds", () => {
  it.each([
    [["create"], false, "create"],
    [["delete", "create"], false, "replace"],
    [["create", "delete"], false, "replace"],
    [["create", "forget"], false, "replace"],
    [["update"], false, "update"],
    [["read"], false, "read"],
    [["forget"], false, "forget"],
    [["open"], false, "open"],
    [["no-op"], true, "import"],
  ])("maps %j with importing %s to %s", (actions, importing, kind) => {
    const change = {
      address: "a.b",
      change: { actions, importing: importing ? { id: "x" } : null },
    }
    const plan = parsePlan(JSON.stringify({ resource_changes: [change] }), "u")
    expect(buildReport({ plans: [plan] }).units[0]?.changes[0]?.kind).toBe(kind)
  })

  it("maps a no-op change with a previous address to a move without counts", () => {
    const change = {
      address: "a.new",
      previous_address: "a.old",
      change: { actions: ["no-op"] },
    }
    const report = buildReport({
      plans: [parsePlan(JSON.stringify({ resource_changes: [change] }), "u")],
    })
    expect(report.units[0]?.changes).toEqual([
      { address: "a.new", previousAddress: "a.old", kind: "move" },
    ])
    expect(report).toMatchObject({
      changedUnits: 1,
      totals: { add: 0, change: 0, remove: 0, import: 0, forget: 0 },
    })
  })

  it("leaves out the reason of a forget that the header phrase states", () => {
    const change = {
      address: "a.b",
      action_reason: "delete_because_no_resource_config",
      change: { actions: ["forget"] },
    }
    const plan = parsePlan(JSON.stringify({ resource_changes: [change] }), "u")
    expect(buildReport({ plans: [plan] }).units[0]?.changes).toEqual([
      { address: "a.b", kind: "forget" },
    ])
  })

  it("leaves out a no-op change", () => {
    const change = { address: "a.b", change: { actions: ["no-op"] } }
    const plan = parsePlan(JSON.stringify({ resource_changes: [change] }), "u")
    expect(buildReport({ plans: [plan] }).units[0]?.changes).toEqual([])
  })
})

const ndjson = (...messages: object[]) => messages.map((m) => JSON.stringify(m)).join("\n")

const summary = (operation: string) => ({
  type: "change_summary",
  changes: { add: 0, change: 0, remove: 0, import: 1, forget: 1, operation },
})

const hooklessChanges = [
  {
    type: "planned_change",
    change: { resource: { addr: "a.imp" }, action: "import", importing: { id: "x" } },
  },
  {
    type: "planned_change",
    change: {
      resource: { addr: "a.gone" },
      action: "remove",
      reason: "delete_because_no_resource_config",
    },
  },
  {
    type: "planned_change",
    change: { resource: { addr: "a.new" }, previous_resource: { addr: "a.old" }, action: "move" },
  },
]

describe("buildReport for changes without apply hooks", () => {
  it("marks an import, a forget, and a move as complete after the apply summary", () => {
    const apply = parseApply(ndjson(...hooklessChanges, summary("plan"), summary("apply")), "u")
    expect(buildReport({ applies: [apply] }).units[0]?.changes).toEqual([
      { address: "a.gone", kind: "forget", outcome: "complete" },
      { address: "a.imp", kind: "import", outcome: "complete" },
      { address: "a.new", previousAddress: "a.old", kind: "move", outcome: "complete" },
    ])
  })

  it("marks them as not applied without the apply summary", () => {
    const apply = parseApply(ndjson(...hooklessChanges, summary("plan")), "u")
    const outcomes = buildReport({ applies: [apply] }).units[0]?.changes.map((c) => c.outcome)
    expect(outcomes).toEqual(["pending", "pending", "pending"])
  })
})

describe("buildReport for a unit that tofu did not run", () => {
  it("ignores a stale -json-into file of an early-exit unit", () => {
    const stale = parseApply(
      ndjson(
        {
          type: "planned_change",
          change: { resource: { addr: "a.b" }, action: "create" },
        },
        { type: "change_summary", changes: { add: 1, change: 0, remove: 0, operation: "plan" } },
        { type: "change_summary", changes: { add: 1, change: 0, remove: 0, operation: "apply" } },
      ),
      "u",
    )
    const report = buildReport({
      applies: [stale],
      report: parseReport(JSON.stringify([{ Name: "u", Result: "early exit", Cmd: "apply" }])),
    })
    expect(report.units[0]).toMatchObject({ result: "early exit", changes: [] })
    expect(report.units[0]?.counts).toBeUndefined()
    expect(report.units[0]?.appliedCounts).toBeUndefined()
    expect(report.totals).toEqual({ add: 0, change: 0, remove: 0, import: 0, forget: 0 })
  })
})

const created = (addr: string, timestamp?: string) =>
  ndjson(
    { type: "version", tofu: "1.13.1", ...(timestamp ? { "@timestamp": timestamp } : {}) },
    { type: "planned_change", change: { resource: { addr }, action: "create" } },
    { type: "change_summary", changes: { add: 1, change: 0, remove: 0, operation: "plan" } },
  )

describe("freshSources", () => {
  const stale = parseApply(created("a.b", "2026-01-01T00:00:00Z"), "stale")
  const fresh = parseApply(created("a.b", "2026-01-01T02:05:00.5+02:00"), "fresh")
  const untimed = parseApply(created("a.b"), "untimed")
  const applies = [stale, fresh, untimed]
  const units = (list: readonly { unit: string }[]) => list.map((apply) => apply.unit)

  it("drops a file whose first timestamp is earlier than the first start of the run", () => {
    const report = parseReport(
      JSON.stringify([
        { Name: "fresh", Result: "succeeded", Started: "2026-01-01T00:06:00Z" },
        { Name: "stale", Result: "failed", Started: "2026-01-01T00:05:00.123456789Z" },
      ]),
    )
    const result = freshSources(applies, report)
    expect(units(result.fresh)).toEqual(["fresh", "untimed"])
    expect(units(result.stale)).toEqual(["stale"])
  })

  it("compares the start time of a tfplan.json file at whole seconds", () => {
    const plan = (unit: string, timestamp: string) =>
      parsePlan(JSON.stringify({ timestamp, resource_changes: [] }), unit)
    const report = parseReport(
      JSON.stringify([{ Name: "a", Result: "succeeded", Started: "2026-01-01T00:05:00.7Z" }]),
    )
    const plans = [plan("same", "2026-01-01T00:05:00Z"), plan("old", "2026-01-01T00:04:59Z")]
    const result = freshSources(plans, report, 1000)
    expect(units(result.fresh)).toEqual(["same"])
    expect(units(result.stale)).toEqual(["old"])
  })

  it("keeps every file without a report file or without a start time", () => {
    const report = parseReport(JSON.stringify([{ Name: "stale", Result: "failed" }]))
    expect(units(freshSources(applies, undefined).fresh)).toEqual(["stale", "fresh", "untimed"])
    expect(units(freshSources(applies, report).fresh)).toEqual(["stale", "fresh", "untimed"])
  })
})

describe("buildReport for a deposed object", () => {
  const deposed = "aws_instance.web (deposed object 1a2b3c4d)"
  const reason = "left over from a partially-failed replacement of this instance"
  const log = parseLog(
    [
      "OpenTofu will perform the following actions:",
      "  # aws_instance.web will be updated in-place",
      '  ~ resource "aws_instance" "web" {',
      '        id            = "i-new"',
      '      ~ instance_type = "t3.micro" -> "t3.small"',
      "    }",
      `  # ${deposed} will be destroyed`,
      `  # (${reason})`,
      '  - resource "aws_instance" "web" {',
      '      - id            = "i-old" -> null',
      '      - instance_type = "t3.micro" -> null',
      "    }",
      "Plan: 0 to add, 1 to change, 1 to destroy.",
    ]
      .map((text) => `12:00:00.000 STDOUT [u] tofu: ${text}`)
      .join("\n"),
  )
  const live = {
    address: "aws_instance.web",
    kind: "update",
    diff: '  id            = "i-new"\n! instance_type = "t3.micro" -> "t3.small"',
  }
  const old = {
    address: deposed,
    kind: "delete",
    reason,
    diff: '- id            = "i-old" -> null\n- instance_type = "t3.micro" -> null',
  }

  it("renders the deposed object of a plan JSON as its own change with its own diff", () => {
    const plan = parsePlan(
      JSON.stringify({
        resource_changes: [
          { address: "aws_instance.web", change: { actions: ["update"] } },
          { address: "aws_instance.web", deposed: "1a2b3c4d", change: { actions: ["delete"] } },
        ],
      }),
      "u",
    )
    const unit = buildReport({ log, plans: [plan] }).units[0]
    expect(unit?.changes).toEqual([live, old])
    expect(unit?.counts).toEqual({ add: 0, change: 1, remove: 1 })
  })

  it("gives the deposed address to the -json-into change of the deposed diff block", () => {
    const addr = "aws_instance.web"
    const hook = (type: string, action: string) => ({
      type,
      hook: { resource: { addr }, action, elapsed_seconds: 1 },
    })
    const apply = parseApply(
      ndjson(
        { type: "planned_change", change: { resource: { addr }, action: "delete" } },
        { type: "planned_change", change: { resource: { addr }, action: "update" } },
        { type: "change_summary", changes: { add: 0, change: 1, remove: 1, operation: "plan" } },
        hook("apply_start", "delete"),
        hook("apply_complete", "delete"),
        hook("apply_start", "update"),
        hook("apply_complete", "update"),
        { type: "change_summary", changes: { add: 0, change: 1, remove: 1, operation: "apply" } },
      ),
      "u",
    )
    const unit = buildReport({ log, applies: [apply] }).units[0]
    const applied = { outcome: "complete", elapsedSeconds: 2 }
    expect(unit?.changes).toEqual([
      { ...live, ...applied },
      { ...old, ...applied },
    ])
  })

  describe("the outcome", () => {
    const addr = "aws_instance.web"
    const hook = (type: string, action: string) => ({
      type,
      hook: { resource: { addr }, action, elapsed_seconds: 1 },
    })
    const planned = (action: string) => ({
      type: "planned_change",
      change: { resource: { addr }, action },
    })
    const error = { type: "diagnostic", diagnostic: { severity: "error", summary: "boom" } }
    const outcomes = (unitLog: typeof log, ...messages: object[]) =>
      buildReport({
        log: unitLog,
        applies: [parseApply(ndjson(...messages), "u")],
      }).units[0]?.changes.map((change) => [change.address, change.outcome])

    it("marks a deposed destroy without an end as failed next to a complete live update", () => {
      expect(
        outcomes(
          log,
          planned("delete"),
          planned("update"),
          hook("apply_start", "update"),
          hook("apply_complete", "update"),
          hook("apply_start", "delete"),
          error,
        ),
      ).toEqual([
        [addr, "complete"],
        [deposed, "errored"],
      ])
    })

    it("marks a deposed destroy without an end as failed without a live change", () => {
      const deposedLog = parseLog(
        [
          `  # ${deposed} will be destroyed`,
          '  - resource "aws_instance" "web" {',
          '      - id = "i-old" -> null',
          "    }",
        ]
          .map((text) => `12:00:00.000 STDOUT [u] tofu: ${text}`)
          .join("\n"),
      )
      expect(outcomes(deposedLog, planned("delete"), hook("apply_start", "delete"), error)).toEqual(
        [[deposed, "errored"]],
      )
    })

    it("marks both changes as complete in a succeeded unit", () => {
      expect(
        outcomes(
          log,
          planned("delete"),
          planned("update"),
          hook("apply_start", "delete"),
          hook("apply_complete", "delete"),
          hook("apply_start", "update"),
          hook("apply_complete", "update"),
        ),
      ).toEqual([
        [addr, "complete"],
        [deposed, "complete"],
      ])
    })

    it("marks a complete deposed destroy as complete next to a failed live update", () => {
      expect(
        outcomes(
          log,
          planned("delete"),
          planned("update"),
          hook("apply_start", "delete"),
          hook("apply_complete", "delete"),
          hook("apply_start", "update"),
          hook("apply_errored", "update"),
          error,
        ),
      ).toEqual([
        [addr, "errored"],
        [deposed, "complete"],
      ])
    })
  })

  it("reads the deposed address and the reason from the log alone", () => {
    const changes = buildReport({ log }).units[0]?.changes
    expect(changes?.map((change) => [change.address, change.kind, change.reason])).toEqual([
      ["aws_instance.web", "update", undefined],
      [deposed, "delete", reason],
    ])
  })
})

describe("buildReport without counts", () => {
  it("counts a unit of a report file alone as a unit without counts", () => {
    const report = buildReport({
      report: parseReport(JSON.stringify([{ Name: "u", Result: "succeeded", Cmd: "plan" }])),
    })
    expect(report).toMatchObject({
      changedUnits: 0,
      unchangedUnits: 0,
      uncountedUnits: 1,
      empty: false,
      failed: false,
    })
  })
})

describe("buildReport for an apply or a destroy from the log alone", () => {
  const line = (unit: string, text: string) => `12:00:00.000 STDOUT [${unit}] tofu: ${text}`

  it("takes the applied counts from the apply line of each unit", () => {
    const log = parseLog(
      [
        line("a", "Plan: 1 to add, 0 to change, 0 to destroy."),
        line("a", "Apply complete! Resources: 1 added, 0 changed, 0 destroyed."),
        line("b", "Plan: 2 to add, 0 to change, 0 to destroy."),
        "12:00:00.000 STDERR [b] tofu: Error: boom",
      ].join("\n"),
    )
    const report = buildReport({ log })
    expect(report.kind).toBe("apply")
    expect(report.units.map((u) => [u.name, u.result, u.appliedCounts])).toEqual([
      ["a", "succeeded", { add: 1, change: 0, remove: 0 }],
      ["b", "failed", undefined],
    ])
    expect(report.totals).toMatchObject({ add: 1, change: 0, remove: 0 })
  })

  it("reads a destroy from the destroy line", () => {
    const log = parseLog(
      [
        line("a", "Plan: 0 to add, 0 to change, 1 to destroy."),
        line("a", "Destroy complete! Resources: 1 destroyed."),
      ].join("\n"),
    )
    const report = buildReport({ log })
    expect(report.kind).toBe("destroy")
    expect(report.totals).toMatchObject({ add: 0, change: 0, remove: 1 })
  })

  it("takes the destroy kind from the report file", () => {
    const report = parseReport(JSON.stringify([{ Name: "u", Result: "succeeded", Cmd: "destroy" }]))
    expect(buildReport({ report }).kind).toBe("destroy")
  })
})

describe("buildReport for a run error", () => {
  it("marks the run as failed for a top-level run error without a failed unit", () => {
    const log = parseLog(
      [
        "12:00:00.000 STDOUT [u] tofu: No changes. Your infrastructure matches the configuration.",
        "12:00:00.000 ERROR  error occurred:",
        "",
        "* boom",
      ].join("\n"),
    )
    expect(buildReport({ log })).toMatchObject({
      failed: true,
      empty: false,
      failedUnits: 0,
      runError: "error occurred:\n\n* boom",
    })
  })

  it("ignores another top-level error when units ran", () => {
    const log = parseLog(
      [
        "12:00:00.000 STDOUT [u] tofu: No changes. Your infrastructure matches the configuration.",
        "12:00:00.000 ERROR  something else",
      ].join("\n"),
    )
    expect(buildReport({ log })).toMatchObject({ failed: false, empty: true })
    expect(buildReport({ log }).runError).toBeUndefined()
  })
})

describe("loadSources", () => {
  it("names the input in the error for a file that does not exist", () => {
    expect(() => loadSources({ logFile: path.join(FIXTURES, "missing.log") })).toThrow(
      /^The action cannot read the input log-file: ENOENT/,
    )
    expect(() => loadSources({ reportFile: path.join(FIXTURES, "missing.json") })).toThrow(
      /^The action cannot read the input report-file: ENOENT/,
    )
  })

  it("warns about a missing plan directory and reports a run that failed before any unit", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "sources-"))
    try {
      const logFile = path.join(dir, "plan.log")
      const reportFile = path.join(dir, "report.json")
      writeFileSync(
        logFile,
        [
          "12:00:00.000 INFO   Start Terragrunt Cache server",
          "12:00:00.000 ERROR  Error: Argument definition required",
          "12:00:00.000 ERROR  a/terragrunt.hcl:11,11-18: Argument definition required",
        ].join("\n"),
      )
      writeFileSync(reportFile, "[]")
      const planJsonDir = path.join(dir, "plans")
      const loaded = loadSources({ logFile, planJsonDir, applyJsonFiles: [], reportFile })
      expect(loaded.warnings).toEqual([
        `The directory of the input plan-json-dir does not exist: ${planJsonDir}`,
        "The patterns of the input apply-json-files match no file.",
      ])
      expect(loaded.plans).toBeUndefined()
      expect(loaded.applies).toBeUndefined()
      expect(buildReport(loaded)).toMatchObject({
        kind: "run",
        units: [],
        failed: true,
        empty: false,
        runError: "a/terragrunt.hcl:11,11-18: Argument definition required",
      })
    } finally {
      rmSync(dir, { recursive: true })
    }
  })

  it("warns about a -json-into file of an earlier run and ignores its changes", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "sources-"))
    try {
      const write = (unit: string, addr: string, timestamp: string) => {
        const cache = path.join(dir, unit, ".terragrunt-cache", "x", "y")
        mkdirSync(cache, { recursive: true })
        writeFileSync(path.join(cache, "apply.json"), created(addr, timestamp))
        return path.join(cache, "apply.json")
      }
      write("a", "a.fresh", "2026-01-01T00:05:01.5Z")
      const stalePath = write("b", "b.stale", "2026-01-01T00:00:00Z")
      const reportFile = path.join(dir, "report.json")
      writeFileSync(
        reportFile,
        JSON.stringify([
          { Name: "a", Result: "succeeded", Cmd: "apply", Started: "2026-01-01T00:05:00Z" },
          { Name: "b", Result: "failed", Cmd: "apply", Started: "2026-01-01T00:05:00Z" },
        ]),
      )
      const loaded = loadSources({ applyJsonFiles: applyFiles(dir, "apply.json"), reportFile })
      expect(loaded.warnings).toEqual([
        `The -json-into file of the unit b is from an earlier run, so the action ignored it: ${stalePath}`,
      ])
      const report = buildReport(loaded)
      expect(report.units.map((u) => [u.name, u.result, u.changes.map((c) => c.address)])).toEqual([
        ["a", "succeeded", ["a.fresh"]],
        ["b", "failed", []],
      ])
      expect(report.units[1]?.counts).toBeUndefined()
    } finally {
      rmSync(dir, { recursive: true })
    }
  })

  it("warns about a tfplan.json file of an earlier run and ignores its changes", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "sources-"))
    try {
      const planJsonDir = path.join(dir, "plans")
      const write = (unit: string, address: string, timestamp: string) => {
        mkdirSync(path.join(planJsonDir, unit), { recursive: true })
        const file = path.join(planJsonDir, unit, "tfplan.json")
        const change = { address, change: { actions: ["create"] } }
        writeFileSync(file, JSON.stringify({ timestamp, resource_changes: [change] }))
        return file
      }
      write("a", "a.fresh", "2026-01-01T00:05:00Z")
      const stalePath = write("b", "b.stale", "2026-01-01T00:00:00Z")
      const reportFile = path.join(dir, "report.json")
      writeFileSync(
        reportFile,
        JSON.stringify([
          { Name: "a", Result: "succeeded", Cmd: "plan", Started: "2026-01-01T00:05:00.5Z" },
          { Name: "b", Result: "failed", Cmd: "plan", Started: "2026-01-01T00:05:00.5Z" },
        ]),
      )
      const loaded = loadSources({ planJsonDir, reportFile })
      expect(loaded.warnings).toEqual([
        `The tfplan.json file of the unit b is from an earlier run, so the action ignored it: ${stalePath}`,
      ])
      const report = buildReport(loaded)
      expect(report.units.map((u) => [u.name, u.result, u.changes.map((c) => c.address)])).toEqual([
        ["a", "succeeded", ["a.fresh"]],
        ["b", "failed", []],
      ])
      expect(report.units[1]?.counts).toBeUndefined()
      const md = renderMarkdown(report, { header: "r", expand: false })
      expect(md).toContain("| [`b`](#user-content-trr-r-b) | ❌ failed |  |  |  |\n")
    } finally {
      rmSync(dir, { recursive: true })
    }
  })
})

describe("buildReport with unit names of different path depth", () => {
  const createChange = { address: "a.b", change: { actions: ["create"], importing: null } }
  const planOf = (name: string) =>
    parsePlan(JSON.stringify({ resource_changes: [createChange] }), name)
  const logOf = (...names: string[]) =>
    parseLog(
      names
        .map(
          (name) =>
            `12:00:00.000 STDOUT [${name}] tofu: Plan: 1 to add, 0 to change, 0 to destroy.`,
        )
        .join("\n"),
    )

  it("uses the longer log name for a plan with the shorter name", () => {
    const report = buildReport({ log: logOf("live/unit2"), plans: [planOf("unit2")] })
    expect(report.units.map((u) => u.name)).toEqual(["live/unit2"])
    expect(report.units[0]?.changes.map((c) => c.address)).toEqual(["a.b"])
    expect(report.units[0]?.counts).toEqual({ add: 1, change: 0, remove: 0 })
  })

  it("uses the shorter log name for a plan with the longer name", () => {
    const report = buildReport({ log: logOf("unit2"), plans: [planOf("live/unit2")] })
    expect(report.units.map((u) => u.name)).toEqual(["unit2"])
    expect(report.units[0]?.changes.map((c) => c.address)).toEqual(["a.b"])
  })

  it("keeps the plan under its own name when two log names match", () => {
    const report = buildReport({ log: logOf("a/unit2", "b/unit2"), plans: [planOf("unit2")] })
    expect(report.units.map((u) => u.name)).toEqual(["a/unit2", "b/unit2", "unit2"])
    expect(report.units[2]?.changes.map((c) => c.address)).toEqual(["a.b"])
    expect(report.units[0]?.changes).toEqual([])
  })

  it("merges a -json-into file and a report entry into one unit", () => {
    const apply = parseApply(
      ndjson(
        { type: "planned_change", change: { resource: { addr: "a.b" }, action: "create" } },
        summary("plan"),
        summary("apply"),
      ),
      "unit2",
    )
    const entries = parseReport(
      JSON.stringify([{ Name: "live/unit2", Result: "succeeded", Cmd: "apply" }]),
    )
    const report = buildReport({ applies: [apply], report: entries })
    expect(report.units.map((u) => u.name)).toEqual(["live/unit2"])
    expect(report.units[0]?.result).toBe("succeeded")
    expect(report.units[0]?.changes.map((c) => c.address)).toEqual(["a.b"])
  })

  it("keeps an early-exit unit apart from a log unit with a longer name", () => {
    const log = parseLog(
      [
        "12:00:00.000 STDERR [broken] tofu: Error: Invalid value for variable",
        "12:00:00.000 STDOUT [team/app] tofu:   # terraform_data.main will be updated in-place",
        '12:00:00.000 STDOUT [team/app] tofu:   ~ resource "terraform_data" "main" {',
        '12:00:00.000 STDOUT [team/app] tofu:       ~ input = "a" -> "b"',
        "12:00:00.000 STDOUT [team/app] tofu:     }",
        "12:00:00.000 STDOUT [team/app] tofu: Plan: 0 to add, 1 to change, 0 to destroy.",
      ].join("\n"),
    )
    const report = parseReport(
      JSON.stringify([
        { Name: "broken", Result: "failed", Reason: "run error", Cmd: "plan" },
        { Name: "team/app", Result: "succeeded", Cmd: "plan" },
        {
          Name: "app",
          Result: "early exit",
          Reason: "ancestor error",
          Cause: "broken",
          Cmd: "plan",
        },
      ]),
    )
    const units = buildReport({ log, report }).units
    expect(units.map((u) => [u.name, u.result, u.changes.map((c) => c.address)])).toEqual([
      ["app", "early exit", []],
      ["broken", "failed", []],
      ["team/app", "succeeded", ["terraform_data.main"]],
    ])
  })

  it("does not match the label of a file directly under the working directory", () => {
    const report = buildReport({ log: logOf("live/unit2"), applies: [parseApply("", ".")] })
    expect(report.units.map((u) => u.name)).toEqual([".", "live/unit2"])
  })
})

describe("unifyNames", () => {
  it("maps each name to the canonical name of the highest rank", () => {
    const mapping = unifyNames([
      ["live/unit2", "live/unit3"],
      ["unit2", "other"],
      ["live/unit3", "x/unit3"],
      ["."],
    ])
    expect([...mapping]).toEqual([
      ["live/unit2", "live/unit2"],
      ["live/unit3", "live/unit3"],
      ["unit2", "live/unit2"],
      ["other", "other"],
      ["x/unit3", "x/unit3"],
      [".", "."],
    ])
  })

  it("keeps a name with more than one match", () => {
    const mapping = unifyNames([["a/u", "b/u"], ["u"]])
    expect(mapping.get("u")).toBe("u")
  })

  it("does not map a name to a name of its own source", () => {
    const mapping = unifyNames([
      ["broken", "team/app"],
      ["broken", "team/app", "app"],
    ])
    expect(mapping.get("app")).toBe("app")
    expect(mapping.get("team/app")).toBe("team/app")
  })
})
