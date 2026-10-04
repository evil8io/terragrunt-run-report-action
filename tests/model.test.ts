import { readdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { applyUnitLabel } from "../src/apply.ts"
import { parseLog } from "../src/log.ts"
import { buildReport, loadSources, type RunReport, type Sources } from "../src/model.ts"
import { parsePlan } from "../src/plan.ts"

const FIXTURES = fileURLToPath(new URL("./fixtures", import.meta.url))

function applyFiles(dir: string) {
  return readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((file) => path.basename(file) === "apply.json")
    .map((file) => ({
      unit: applyUnitLabel(path.join(dir, file), dir),
      path: path.join(dir, file),
    }))
}

function sources(scenario: "changes" | "failures", kind: "plan" | "apply"): Sources {
  const dir = path.join(FIXTURES, scenario, kind)
  if (kind === "plan") {
    return loadSources({
      logFile: path.join(dir, "plan.log"),
      planJsonDir: path.join(dir, "plans"),
      reportFile: path.join(dir, "report.json"),
    })
  }
  return loadSources({
    logFile: path.join(dir, "apply.log"),
    applyJsonFiles: applyFiles(path.join(dir, "apply-json")),
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
      '! id               = "25bebadf-87d5-5ca0-4682-b2264c71b4b1" -> (known after apply)\n! triggers_replace = "phase-1" -> "phase-2"',
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

describe("buildReport for failures/plan", () => {
  const report = buildReport(sources("failures", "plan"))
  const zeta = unit(report, "zeta")

  it("marks zeta as failed with the report reason", () => {
    expect(zeta.result).toBe("failed")
    expect(zeta.reason).toBe("run error")
    expect(zeta.stderr?.startsWith("Error: Resource precondition failed")).toBe(true)
    expect(report.failed).toBe(true)
  })

  it("takes the changes of zeta from the log blocks, without a tfplan.json", () => {
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
    expect(delta.diagnostics.map((d) => d.summary)).toEqual(["local-exec provisioner error"])
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
    expect(zeta.diagnostics.map((d) => d.summary)).toEqual(["Resource precondition failed"])
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

describe("buildReport with one source", () => {
  it("works from the log alone", () => {
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

  it("works from the plan JSON alone", () => {
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

  it("works from the apply JSON alone", () => {
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

  it("works from the report alone", () => {
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

  it("leaves out a no-op change", () => {
    const change = { address: "a.b", change: { actions: ["no-op"] } }
    const plan = parsePlan(JSON.stringify({ resource_changes: [change] }), "u")
    expect(buildReport({ plans: [plan] }).units[0]?.changes).toEqual([])
  })
})

describe("loadSources", () => {
  it("throws for a named file that does not exist", () => {
    expect(() => loadSources({ logFile: path.join(FIXTURES, "missing.log") })).toThrow(/ENOENT/)
  })
})
