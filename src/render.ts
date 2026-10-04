import {
  hasChanges,
  hasCounts,
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
  ["move", "📦 Move"],
  ["open", "👻 Ephemeral"],
]

const KIND_LABELS = { plan: "Plan", apply: "Apply", destroy: "Destroy", run: "Run" } as const

const COLLAPSED_SECTIONS_ABOVE = 10

const FENCE_RUN = /^(`{3,}|~{3,})/

/** The open fence and the number of open details elements at a line of the report. */
export type MarkdownState = {
  fence?: { line: string; run: string }
  details: number
}

export function nextState(state: MarkdownState, line: string): MarkdownState {
  const run = FENCE_RUN.exec(line)?.[1]
  if (state.fence) {
    const { run: open } = state.fence
    const closes =
      run !== undefined && run[0] === open[0] && run.length >= open.length && line.trim() === run
    return closes ? { details: state.details } : state
  }
  if (run !== undefined) return { fence: { line, run }, details: state.details }
  if (line.startsWith("<details")) return { details: state.details + 1 }
  if (line === "</details>") return { details: Math.max(0, state.details - 1) }
  return state
}

/** Returns the text that closes the open fence and the open details elements. */
export function closeState(state: MarkdownState): string {
  return `${state.fence ? `\n${state.fence.run}` : ""}${"\n\n</details>".repeat(state.details)}`
}

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

function details(summary: string, body: readonly string[], open: boolean): string {
  return [
    `<details${open ? " open" : ""}><summary>${summary}</summary>`,
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
  if (report.uncountedUnits > 0) parts.push(`${report.uncountedUnits} without counts`)
  if (report.failedUnits > 0) parts.push(`${report.failedUnits} failed`)
  if (report.earlyExitUnits > 0) parts.push(plural(report.earlyExitUnits, "early exit", "s"))
  if (report.excludedUnits > 0) parts.push(`${report.excludedUnits} excluded`)
  return `${KIND_LABELS[report.kind]}: ${parts.join(", ")}.`
}

function totalsPhrase(report: RunReport): string {
  const { add, change, remove, import: imports, forget } = report.totals
  if (report.kind === "destroy") return `${remove} destroyed.`
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
      return hasChanges(unit) || !hasCounts(unit) ? "✅ succeeded" : "✅ no changes"
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

/** A failed unit without applied counts applied nothing of its planned counts. */
function countCell(unit: UnitReport, key: keyof Counts, apply: boolean): string {
  const planned = unit.counts?.[key]
  if (!apply) return planned === undefined ? "" : String(planned)
  const applied =
    unit.appliedCounts?.[key] ?? (unit.result === "failed" && planned !== undefined ? 0 : undefined)
  if (applied === undefined) return ""
  if (planned === undefined || applied === planned) return String(applied)
  return `${applied} of ${planned}`
}

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function anchorIds(header: string, units: readonly UnitReport[]): Map<UnitReport, string> {
  const ids = new Map<UnitReport, string>()
  const used = new Set<string>()
  for (const unit of units) {
    const base = `trr-${slug(header)}-${slug(unit.name)}`
    let id = base
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`
    used.add(id)
    ids.set(unit, id)
  }
  return ids
}

function durationCell(unit: UnitReport): string {
  return unit.durationSeconds === undefined ? "" : `${Math.round(unit.durationSeconds)}s`
}

function table(report: RunReport, ids: ReadonlyMap<UnitReport, string>): string {
  const apply = report.kind === "apply" || report.kind === "destroy"
  const duration = report.units.some((unit) => unit.durationSeconds !== undefined)
  const rows = report.units.map((unit) => {
    const id = ids.get(unit)
    // GitHub renders the id of an element in a comment with the prefix user-content-.
    const name = id === undefined ? code(unit.name) : `[${code(unit.name)}](#user-content-${id})`
    const cells = [
      cell(name),
      resultText(unit),
      countCell(unit, "add", apply),
      countCell(unit, "change", apply),
      countCell(unit, "remove", apply),
    ]
    if (duration) cells.push(durationCell(unit))
    return `| ${cells.join(" | ")} |`
  })
  const titles = ["Unit", "Result", "Add", "Change", "Destroy"]
  const aligns = ["---", "---", "---:", "---:", "---:"]
  if (duration) {
    titles.push("Duration")
    aligns.push("---:")
  }
  return [`| ${titles.join(" | ")} |`, `| ${aligns.join(" | ")} |`, ...rows].join("\n")
}

function outcomeText(change: ResourceChange): string {
  switch (change.outcome) {
    case "complete":
      return change.elapsedSeconds === undefined ? " ✅" : ` ✅ ${change.elapsedSeconds}s`
    case "errored":
      return " ❌ failed"
    case "pending":
      return " ⏳ not applied"
    default:
      return ""
  }
}

function reasonText(change: ResourceChange): string | undefined {
  return change.reason ? `_→ ${markdown(change.reason)}_` : undefined
}

function listName(change: ResourceChange): string {
  if (change.kind !== "move" || change.previousAddress === undefined) return code(change.address)
  return `<code>${html(change.previousAddress)}</code> → <code>${html(change.address)}</code>`
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
      list.push(`- ${listName(change)}${outcomeText(change)}${reason ? ` ${reason}` : ""}`)
      continue
    }
    flush()
    const body = [fence(change.diff, "diff")]
    if (reason) body.push(reason)
    const summary = `<code>${html(change.address)}</code>${outcomeText(change)}`
    blocks.push(details(summary, body, expand || change.outcome === "errored"))
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

function groupBlocks(unit: UnitReport, expand: boolean): string[] {
  const blocks: string[] = []
  for (const [kind, label] of GROUPS) {
    const changes = unit.changes.filter((change) => change.kind === kind)
    if (changes.length === 0) continue
    const open = expand || changes.some((change) => change.outcome === "errored")
    blocks.push(details(`${label} (${changes.length})`, changeBlocks(changes, expand), open))
  }
  if (unit.outputsDiff !== undefined) {
    blocks.push(details("Changes to Outputs", [fence(unit.outputsDiff, "diff")], expand))
  }
  return blocks
}

type SectionOptions = { id: string; expand: boolean; collapse: boolean }

function section(unit: UnitReport, { id, expand, collapse }: SectionOptions): string {
  const parts = [`### <a id="${id}"></a>${code(unit.name)}`]
  if (unit.result !== "succeeded") parts.push(resultText(unit))
  const diagnostics = diagnosticsText(unit)
  if (diagnostics !== undefined) parts.push(fence(diagnostics))
  const blocks = groupBlocks(unit, expand)
  if (collapse && blocks.length > 0) {
    const summary = unit.summaryLine === undefined ? "Changes" : html(unit.summaryLine)
    parts.push(details(summary, blocks, expand || unit.result === "failed"))
  } else {
    if (unit.summaryLine !== undefined) parts.push(markdown(unit.summaryLine))
    parts.push(...blocks)
  }
  return parts.join("\n\n")
}

export function renderMarkdown(report: RunReport, options: RenderOptions): string {
  const parts = [
    `${markerLine(options.header)}\n## ${options.header}`,
    `**${unitsPhrase(report)}** ${totalsPhrase(report)}`,
  ]
  if (report.runError !== undefined && report.failedUnits === 0) {
    parts.push("❌ Run failed", fence(report.runError))
  }
  const sectioned = report.units.filter(hasSection)
  const ids = anchorIds(options.header, sectioned)
  if (report.units.length > 0) parts.push(table(report, ids))
  const collapse = sectioned.length > COLLAPSED_SECTIONS_ABOVE
  for (const [unit, id] of ids) parts.push(section(unit, { id, expand: options.expand, collapse }))
  return `${parts.join("\n\n")}\n`
}

/** The last line of a pull request comment, when the run has a link. */
export function renderRunLink(markdown: string, runUrl: string | undefined): string {
  if (runUrl === undefined) return markdown
  return `${markdown.trimEnd()}\n\n[Workflow run](${runUrl})\n`
}
