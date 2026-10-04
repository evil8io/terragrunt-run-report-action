import { readFileSync } from "node:fs"
import { readApplyFiles, type ApplyFile, type UnitApply } from "./apply.ts"
import { linesByUnit, parseLog, type LogEntry, type UnitOutput } from "./log.ts"
import { readPlanDir, type UnitPlan } from "./plan.ts"
import { readReportFile, type ReportEntry } from "./report.ts"
import {
  extractBlocks,
  extractOutputs,
  findSummaries,
  formatDiff,
  phraseKind,
  stderrText,
  type DiffBlock,
} from "./text.ts"

export type ChangeKind =
  "create" | "update" | "replace" | "delete" | "read" | "import" | "forget" | "open"

/** "pending": the change was planned, but the apply never ran it to the end. */
export type ApplyOutcome = "complete" | "errored" | "pending"

export type Counts = {
  add: number
  change: number
  remove: number
  import?: number
  forget?: number
}

export type ResourceChange = {
  address: string
  kind: ChangeKind
  reason?: string
  /** Diff lines for a fenced diff block, joined by newlines. */
  diff?: string
  outcome?: ApplyOutcome
  elapsedSeconds?: number
}

export type Diagnostic = {
  severity: "error" | "warning"
  summary: string
  detail?: string
  address?: string
  location?: string
}

export type UnitResult = "succeeded" | "failed" | "early exit" | "excluded" | "unknown"

export type UnitReport = {
  name: string
  result: UnitResult
  reason?: string
  cause?: string
  durationSeconds?: number
  summaryLine?: string
  /** The planned counts. */
  counts?: Counts
  /** The applied counts. Only an apply report has them. */
  appliedCounts?: Counts
  changes: ResourceChange[]
  outputsDiff?: string
  stderr?: string
  diagnostics: Diagnostic[]
}

export type Totals = Required<Counts>

export type RunKind = "plan" | "apply" | "run"

export type RunReport = {
  kind: RunKind
  units: UnitReport[]
  totals: Totals
  failedUnits: number
  earlyExitUnits: number
  excludedUnits: number
  changedUnits: number
  unchangedUnits: number
  empty: boolean
  failed: boolean
}

/** A source is undefined when its input is not set. */
export type Sources = {
  log?: LogEntry[] | undefined
  plans?: UnitPlan[] | undefined
  applies?: UnitApply[] | undefined
  report?: ReportEntry[] | undefined
}

export type SourceFiles = {
  logFile?: string | undefined
  planJsonDir?: string | undefined
  applyJsonFiles?: readonly ApplyFile[] | undefined
  reportFile?: string | undefined
}

export function loadSources(files: SourceFiles): Sources {
  const sources: Sources = {}
  if (files.logFile !== undefined) sources.log = parseLog(readFileSync(files.logFile, "utf8"))
  if (files.planJsonDir !== undefined) sources.plans = readPlanDir(files.planJsonDir)
  if (files.applyJsonFiles !== undefined) sources.applies = readApplyFiles(files.applyJsonFiles)
  if (files.reportFile !== undefined) sources.report = readReportFile(files.reportFile)
  return sources
}

const APPLY_KINDS: ReadonlySet<string> = new Set<ChangeKind>([
  "create",
  "update",
  "replace",
  "delete",
  "read",
  "import",
  "forget",
  "open",
])

/** The header phrase of a tofu diff block already states these reasons. */
const IMPLIED_REASONS: ReadonlySet<string> = new Set([
  "replace_because_cannot_update",
  "cannot_update",
  "replace_because_tainted",
  "tainted",
  "replace_by_request",
  "requested",
])

const TERMINAL_RESULTS: ReadonlySet<UnitResult> = new Set(["failed", "early exit", "excluded"])

type Draft = { address: string; kind: ChangeKind; jsonReason?: string | undefined }

type UnitSources = {
  output: UnitOutput | undefined
  plan: UnitPlan | undefined
  apply: UnitApply | undefined
  entries: ReportEntry[]
}

function compare(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

function planKind(actions: readonly string[], importing: boolean): ChangeKind | undefined {
  switch (actions.join(",")) {
    case "create":
      return "create"
    case "delete":
      return "delete"
    case "update":
      return "update"
    case "read":
      return "read"
    case "delete,create":
    case "create,delete":
    case "create,forget":
      return "replace"
    case "forget":
      return "forget"
    case "open":
      return "open"
    case "no-op":
      return importing ? "import" : undefined
    default:
      return undefined
  }
}

function planCounts(plan: UnitPlan): Counts {
  const counts: Required<Counts> = { add: 0, change: 0, remove: 0, import: 0, forget: 0 }
  for (const change of plan.resourceChanges) {
    if (change.importing) counts.import++
    for (const action of change.actions) {
      if (action === "create") counts.add++
      else if (action === "delete") counts.remove++
      else if (action === "update") counts.change++
      else if (action === "forget") counts.forget++
    }
  }
  return trimCounts(counts)
}

function kindCounts(changes: readonly { kind: ChangeKind }[]): Counts {
  const counts: Required<Counts> = { add: 0, change: 0, remove: 0, import: 0, forget: 0 }
  for (const { kind } of changes) {
    if (kind === "create" || kind === "replace") counts.add++
    if (kind === "delete" || kind === "replace") counts.remove++
    if (kind === "update") counts.change++
    if (kind === "import") counts.import++
    if (kind === "forget") counts.forget++
  }
  return trimCounts(counts)
}

function trimCounts(counts: Required<Counts>): Counts {
  const result: Counts = { add: counts.add, change: counts.change, remove: counts.remove }
  if (counts.import > 0) result.import = counts.import
  if (counts.forget > 0) result.forget = counts.forget
  return result
}

function planSummaryLine(counts: Counts): string {
  const imports = counts.import ? `${counts.import} to import, ` : ""
  const forgets = counts.forget ? `, ${counts.forget} to forget` : ""
  return `Plan: ${imports}${counts.add} to add, ${counts.change} to change, ${counts.remove} to destroy${forgets}.`
}

function humanReason(reason: string | undefined): string | undefined {
  if (!reason || IMPLIED_REASONS.has(reason)) return undefined
  return reason.replaceAll("_", " ")
}

function jsonChanges(kind: RunKind, sources: UnitSources): Draft[] | undefined {
  const fromPlan = sources.plan?.resourceChanges.flatMap((change): Draft[] => {
    const changeKind = planKind(change.actions, change.importing)
    return changeKind
      ? [{ address: change.address, kind: changeKind, jsonReason: change.actionReason }]
      : []
  })
  const fromApply = sources.apply?.planned.flatMap((change): Draft[] =>
    APPLY_KINDS.has(change.action)
      ? [{ address: change.address, kind: change.action as ChangeKind, jsonReason: change.reason }]
      : [],
  )
  return kind === "apply" ? (fromApply ?? fromPlan) : (fromPlan ?? fromApply)
}

function changeBlocks(stdout: readonly string[], known: Iterable<string>): Map<string, DiffBlock> {
  const blocks = new Map<string, DiffBlock>()
  for (const block of extractBlocks(stdout, known)) {
    if (phraseKind(block.phrase)) blocks.set(block.address, block)
  }
  return blocks
}

function toChange(draft: Draft, block: DiffBlock | undefined, apply: UnitApply | undefined) {
  const change: ResourceChange = { address: draft.address, kind: draft.kind }
  const reason =
    block && block.reasons.length > 0 ? block.reasons.join("; ") : humanReason(draft.jsonReason)
  if (reason) change.reason = reason
  const diff = block ? formatDiff(block.body) : []
  if (diff.length > 0) change.diff = diff.join("\n")
  if (apply) {
    const hook = apply.outcomes.get(draft.address)
    const outcome =
      hook?.outcome === "complete" || hook?.outcome === "errored" ? hook.outcome : "pending"
    change.outcome = outcome
    if (outcome !== "pending" && hook?.elapsedSeconds !== undefined) {
      change.elapsedSeconds = hook.elapsedSeconds
    }
  }
  return change
}

function outputNamesDiff(actions: ReadonlyMap<string, string> | undefined): string | undefined {
  const markers: Record<string, string> = { create: "+", update: "!", delete: "-" }
  const lines = [...(actions ?? [])]
    .filter(([, action]) => markers[action] !== undefined)
    .sort(([a], [b]) => compare(a, b))
    .map(([name, action]) => `${markers[action]} ${name}`)
  return lines.length > 0 ? lines.join("\n") : undefined
}

function buildUnit(name: string, kind: RunKind, sources: UnitSources): UnitReport {
  const stdout = sources.output?.stdout ?? []
  const stderr = stderrText(sources.output?.stderr ?? [])
  const drafts = jsonChanges(kind, sources)
  const blocks = changeBlocks(stdout, drafts?.map((draft) => draft.address) ?? [])
  const changes = (
    drafts ??
    [...blocks.values()].map((block): Draft => ({
      address: block.address,
      kind: phraseKind(block.phrase) ?? "update",
    }))
  )
    .map((draft) => toChange(draft, blocks.get(draft.address), sources.apply))
    .sort((a, b) => compare(a.address, b.address))

  const summaries = findSummaries(stdout)
  const logPlanCounts = summaries.findLast((s) => s.operation === "plan")?.counts
  const logApplyCounts = summaries.findLast((s) => s.operation === "apply")?.counts
  const counts =
    sources.apply?.planCounts ??
    (sources.plan && planCounts(sources.plan)) ??
    logPlanCounts ??
    (changes.length > 0 ? kindCounts(changes) : undefined)
  const appliedCounts =
    kind === "apply"
      ? (sources.apply?.applyCounts ?? sources.apply?.hookCounts ?? logApplyCounts)
      : undefined
  const summaryLine =
    summaries.at(-1)?.line ??
    sources.apply?.lastSummary ??
    (sources.plan && counts ? planSummaryLine(counts) : undefined)
  const outputLines = extractOutputs(stdout)
  const outputsDiff = outputLines
    ? formatDiff(outputLines, 2).join("\n")
    : (outputNamesDiff(sources.plan?.outputActions) ??
      outputNamesDiff(sources.apply?.outputActions))
  const diagnostics = sources.apply?.diagnostics ?? []

  const unit: UnitReport = { name, result: "succeeded", changes, diagnostics }
  const entry =
    sources.entries.find((candidate) => candidate.result === "failed") ?? sources.entries.at(-1)
  if (entry) {
    unit.result = entry.result
    if (entry.reason) unit.reason = entry.reason
    if (entry.cause) unit.cause = entry.cause
    if (entry.durationSeconds !== undefined) unit.durationSeconds = entry.durationSeconds
  } else if (
    diagnostics.some((diagnostic) => diagnostic.severity === "error") ||
    (stderr !== undefined && /^(?:│ )?Error: /m.test(stderr)) ||
    sources.plan?.errored
  ) {
    unit.result = "failed"
  }
  if (summaryLine !== undefined) unit.summaryLine = summaryLine
  if (counts) unit.counts = counts
  if (appliedCounts) unit.appliedCounts = appliedCounts
  if (outputsDiff !== undefined) unit.outputsDiff = outputsDiff
  if (stderr !== undefined) unit.stderr = stderr
  return unit
}

function runKind(sources: Sources): RunKind {
  const cmd = sources.report?.[0]?.cmd
  if (cmd === "plan" || cmd === "apply") return cmd
  if (sources.plans) return "plan"
  if (sources.applies) return "apply"
  return "run"
}

function countsAreZero(counts: Counts | undefined): boolean {
  return !counts || Object.values(counts).every((value) => value === 0)
}

export function hasChanges(unit: UnitReport): boolean {
  return unit.changes.length > 0 || unit.outputsDiff !== undefined || !countsAreZero(unit.counts)
}

export function buildReport(sources: Sources): RunReport {
  const outputs = sources.log ? linesByUnit(sources.log) : new Map<string, UnitOutput>()
  const plans = new Map((sources.plans ?? []).map((plan) => [plan.unit, plan]))
  const applies = new Map((sources.applies ?? []).map((apply) => [apply.unit, apply]))
  const entries = new Map<string, ReportEntry[]>()
  for (const entry of sources.report ?? []) {
    entries.set(entry.name, [...(entries.get(entry.name) ?? []), entry])
  }
  const kind = runKind(sources)
  const names = [
    ...new Set([...entries.keys(), ...plans.keys(), ...applies.keys(), ...outputs.keys()]),
  ].sort(compare)
  const units = names.map((name) =>
    buildUnit(name, kind, {
      output: outputs.get(name),
      plan: plans.get(name),
      apply: applies.get(name),
      entries: entries.get(name) ?? [],
    }),
  )

  const totals: Totals = { add: 0, change: 0, remove: 0, import: 0, forget: 0 }
  for (const unit of units) {
    const counts = (kind === "apply" ? unit.appliedCounts : undefined) ?? unit.counts
    if (!counts) continue
    totals.add += counts.add
    totals.change += counts.change
    totals.remove += counts.remove
    totals.import += counts.import ?? 0
    totals.forget += counts.forget ?? 0
  }
  const count = (predicate: (unit: UnitReport) => boolean) => units.filter(predicate).length
  const failedUnits = count((unit) => unit.result === "failed")
  const earlyExitUnits = count((unit) => unit.result === "early exit")
  const failed = failedUnits + earlyExitUnits > 0
  return {
    kind,
    units,
    totals,
    failedUnits,
    earlyExitUnits,
    excludedUnits: count((unit) => unit.result === "excluded"),
    changedUnits: count((unit) => !TERMINAL_RESULTS.has(unit.result) && hasChanges(unit)),
    unchangedUnits: count((unit) => !TERMINAL_RESULTS.has(unit.result) && !hasChanges(unit)),
    empty: !failed && !units.some(hasChanges),
    failed,
  }
}
