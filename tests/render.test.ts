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

function applyFiles(dir: string, name: string) {
  return readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((file) => path.basename(file) === name)
    .map((file) => ({
      unit: applyUnitLabel(path.join(dir, file), dir),
      path: path.join(dir, file),
    }))
}

function sources(scenario: string, kind: "plan" | "apply" | "destroy"): Sources {
  const dir = path.join(FIXTURES, scenario, kind)
  return loadSources({
    logFile: path.join(dir, `${kind}.log`),
    planJsonDir: kind === "plan" ? path.join(dir, "plans") : undefined,
    applyJsonFiles:
      kind === "plan" ? undefined : applyFiles(path.join(dir, "apply-json"), `${kind}.json`),
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
    ["destroy", "destroy"],
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
    expect(sections).toEqual(
      ["alpha", "beta", "delta", "zeta"].map(
        (name) =>
          `### <a id="trr-terragrunt-run-report-terragrunt-stack-${name}"></a>\`.terragrunt-stack/${name}\``,
      ),
    )
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
    expect(md).toContain("| [`a\\|b`](#user-content-trr-terragrunt-run-report-a-b) |")
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
    expect(md).toContain(
      "| [`u`](#user-content-trr-terragrunt-run-report-u) | ❌ failed | 1 of 2 | 0 | 1 |",
    )
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
    expect(md).toContain(
      "| [`u`](#user-content-trr-terragrunt-run-report-u) | ❌ failed | 0 of 2 | 0 | 0 |",
    )
    expect(md).toContain(
      "| [`v`](#user-content-trr-terragrunt-run-report-v) | ✅ succeeded |  |  |  |",
    )
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

describe("failed resources", () => {
  it("opens a failed resource and its group without expand", () => {
    const md = renderMarkdown(
      runReport(
        [
          unitReport({
            result: "failed",
            changes: [
              { address: "a.b", kind: "create", diff: "+ x", outcome: "errored" },
              { address: "a.c", kind: "create", diff: "+ y", outcome: "complete" },
              { address: "a.d", kind: "delete", diff: "- z", outcome: "pending" },
            ],
          }),
        ],
        "apply",
      ),
      OPTIONS,
    )
    expect(md).toContain("<details open><summary>✨ Create (2)</summary>")
    expect(md).toContain("<details open><summary><code>a.b</code> ❌ failed</summary>")
    expect(md).toContain("<details><summary><code>a.c</code> ✅</summary>")
    expect(md).toContain("<details><summary>🗑️ Destroy (1)</summary>")
    expect(md).toContain("<details><summary><code>a.d</code> ⏳ not applied</summary>")
    checkStructure(md)
  })
})

describe("unit anchors and links", () => {
  const changed = (name: string) =>
    unitReport({ name, changes: [{ address: "a.b", kind: "create", diff: "+ x" }] })
  const md = renderMarkdown(
    runReport([
      changed(".terragrunt-stack/alpha"),
      unitReport({ name: ".terragrunt-stack/beta", counts: { add: 0, change: 0, remove: 0 } }),
      changed("a b"),
      changed("a.b"),
    ]),
    { header: "Plan (changes)", expand: false },
  )

  it("puts the anchor on the heading and links the table row to it", () => {
    expect(md).toContain(
      '### <a id="trr-plan-changes-terragrunt-stack-alpha"></a>`.terragrunt-stack/alpha`',
    )
    expect(md).toContain(
      "| [`.terragrunt-stack/alpha`](#user-content-trr-plan-changes-terragrunt-stack-alpha) |",
    )
  })

  it("does not link a row without a section", () => {
    expect(md).toContain("| `.terragrunt-stack/beta` |")
  })

  it("adds a number to a second unit with the same id", () => {
    expect(md).toContain('### <a id="trr-plan-changes-a-b"></a>`a b`')
    expect(md).toContain('### <a id="trr-plan-changes-a-b-2"></a>`a.b`')
    expect(md).toContain("| [`a b`](#user-content-trr-plan-changes-a-b) |")
    expect(md).toContain("| [`a.b`](#user-content-trr-plan-changes-a-b-2) |")
  })
})

describe("collapsed unit sections", () => {
  const SUMMARY = "Plan: 1 to add, 0 to change, 0 to destroy."
  const units = (count: number): UnitReport[] =>
    Array.from({ length: count }, (_, i) =>
      unitReport({
        name: `u${String(i + 1).padStart(2, "0")}`,
        changes: [{ address: "a.b", kind: "create", diff: "+ x" }],
        counts: { add: 1, change: 0, remove: 0 },
        summaryLine: SUMMARY,
      }),
    )
  const eleven = (): UnitReport[] => {
    const list = units(11)
    list[9] = { ...list[9]!, result: "failed", stderr: "Error: boom" }
    delete list[10]!.summaryLine
    return list
  }

  it("collapses each section of a report with more than 10 sections", () => {
    const md = renderMarkdown(runReport(eleven()), OPTIONS)
    expect(md).toContain(
      [
        '### <a id="trr-terragrunt-run-report-u01"></a>`u01`',
        `<details><summary>${SUMMARY}</summary>`,
        "<details><summary>✨ Create (1)</summary>",
      ].join("\n\n"),
    )
    expect(md.match(/Plan: 1 to add/g)).toHaveLength(10)
    expect(md).not.toContain(`\n${SUMMARY}\n`)
    expect(md).toContain("`u11`\n\n<details><summary>Changes</summary>\n\n")
    checkStructure(md)
  })

  it("keeps the result line and the error of a failed unit visible and opens its section", () => {
    const md = renderMarkdown(runReport(eleven()), OPTIONS)
    expect(md).toContain(
      [
        '### <a id="trr-terragrunt-run-report-u10"></a>`u10`',
        "❌ failed",
        "```\nError: boom\n```",
        `<details open><summary>${SUMMARY}</summary>`,
      ].join("\n\n"),
    )
  })

  it("does not collapse a report with 10 sections", () => {
    const md = renderMarkdown(runReport(units(10)), OPTIONS)
    expect(md).not.toContain(`<summary>${SUMMARY}</summary>`)
    expect(md).toContain(`\n\n${SUMMARY}\n\n<details><summary>✨ Create (1)</summary>`)
  })

  it("opens the collapsed sections with expand", () => {
    const md = renderMarkdown(runReport(eleven()), { ...OPTIONS, expand: true })
    expect(md).toContain(`<details open><summary>${SUMMARY}</summary>`)
    expect(md).not.toContain("<details>")
  })
})

describe("the duration column", () => {
  it("shows the rounded duration of each unit and an empty cell without a duration", () => {
    const zero = { add: 0, change: 0, remove: 0 }
    const md = renderMarkdown(
      runReport([
        unitReport({ name: "a", counts: zero, durationSeconds: 12.4 }),
        unitReport({ name: "b", counts: zero, durationSeconds: 2.6 }),
        unitReport({ name: "c", counts: zero }),
      ]),
      OPTIONS,
    )
    expect(md).toContain(
      [
        "| Unit | Result | Add | Change | Destroy | Duration |",
        "| --- | --- | ---: | ---: | ---: | ---: |",
        "| `a` | ✅ no changes | 0 | 0 | 0 | 12s |",
        "| `b` | ✅ no changes | 0 | 0 | 0 | 3s |",
        "| `c` | ✅ no changes | 0 | 0 | 0 |  |",
      ].join("\n"),
    )
  })

  it("has no duration column when no unit has a duration", () => {
    const md = renderMarkdown(
      runReport([unitReport({ counts: { add: 0, change: 0, remove: 0 } })]),
      OPTIONS,
    )
    expect(md).toContain("| Unit | Result | Add | Change | Destroy |\n")
    expect(md).not.toContain("Duration")
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
