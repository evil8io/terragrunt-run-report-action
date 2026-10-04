import { mkdtempSync, rmSync, utimesSync, writeFileSync } from "node:fs"
import { readFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { applyUnitLabel, parseApply, readApplyFiles } from "../src/apply.ts"

function unitApply(scenario: string, unit: string) {
  const file = fileURLToPath(
    new URL(
      `./fixtures/${scenario}/apply/apply-json/.terragrunt-stack/${unit}/.terragrunt-cache/x/y/apply.json`,
      import.meta.url,
    ),
  )
  return parseApply(readFileSync(file, "utf8"), unit)
}

describe("applyUnitLabel", () => {
  it.each([
    [
      "/w/.terragrunt-stack/alpha/.terragrunt-cache/x/y/apply.json",
      "/w",
      ".terragrunt-stack/alpha",
    ],
    ["/w/a/.terragrunt-cache/x/b/.terragrunt-cache/y/apply.json", "/w", "a"],
    ["/w/.terragrunt-cache/x/y/apply.json", "/w", "."],
    ["/w/units/beta/apply.json", "/w", "units/beta"],
    ["/w/apply.json", "/w", "."],
  ])("labels %s relative to %s as %s", (file, workingDirectory, label) => {
    expect(applyUnitLabel(file, workingDirectory)).toBe(label)
  })

  it("resolves relative paths against the process directory", () => {
    expect(applyUnitLabel("stack/u/.terragrunt-cache/a/b/apply.json", "stack")).toBe("u")
  })
})

describe("parseApply", () => {
  it("reads a unit that failed during the apply", () => {
    const delta = unitApply("failures", "delta")
    expect(delta.version).toBe("1.13.1")
    expect(delta.planned).toEqual([
      { address: "terraform_data.fail[0]", action: "create" },
      { address: "local_file.main", action: "replace", reason: "cannot_update" },
    ])
    expect(delta.planCounts).toEqual({ add: 2, change: 0, remove: 1 })
    expect(delta.applyCounts).toBeUndefined()
    expect(delta.hookCounts).toEqual({ add: 1, change: 0, remove: 1 })
    expect(delta.outcomes.get("terraform_data.fail[0]")).toEqual({
      outcome: "errored",
      elapsedSeconds: 0,
    })
    expect(delta.outcomes.get("local_file.main")).toEqual({
      outcome: "complete",
      elapsedSeconds: 0,
    })
    expect(delta.lastSummary).toBe("Plan: 2 to add, 0 to change, 1 to destroy.")
    expect(delta.diagnostics).toEqual([
      {
        severity: "error",
        summary: "local-exec provisioner error",
        detail:
          "Error running command 'echo 'simulated failure in delta' >&2; exit 1': exit status 1. Output: simulated failure in delta",
        address: "terraform_data.fail[0]",
        location: "main.tf:68",
      },
    ])
    expect(delta.skippedLines).toBe(0)
  })

  it("reads a unit that failed at plan time", () => {
    const zeta = unitApply("failures", "zeta")
    expect(zeta.planned).toHaveLength(1)
    expect(zeta.outcomes.size).toBe(0)
    expect(zeta.hookCounts).toEqual({ add: 0, change: 0, remove: 0 })
    expect(zeta.diagnostics.map((d) => [d.summary, d.location])).toEqual([
      ["Resource precondition failed", "main.tf:43"],
    ])
  })

  it("reads the apply summary and only the planned output actions", () => {
    const alpha = unitApply("changes", "alpha")
    expect(alpha.applyCounts).toEqual({ add: 3, change: 0, remove: 2 })
    expect(alpha.lastSummary).toBe("Apply complete! Resources: 3 added, 0 changed, 2 destroyed.")
    expect(Object.fromEntries(alpha.outputActions)).toEqual({
      content: "update",
      name: "noop",
      replace_id: "update",
    })
  })

  it("counts unparsable lines and skips unknown types", () => {
    const text = [
      '{"type":"version","tofu":"1.13.1","ui":"1.2"}',
      "not json",
      '{"no":"type"}',
      '{"type":"planned_change","change":{}}',
      '{"type":"future_message","x":1}',
      "",
    ].join("\n")
    const result = parseApply(text, "u")
    expect(result.skippedLines).toBe(3)
    expect(result.planned).toEqual([])
  })
})

describe("readApplyFiles", () => {
  it("reads the newest file when a unit has more than one", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "apply-"))
    try {
      const old = path.join(dir, "old.json")
      const fresh = path.join(dir, "new.json")
      writeFileSync(old, '{"type":"version","tofu":"1.0.0"}\n')
      writeFileSync(fresh, '{"type":"version","tofu":"2.0.0"}\n')
      utimesSync(old, new Date(1_000_000), new Date(1_000_000))
      const result = readApplyFiles([
        { unit: "u", path: fresh },
        { unit: "u", path: old },
      ])
      expect(result.map((apply) => apply.version)).toEqual(["2.0.0"])
    } finally {
      rmSync(dir, { recursive: true })
    }
  })
})
