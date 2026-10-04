import { existsSync, readFileSync } from "node:fs"
import { readApplyFiles, type ApplyFile, type HookOutcome, type UnitApply } from "./apply.ts"
import { linesByUnit, parseLog, type LogEntry, type UnitOutput } from "./log.ts"
import { readPlanDir, type UnitPlan } from "./plan.ts"
import { parseReport, type ReportEntry } from "./report.ts"
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
  "create" | "update" | "replace" | "delete" | "read" | "import" | "forget" | "move" | "open"

/** "pending": the plan has the change, but the apply did not complete it. */
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
  /** The address before the move. Only a move has it. */
  previousAddress?: string
  kind: ChangeKind
  reason?: string
  /** The diff lines of a fenced diff block, joined by newlines. */
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

export type RunKind = "plan" | "apply" | "destroy" | "run"

export type RunReport = {
  kind: RunKind
  units: UnitReport[]
  totals: Totals
  failedUnits: number
  earlyExitUnits: number
  excludedUnits: number
  changedUnits: number
  unchangedUnits: number
  /** The units without changes and without counts, other than failed, early-exit, and excluded units. */
  uncountedUnits: number
  /** The text of the run error in the log. */
  runError?: string
  empty: boolean
  failed: boolean
}

/** A source is undefined when its input is not set. */
export type Sources = {
  log?: LogEntry[] | undefined
  plans?: UnitPlan[] | undefined
  applies?: UnitApply[] | undefined
  report?: ReportEntry[] | undefined
  /** The problems with the inputs that do not stop the report. */
  warnings?: string[] | undefined
}

export type SourceFiles = {
  logFile?: string | undefined
  planJsonDir?: string | undefined
  applyJsonFiles?: readonly ApplyFile[] | undefined
  reportFile?: string | undefined
}

function readInput(input: string, file: string): string {
  try {
    return readFileSync(file, "utf8")
  } catch (error) {
    throw new Error(`The action cannot read the input ${input}: ${(error as Error).message}`, {
      cause: error,
    })
  }
}

/**
 * A unit that does not run keeps the -json-into file of an earlier run. A file
 * is stale when its first timestamp is earlier than the first start of a unit
 * in the report file.
 */
export function freshApplies<T extends UnitApply>(
  applies: readonly T[],
  report: readonly ReportEntry[] | undefined,
): { fresh: T[]; stale: T[] } {
  const starts = (report ?? []).flatMap((entry) => entry.startedAt ?? [])
  const runStart = starts.length > 0 ? Math.min(...starts) : undefined
  const isStale = (apply: T) =>
    runStart !== undefined && apply.startedAt !== undefined && apply.startedAt < runStart
  return {
    fresh: applies.filter((apply) => !isStale(apply)),
    stale: applies.filter(isStale),
  }
}

/**
 * A run that fails before the first unit writes no plan directory and no
 * -json-into file, so a missing directory and an empty file list are warnings.
 */
export function loadSources(files: SourceFiles): Sources {
  const warnings: string[] = []
  const sources: Sources = { warnings }
  if (files.logFile !== undefined) sources.log = parseLog(readInput("log-file", files.logFile))
  if (files.reportFile !== undefined) {
    sources.report = parseReport(readInput("report-file", files.reportFile), files.reportFile)
  }
  const { planJsonDir, applyJsonFiles } = files
  if (planJsonDir !== undefined && existsSync(planJsonDir)) {
    sources.plans = readPlanDir(planJsonDir)
  } else if (planJsonDir !== undefined) {
    warnings.push(`The directory of the input plan-json-dir does not exist: ${planJsonDir}`)
  }
  if (applyJsonFiles !== undefined && applyJsonFiles.length > 0) {
    const { fresh, stale } = freshApplies(readApplyFiles(applyJsonFiles), sources.report)
    sources.applies = fresh
    for (const apply of stale) {
      warnings.push(
        `The -json-into file of the unit ${apply.unit} is from an earlier run, so the action ignored it: ${apply.path}`,
      )
    }
  } else if (applyJsonFiles !== undefined) {
    warnings.push("The patterns of the input apply-json-files match no file.")
  }
  return sources
}

const APPLY_ACTIONS: ReadonlyMap<string, ChangeKind> = new Map<string, ChangeKind>([
  ["create", "create"],
  ["update", "update"],
  ["replace", "replace"],
  ["delete", "delete"],
  ["read", "read"],
  ["import", "import"],
  ["remove", "forget"],
  ["forget", "forget"],
  ["move", "move"],
  ["open", "open"],
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

/** The header phrase of a forget already states this reason. */
const FORGET_REASON = "delete_because_no_resource_config"

/** Tofu writes no apply hooks for these kinds. */
const HOOKLESS_KINDS: ReadonlySet<ChangeKind> = new Set(["import", "forget", "move"])

const TERMINAL_RESULTS: ReadonlySet<UnitResult> = new Set(["failed", "early exit", "excluded"])

/** Tofu did not run in these units, so a -json-into file or a plan file of the unit is stale. */
const SKIPPED_RESULTS: ReadonlySet<UnitResult> = new Set(["early exit", "excluded"])

const RUN_ERROR = /^(?:Run failed|error occurred)/

type Draft = {
  address: string
  previousAddress?: string | undefined
  kind: ChangeKind
  jsonReason?: string | undefined
}

type UnitSources = {
  output: UnitOutput | undefined
  plan: UnitPlan | undefined
  apply: UnitApply | undefined
  entries: ReportEntry[]
}

function compare(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}

function planKind(
  actions: readonly string[],
  importing: boolean,
  moved: boolean,
): ChangeKind | undefined {
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
      return importing ? "import" : moved ? "move" : undefined
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

function humanReason(reason: string | undefined, kind: ChangeKind): string | undefined {
  if (!reason || IMPLIED_REASONS.has(reason)) return undefined
  if (kind === "forget" && reason === FORGET_REASON) return undefined
  return reason.replaceAll("_", " ")
}

function isApply(kind: RunKind): boolean {
  return kind === "apply" || kind === "destroy"
}

function jsonChanges(kind: RunKind, sources: UnitSources): Draft[] | undefined {
  const fromPlan = sources.plan?.resourceChanges.flatMap((change): Draft[] => {
    const moved = change.previousAddress !== undefined
    const changeKind = planKind(change.actions, change.importing, moved)
    if (!changeKind) return []
    const { address, previousAddress, actionReason: jsonReason } = change
    return [{ address, previousAddress, kind: changeKind, jsonReason }]
  })
  const fromApply = sources.apply?.planned.flatMap((change): Draft[] => {
    const changeKind = APPLY_ACTIONS.get(change.action)
    if (!changeKind) return []
    const { address, previousAddress, reason: jsonReason } = change
    return [{ address, previousAddress, kind: changeKind, jsonReason }]
  })
  return isApply(kind) ? (fromApply ?? fromPlan) : (fromPlan ?? fromApply)
}

function changeBlocks(stdout: readonly string[], known: Iterable<string>): Map<string, DiffBlock> {
  const blocks = new Map<string, DiffBlock>()
  for (const block of extractBlocks(stdout, known)) {
    if (phraseKind(block.phrase)) blocks.set(block.address, block)
  }
  return blocks
}

function applyOutcome(kind: ChangeKind, hook: HookOutcome | undefined, apply: UnitApply) {
  if (hook?.outcome === "complete" || hook?.outcome === "errored") return hook.outcome
  return HOOKLESS_KINDS.has(kind) && apply.applyCounts !== undefined ? "complete" : "pending"
}

function toChange(draft: Draft, block: DiffBlock | undefined, apply: UnitApply | undefined) {
  const change: ResourceChange = { address: draft.address, kind: draft.kind }
  const reason =
    block && block.reasons.length > 0
      ? block.reasons.join("; ")
      : humanReason(draft.jsonReason, draft.kind)
  if (reason) change.reason = reason
  if (draft.kind === "move") {
    const previousAddress = draft.previousAddress ?? block?.previousAddress
    if (previousAddress !== undefined) change.previousAddress = previousAddress
  } else {
    const diff = block ? formatDiff(block.body) : []
    if (diff.length > 0) change.diff = diff.join("\n")
  }
  if (apply) {
    const hook = apply.outcomes.get(draft.address)
    const outcome = applyOutcome(draft.kind, hook, apply)
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

function buildUnit(name: string, kind: RunKind, given: UnitSources): UnitReport {
  const entry =
    given.entries.find((candidate) => candidate.result === "failed") ?? given.entries.at(-1)
  const sources =
    entry && SKIPPED_RESULTS.has(entry.result)
      ? { ...given, plan: undefined, apply: undefined }
      : given
  const stdout = sources.output?.stdout ?? []
  const stderr = stderrText(sources.output?.stderr ?? [])
  const drafts = jsonChanges(kind, sources)
  const blocks = changeBlocks(stdout, drafts?.map((draft) => draft.address) ?? [])
  const changes = (
    drafts ??
    [...blocks.values()].map((block): Draft => ({
      address: block.address,
      previousAddress: block.previousAddress,
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
  const appliedCounts = isApply(kind)
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

function runKind(sources: Sources, outputs: ReadonlyMap<string, UnitOutput>): RunKind {
  const cmd = sources.report?.find((entry) => entry.cmd !== undefined)?.cmd
  if (cmd === "plan" || cmd === "apply" || cmd === "destroy") return cmd
  if (sources.plans) return "plan"
  if (sources.applies) return "apply"
  const stdout = [...outputs.values()].flatMap((output) => output.stdout)
  if (stdout.some((line) => line.startsWith("Destroy complete! "))) return "destroy"
  if (stdout.some((line) => line.startsWith("Apply complete! "))) return "apply"
  return "run"
}

/**
 * Returns the last top-level error of a failed run. Without units, any
 * top-level error is a run error, because the run failed before the first unit.
 */
function runError(log: readonly LogEntry[] | undefined, noUnits: boolean): string | undefined {
  const errors = (log ?? []).filter((entry) => entry.unit === null && entry.level === "ERROR")
  const entry =
    errors.findLast((candidate) => RUN_ERROR.test(candidate.lines[0] ?? "")) ??
    (noUnits ? errors.at(-1) : undefined)
  return entry ? stderrText(entry.lines) : undefined
}

function countsAreZero(counts: Counts | undefined): boolean {
  return !counts || Object.values(counts).every((value) => value === 0)
}

export function hasChanges(unit: UnitReport): boolean {
  return (
    unit.changes.length > 0 ||
    unit.outputsDiff !== undefined ||
    !countsAreZero(unit.counts) ||
    !countsAreZero(unit.appliedCounts)
  )
}

export function hasCounts(unit: UnitReport): boolean {
  return unit.counts !== undefined || unit.appliedCounts !== undefined
}

function pathSuffixMatch(name: string, other: string): boolean {
  return name.endsWith(`/${other}`) || other.endsWith(`/${name}`)
}

/**
 * Terragrunt can name a unit with a longer path in one source than in another,
 * see https://github.com/gruntwork-io/terragrunt/issues/6602. The sources come
 * in rank order. A name that matches exactly one canonical name of a higher
 * rank by path suffix gets that name. Any other name stays as it is.
 */
export function unifyNames(ranked: readonly Iterable<string>[]): Map<string, string> {
  const mapping = new Map<string, string>()
  const canonical = new Set<string>()
  for (const source of ranked) {
    const names = [...source]
    const higher = [...canonical]
    for (const name of names) {
      if (mapping.has(name)) continue
      const matches = canonical.has(name) ? [name] : higher.filter((n) => pathSuffixMatch(name, n))
      const [only] = matches
      mapping.set(name, matches.length === 1 && only !== undefined ? only : name)
    }
    for (const name of names) canonical.add(mapping.get(name) ?? name)
  }
  return mapping
}

export function buildReport(sources: Sources): RunReport {
  const logOutputs = sources.log ? linesByUnit(sources.log) : new Map<string, UnitOutput>()
  const mapping = unifyNames([
    logOutputs.keys(),
    (sources.report ?? []).map((entry) => entry.name),
    (sources.plans ?? []).map((plan) => plan.unit),
    (sources.applies ?? []).map((apply) => apply.unit),
  ])
  const canonical = (name: string) => mapping.get(name) ?? name
  const outputs = new Map([...logOutputs].map(([name, output]) => [canonical(name), output]))
  const plans = new Map((sources.plans ?? []).map((plan) => [canonical(plan.unit), plan]))
  const applies = new Map((sources.applies ?? []).map((apply) => [canonical(apply.unit), apply]))
  const entries = new Map<string, ReportEntry[]>()
  for (const entry of sources.report ?? []) {
    const name = canonical(entry.name)
    entries.set(name, [...(entries.get(name) ?? []), entry])
  }
  const kind = runKind(sources, outputs)
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
    const counts = isApply(kind) ? unit.appliedCounts : unit.counts
    if (!counts) continue
    totals.add += counts.add
    totals.change += counts.change
    totals.remove += counts.remove
    totals.import += counts.import ?? 0
    totals.forget += counts.forget ?? 0
  }
  const count = (predicate: (unit: UnitReport) => boolean) => units.filter(predicate).length
  const nonTerminal = (unit: UnitReport) => !TERMINAL_RESULTS.has(unit.result)
  const failedUnits = count((unit) => unit.result === "failed")
  const earlyExitUnits = count((unit) => unit.result === "early exit")
  const uncountedUnits = count((unit) => nonTerminal(unit) && !hasChanges(unit) && !hasCounts(unit))
  const error = runError(sources.log, units.length === 0)
  const failed = failedUnits + earlyExitUnits > 0 || error !== undefined
  const report: RunReport = {
    kind,
    units,
    totals,
    failedUnits,
    earlyExitUnits,
    excludedUnits: count((unit) => unit.result === "excluded"),
    changedUnits: count((unit) => nonTerminal(unit) && hasChanges(unit)),
    unchangedUnits: count((unit) => nonTerminal(unit) && !hasChanges(unit) && hasCounts(unit)),
    uncountedUnits,
    empty: !failed && uncountedUnits === 0 && !units.some(hasChanges),
    failed,
  }
  if (error !== undefined) report.runError = error
  return report
}
