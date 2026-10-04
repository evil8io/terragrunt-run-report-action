import { readdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { applyUnitLabel } from "../src/apply.ts"
import {
  buildReport,
  loadSources,
  type RunReport,
  type Sources,
  type UnitReport,
} from "../src/model.ts"
import { markerLine, renderMarkdown, renderRunLink, resultText, statusLine } from "../src/render.ts"
import { parseReport } from "../src/report.ts"

const FIXTURES = fileURLToPath(new URL("./fixtures", import.meta.url))
const OPTIONS = { header: "Terragrunt run report", expand: false }

function applyFiles(dir: string) {
  return readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((file) => path.basename(file) === "apply.json")
    .map((file) => ({
      unit: applyUnitLabel(path.join(dir, file), dir),
      path: path.join(dir, file),
    }))
}

function sources(scenario: string, kind: "plan" | "apply"): Sources {
  const dir = path.join(FIXTURES, scenario, kind)
  return loadSources({
    logFile: path.join(dir, `${kind}.log`),
    planJsonDir: kind === "plan" ? path.join(dir, "plans") : undefined,
    applyJsonFiles: kind === "apply" ? applyFiles(path.join(dir, "apply-json")) : undefined,
    reportFile: path.join(dir, "report.json"),
  })
}

function unitReport(fields: Partial<UnitReport>): UnitReport {
  return { name: "u", result: "succeeded", changes: [], diagnostics: [], ...fields }
}

function runReport(units: UnitReport[], kind: RunReport["kind"] = "plan"): RunReport {
  return {
    kind,
    units,
    totals: { add: 0, change: 0, remove: 0, import: 0, forget: 0 },
    failedUnits: 0,
    earlyExitUnits: 0,
    excludedUnits: 0,
    changedUnits: 0,
    unchangedUnits: units.length,
    uncountedUnits: 0,
    empty: false,
    failed: false,
  }
}

function checkStructure(md: string): void {
  const lines = md.split("\n")
  let fence: string | undefined
  for (const [index, line] of lines.entries()) {
    const before = lines[index - 1]
    const after = lines[index + 1]
    if (fence !== undefined) {
      if (line !== fence) continue
      fence = undefined
      if (after !== undefined) expect(after, `after line ${index + 1}`).toBe("")
      continue
    }
    const run = /^`{3,}/.exec(line)?.[0]
    if (run !== undefined) {
      fence = run
      if (before !== undefined) expect(before, `before line ${index + 1}`).toBe("")
    } else if (line.startsWith("<details") || line === "</details>") {
      if (before !== undefined) expect(before, `before line ${index + 1}`).toBe("")
      if (after !== undefined) expect(after, `after line ${index + 1}`).toBe("")
    }
  }
  expect(fence).toBeUndefined()
  expect(md.match(/<details/g)?.length).toBe(md.match(/<\/details>/g)?.length)
}

describe("renderMarkdown for the fixtures", () => {
  it.each([
    ["changes", "plan"],
    ["changes", "apply"],
    ["failures", "plan"],
    ["failures", "apply"],
  ] as const)("renders %s/%s", async (scenario, kind) => {
    const md = renderMarkdown(buildReport(sources(scenario, kind)), OPTIONS)
    checkStructure(md)
    await expect(md).toMatchFileSnapshot(`./fixtures/${scenario}/${kind}/expected.md`)
  })

  it("starts with the marker line and the heading", () => {
    const md = renderMarkdown(buildReport(sources("changes", "plan")), OPTIONS)
    expect(md.split("\n").slice(0, 2)).toEqual([
      markerLine("Terragrunt run report"),
      "## Terragrunt run report",
    ])
  })

  it("has a section only for units with changes, diagnostics, or a failure", () => {
    const md = renderMarkdown(buildReport(sources("failures", "apply")), OPTIONS)
    const sections = md.split("\n").filter((line) => line.startsWith("### "))
    expect(sections).toEqual([
      "### `.terragrunt-stack/alpha`",
      "### `.terragrunt-stack/beta`",
      "### `.terragrunt-stack/delta`",
      "### `.terragrunt-stack/zeta`",
    ])
  })

  it("renders the stderr of a unit and not its JSON diagnostics", () => {
    const md = renderMarkdown(buildReport(sources("failures", "apply")), OPTIONS)
    expect(md.match(/Error: local-exec provisioner error/g)).toHaveLength(1)
  })
})

describe("renderMarkdown options and details", () => {
  const report = runReport([
    unitReport({
      changes: [
        { address: "a.b", kind: "create", diff: "+ x = 1", reason: "because of *this*" },
        { address: "a.c", kind: "delete" },
      ],
      counts: { add: 1, change: 0, remove: 1 },
    }),
  ])

  it("nests every resource in the details element of its group", () => {
    const md = renderMarkdown(report, OPTIONS)
    expect(md).toContain(
      [
        "<details><summary>✨ Create (1)</summary>",
        "<details><summary><code>a.b</code></summary>",
        "```diff\n+ x = 1\n```",
        "_→ because of \\*this\\*_",
        "</details>",
        "</details>",
      ].join("\n\n"),
    )
    checkStructure(md)
  })

  it("renders a change without a diff as a list item without a fence", () => {
    const md = renderMarkdown(report, OPTIONS)
    expect(md).toContain("<details><summary>🗑️ Destroy (1)</summary>\n\n- `a.c`\n\n</details>")
  })

  it("opens every details element with expand", () => {
    const md = renderMarkdown(report, { ...OPTIONS, expand: true })
    expect(md.match(/<details open>/g)).toHaveLength(3)
    expect(md).not.toContain("<details>")
  })

  it("escapes an address in the code element and a unit name in the table", () => {
    const md = renderMarkdown(
      runReport([
        unitReport({
          name: "a|b",
          changes: [{ address: 'x.y["<b>"]', kind: "update", diff: "! v = 1 -> 2" }],
        }),
      ]),
      OPTIONS,
    )
    expect(md).toContain('<code>x.y["&lt;b&gt;"]</code>')
    expect(md).toContain("| `a\\|b` |")
  })

  it("shows the apply outcome of each resource", () => {
    const md = renderMarkdown(
      runReport(
        [
          unitReport({
            changes: [
              {
                address: "a.a",
                kind: "create",
                diff: "+ x",
                outcome: "complete",
                elapsedSeconds: 3,
              },
              { address: "a.b", kind: "create", diff: "+ x", outcome: "errored" },
              { address: "a.c", kind: "create", outcome: "pending" },
            ],
          }),
        ],
        "apply",
      ),
      OPTIONS,
    )
    expect(md).toContain("<summary><code>a.a</code> ✅ 3s</summary>")
    expect(md).toContain("<summary><code>a.b</code> ❌ failed</summary>")
    expect(md).toContain("- `a.c` ⏳ not applied")
  })

  it("renders a move as a list item with the previous and the new address", () => {
    const md = renderMarkdown(
      runReport([
        unitReport({ changes: [{ address: "a.new", previousAddress: "a.old", kind: "move" }] }),
      ]),
      OPTIONS,
    )
    expect(md).toContain(
      "<details><summary>📦 Move (1)</summary>\n\n- <code>a.old</code> → <code>a.new</code>\n\n</details>",
    )
  })

  it("renders the run error under the status line when no unit failed", () => {
    const report = runReport([], "run")
    report.runError = "error occurred:\n\n* boom"
    const md = renderMarkdown(report, OPTIONS)
    expect(md).toContain(
      "**Run: 0 units.** 0 to add, 0 to change, 0 to destroy.\n\n❌ Run failed\n\n```\nerror occurred:\n\n* boom\n```\n",
    )
    checkStructure(md)
  })
})

describe("the unit table", () => {
  it.each<[Partial<UnitReport>, string]>([
    [{ counts: { add: 1, change: 0, remove: 0 } }, "✅ succeeded"],
    [{ counts: { add: 0, change: 0, remove: 0 } }, "✅ no changes"],
    [{ result: "succeeded", reason: "retry succeeded" }, "✅ succeeded (retry succeeded)"],
    [{ result: "failed", reason: "run error" }, "❌ failed (run error)"],
    [{ result: "failed" }, "❌ failed"],
    [
      { result: "early exit", reason: "ancestor error", cause: "delta" },
      "⏭️ early exit (ancestor error: delta)",
    ],
    [
      { result: "early exit", reason: "run error", cause: "line 1\nline 2" },
      "⏭️ early exit (run error)",
    ],
    [{ result: "excluded", reason: "exclude block" }, "⏸️ excluded"],
    [{ result: "unknown" }, "❔ unknown"],
  ])("renders the result %j as %s", (fields, text) => {
    expect(resultText(unitReport(fields))).toBe(text)
  })

  it("shows the applied count next to a different planned count", () => {
    const md = renderMarkdown(
      runReport(
        [
          unitReport({
            result: "failed",
            counts: { add: 2, change: 0, remove: 1 },
            appliedCounts: { add: 1, change: 0, remove: 1 },
          }),
          unitReport({ name: "v", result: "early exit" }),
        ],
        "apply",
      ),
      OPTIONS,
    )
    expect(md).toContain("| `u` | ❌ failed | 1 of 2 | 0 | 1 |")
    expect(md).toContain("| `v` | ⏭️ early exit |  |  |  |")
  })

  it("shows no applied count of a unit without the apply line, and 0 when it failed", () => {
    const md = renderMarkdown(
      runReport(
        [
          unitReport({ result: "failed", counts: { add: 2, change: 0, remove: 0 } }),
          unitReport({ name: "v", counts: { add: 1, change: 0, remove: 0 } }),
        ],
        "apply",
      ),
      OPTIONS,
    )
    expect(md).toContain("| `u` | ❌ failed | 0 of 2 | 0 | 0 |")
    expect(md).toContain("| `v` | ✅ succeeded |  |  |  |")
  })

  it("renders a unit without counts as succeeded with empty count cells", () => {
    const report = buildReport({
      report: parseReport(JSON.stringify([{ Name: "u", Result: "succeeded", Cmd: "plan" }])),
    })
    const md = renderMarkdown(report, OPTIONS)
    expect(md).toContain("| `u` | ✅ succeeded |  |  |  |")
    expect(statusLine(report)).toBe(
      "Plan: 1 unit, 1 without counts. 0 to add, 0 to change, 0 to destroy.",
    )
  })
})

describe("diagnostics", () => {
  it("renders the JSON diagnostics when the unit has no stderr", () => {
    const md = renderMarkdown(
      runReport([
        unitReport({
          result: "failed",
          diagnostics: [
            {
              severity: "error",
              summary: "Boom",
              detail: "Details.",
              address: "a.b",
              location: "main.tf:3",
            },
            { severity: "warning", summary: "Careful" },
          ],
        }),
      ]),
      OPTIONS,
    )
    expect(md).toContain(
      "```\nError: Boom\n  with a.b\n  on main.tf:3\nDetails.\n\nWarning: Careful\n```",
    )
  })

  it("renders the cause of a failed unit without other diagnostics", () => {
    const md = renderMarkdown(
      runReport([
        unitReport({ result: "failed", reason: "run error", cause: "error occurred:\n\n* x\n" }),
      ]),
      OPTIONS,
    )
    expect(md).toContain("❌ failed (run error)\n\n```\nerror occurred:\n\n* x\n```")
  })

  it("uses a longer fence when the text has a fence", () => {
    const md = renderMarkdown(runReport([unitReport({ stderr: "a\n```\nb" })]), OPTIONS)
    expect(md).toContain("````\na\n```\nb\n````")
  })
})

describe("statusLine", () => {
  it("names the kind, the unit counts, and the totals", () => {
    expect(statusLine(buildReport(sources("failures", "apply")))).toBe(
      "Apply: 6 units, 2 with changes, 1 unchanged, 2 failed, 1 early exit. 4 added, 0 changed, 5 destroyed.",
    )
    expect(statusLine(buildReport(sources("changes", "plan")))).toBe(
      "Plan: 6 units, 4 with changes, 2 unchanged. 6 to add, 0 to change, 6 to destroy.",
    )
  })

  it("names a destroy and its destroyed total", () => {
    const report = runReport([], "destroy")
    report.totals = { add: 0, change: 0, remove: 3, import: 0, forget: 0 }
    expect(statusLine(report)).toBe("Destroy: 0 units. 3 destroyed.")
  })

  it("adds import and forget only when they are not zero", () => {
    const report = runReport([])
    report.totals = { add: 1, change: 0, remove: 0, import: 2, forget: 1 }
    expect(statusLine(report)).toBe(
      "Plan: 0 units. 2 to import, 1 to add, 0 to change, 0 to destroy, 1 to forget.",
    )
  })
})

describe("renderRunLink", () => {
  it("ends the comment with the link to the run", () => {
    const content = renderRunLink("## Plan\n\nbody\n", "https://example.test/runs/1")
    expect(content.endsWith("\n\n[Workflow run](https://example.test/runs/1)\n")).toBe(true)
  })

  it("leaves the comment as it is without a link", () => {
    expect(renderRunLink("## Plan\n", undefined)).toBe("## Plan\n")
  })
})
