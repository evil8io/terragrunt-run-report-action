import {
  hasChanges,
  type ChangeKind,
  type Counts,
  type ResourceChange,
  type RunReport,
  type UnitReport,
} from "./model.ts"

export type RenderOptions = {
  header: string
  expand: boolean
}

const GROUPS: readonly [ChangeKind, string][] = [
  ["create", "✨ Create"],
  ["update", "♻️ Update"],
  ["replace", "⚙️ Replace"],
  ["delete", "🗑️ Destroy"],
  ["read", "📖 Read"],
  ["import", "📥 Import"],
  ["forget", "👋 Forget"],
  ["open", "👻 Ephemeral"],
]

const KIND_LABELS = { plan: "Plan", apply: "Apply", run: "Run" } as const

export function markerLine(header: string): string {
  return `<!-- terragrunt-run-report: ${header.replaceAll("-->", "-- >")} -->`
}

function longestRun(text: string, char: string): number {
  let longest = 0
  let current = 0
  for (const c of text) {
    current = c === char ? current + 1 : 0
    if (current > longest) longest = current
  }
  return longest
}

export function fence(body: string, info = "", minimum = 3): string {
  const ticks = "`".repeat(Math.max(minimum, longestRun(body, "`") + 1))
  return `${ticks}${info}\n${body}\n${ticks}`
}

function code(text: string): string {
  const ticks = "`".repeat(longestRun(text, "`") + 1)
  const pad = text.startsWith("`") || text.endsWith("`") ? " " : ""
  return `${ticks}${pad}${text}${pad}${ticks}`
}

function html(text: string): string {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
}

function markdown(text: string): string {
  return text.replace(/[\\`*_<>&|~]/g, "\\$&")
}

function cell(text: string): string {
  return text.replaceAll("|", "\\|")
}

function details(summary: string, body: readonly string[], expand: boolean): string {
  return [
    `<details${expand ? " open" : ""}><summary>${summary}</summary>`,
    ...body,
    "</details>",
  ].join("\n\n")
}

function plural(count: number, word: string, suffix = "s"): string {
  return `${count} ${word}${count === 1 ? "" : suffix}`
}

function unitsPhrase(report: RunReport): string {
  const parts = [plural(report.units.length, "unit")]
  if (report.changedUnits > 0) parts.push(`${report.changedUnits} with changes`)
  if (report.unchangedUnits > 0) parts.push(`${report.unchangedUnits} unchanged`)
  if (report.failedUnits > 0) parts.push(`${report.failedUnits} failed`)
  if (report.earlyExitUnits > 0) parts.push(plural(report.earlyExitUnits, "early exit", "s"))
  if (report.excludedUnits > 0) parts.push(`${report.excludedUnits} excluded`)
  return `${KIND_LABELS[report.kind]}: ${parts.join(", ")}.`
}

function totalsPhrase(report: RunReport): string {
  const { add, change, remove, import: imports, forget } = report.totals
  if (report.kind === "apply") {
    const parts = [`${add} added`, `${change} changed`, `${remove} destroyed`]
    if (imports > 0) parts.unshift(`${imports} imported`)
    if (forget > 0) parts.push(`${forget} forgotten`)
    return `${parts.join(", ")}.`
  }
  const parts = [`${add} to add`, `${change} to change`, `${remove} to destroy`]
  if (imports > 0) parts.unshift(`${imports} to import`)
  if (forget > 0) parts.push(`${forget} to forget`)
  return `${parts.join(", ")}.`
}

export function statusLine(report: RunReport): string {
  return `${unitsPhrase(report)} ${totalsPhrase(report)}`
}

export function resultText(unit: UnitReport): string {
  const reason = unit.reason ? markdown(unit.reason) : undefined
  switch (unit.result) {
    case "succeeded":
      if (reason) return `✅ succeeded (${reason})`
      return hasChanges(unit) ? "✅ succeeded" : "✅ no changes"
    case "failed":
      return reason ? `❌ failed (${reason})` : "❌ failed"
    case "early exit": {
      const cause = unit.cause && !unit.cause.includes("\n") ? markdown(unit.cause) : undefined
      if (reason && cause) return `⏭️ early exit (${reason}: ${cause})`
      return reason ? `⏭️ early exit (${reason})` : "⏭️ early exit"
    }
    case "excluded":
      return "⏸️ excluded"
    default:
      return "❔ unknown"
  }
}

function countCell(unit: UnitReport, key: keyof Counts, apply: boolean): string {
  const planned = unit.counts?.[key]
  const applied = apply ? unit.appliedCounts?.[key] : undefined
  if (planned === undefined) return applied === undefined ? "" : String(applied)
  if (applied === undefined || applied === planned) return String(planned)
  return `${applied} of ${planned}`
}

function table(report: RunReport): string {
  const apply = report.kind === "apply"
  const rows = report.units.map((unit) => {
    const cells = [
      cell(code(unit.name)),
      resultText(unit),
      countCell(unit, "add", apply),
      countCell(unit, "change", apply),
      countCell(unit, "remove", apply),
    ]
    return `| ${cells.join(" | ")} |`
  })
  return [
    "| Unit | Result | Add | Change | Destroy |",
    "| --- | --- | ---: | ---: | ---: |",
    ...rows,
  ].join("\n")
}

function outcomeText(change: ResourceChange): string {
  switch (change.outcome) {
    case "complete":
      return change.elapsedSeconds === undefined ? " ✅" : ` ✅ ${change.elapsedSeconds}s`
    case "errored":
      return " ❌ errored"
    case "pending":
      return " ⏳ not applied"
    default:
      return ""
  }
}

function reasonText(change: ResourceChange): string | undefined {
  return change.reason ? `_→ ${markdown(change.reason)}_` : undefined
}

function changeBlocks(changes: readonly ResourceChange[], expand: boolean): string[] {
  const blocks: string[] = []
  let list: string[] = []
  const flush = () => {
    if (list.length > 0) blocks.push(list.join("\n"))
    list = []
  }
  for (const change of changes) {
    const reason = reasonText(change)
    if (change.diff === undefined) {
      list.push(`- ${code(change.address)}${outcomeText(change)}${reason ? ` ${reason}` : ""}`)
      continue
    }
    flush()
    const body = [fence(change.diff, "diff")]
    if (reason) body.push(reason)
    blocks.push(details(`<code>${html(change.address)}</code>${outcomeText(change)}`, body, expand))
  }
  flush()
  return blocks
}

function diagnosticsText(unit: UnitReport): string | undefined {
  if (unit.stderr !== undefined) return unit.stderr
  if (unit.diagnostics.length > 0) {
    return unit.diagnostics
      .map((diagnostic) => {
        const lines = [
          `${diagnostic.severity === "error" ? "Error" : "Warning"}: ${diagnostic.summary}`,
        ]
        if (diagnostic.address) lines.push(`  with ${diagnostic.address}`)
        if (diagnostic.location) lines.push(`  on ${diagnostic.location}`)
        if (diagnostic.detail) lines.push(diagnostic.detail)
        return lines.join("\n")
      })
      .join("\n\n")
  }
  if (unit.result === "failed" && unit.cause) return unit.cause.trimEnd()
  return undefined
}

function hasSection(unit: UnitReport): boolean {
  if (unit.result === "early exit" || unit.result === "excluded") return false
  return (
    unit.result === "failed" ||
    hasChanges(unit) ||
    unit.stderr !== undefined ||
    unit.diagnostics.length > 0
  )
}

function section(unit: UnitReport, expand: boolean): string {
  const parts = [`### ${code(unit.name)}`]
  if (unit.result !== "succeeded") parts.push(resultText(unit))
  const diagnostics = diagnosticsText(unit)
  if (diagnostics !== undefined) parts.push(fence(diagnostics))
  if (unit.summaryLine !== undefined) parts.push(markdown(unit.summaryLine))
  for (const [kind, label] of GROUPS) {
    const changes = unit.changes.filter((change) => change.kind === kind)
    if (changes.length === 0) continue
    parts.push(details(`${label} (${changes.length})`, changeBlocks(changes, expand), expand))
  }
  if (unit.outputsDiff !== undefined) {
    parts.push(details("Changes to Outputs", [fence(unit.outputsDiff, "diff")], expand))
  }
  return parts.join("\n\n")
}

export function renderMarkdown(report: RunReport, options: RenderOptions): string {
  const parts = [
    `${markerLine(options.header)}\n## ${options.header}`,
    `**${unitsPhrase(report)}** ${totalsPhrase(report)}`,
  ]
  if (report.units.length > 0) parts.push(table(report))
  for (const unit of report.units) {
    if (hasSection(unit)) parts.push(section(unit, options.expand))
  }
  return `${parts.join("\n\n")}\n`
}
