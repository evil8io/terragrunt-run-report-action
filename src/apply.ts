import { readFileSync, statSync } from "node:fs"
import path from "node:path"
import { z } from "zod"
import type { Counts, Diagnostic } from "./model.ts"

export type ApplyFile = {
  unit: string
  path: string
}

export type PlannedChange = {
  address: string
  previousAddress?: string
  action: string
  reason?: string
}

export type HookOutcome = {
  outcome: "complete" | "errored" | "started"
  elapsedSeconds?: number
}

export type UnitApply = {
  unit: string
  version?: string
  planned: PlannedChange[]
  /** The change_summary with the operation "plan". */
  planCounts?: Counts
  /** The change_summary after the apply. */
  applyCounts?: Counts
  /** The counts of the apply_complete messages. */
  hookCounts: Counts
  /** The message text of the last change_summary. */
  lastSummary?: string
  outcomes: Map<string, HookOutcome>
  /**
   * A map from the output name to the planned action. The parser does not keep
   * the output values, because they can be sensitive.
   */
  outputActions: Map<string, string>
  diagnostics: Diagnostic[]
  skippedLines: number
}

const Resource = z.looseObject({ addr: z.string() })

const Version = z.looseObject({ tofu: z.string().optional(), terraform: z.string().optional() })

const PlannedChangeMessage = z.looseObject({
  change: z.looseObject({
    resource: Resource,
    previous_resource: Resource.nullish(),
    action: z.string(),
    reason: z.string().optional(),
  }),
})

const ChangeSummary = z.looseObject({
  "@message": z.string().optional(),
  changes: z.looseObject({
    add: z.number(),
    change: z.number(),
    remove: z.number(),
    import: z.number().optional(),
    forget: z.number().optional(),
    operation: z.string().optional(),
  }),
})

const HookMessage = z.looseObject({
  hook: z.looseObject({
    resource: Resource,
    action: z.string().optional(),
    elapsed_seconds: z.number().optional(),
  }),
})

const Outputs = z.looseObject({
  outputs: z.record(z.string(), z.looseObject({ action: z.string().optional() })),
})

const DiagnosticMessage = z.looseObject({
  diagnostic: z.looseObject({
    severity: z.string(),
    summary: z.string(),
    detail: z.string().optional(),
    address: z.string().optional(),
    range: z
      .looseObject({ filename: z.string(), start: z.looseObject({ line: z.number() }) })
      .optional(),
  }),
})

const HOOK_COUNT_KEYS: Record<string, keyof Counts> = {
  create: "add",
  update: "change",
  delete: "remove",
  forget: "forget",
}

function toCounts(changes: z.infer<typeof ChangeSummary>["changes"]): Counts {
  const counts: Counts = { add: changes.add, change: changes.change, remove: changes.remove }
  if (changes.import) counts.import = changes.import
  if (changes.forget) counts.forget = changes.forget
  return counts
}

function toDiagnostic(diagnostic: z.infer<typeof DiagnosticMessage>["diagnostic"]): Diagnostic {
  const result: Diagnostic = {
    severity: diagnostic.severity === "error" ? "error" : "warning",
    summary: diagnostic.summary,
  }
  const detail = diagnostic.detail?.trimEnd()
  if (detail) result.detail = detail
  if (diagnostic.address) result.address = diagnostic.address
  if (diagnostic.range)
    result.location = `${diagnostic.range.filename}:${diagnostic.range.start.line}`
  return result
}

type HookState = { completed: boolean; errored: boolean; elapsedSeconds?: number }

function recordHook(
  hooks: Map<string, HookState>,
  counts: Counts,
  type: string,
  hook: z.infer<typeof HookMessage>["hook"],
): void {
  const state = hooks.get(hook.resource.addr) ?? { completed: false, errored: false }
  hooks.set(hook.resource.addr, state)
  if (type === "apply_start") return
  if (hook.elapsed_seconds !== undefined) {
    state.elapsedSeconds = (state.elapsedSeconds ?? 0) + hook.elapsed_seconds
  }
  if (type === "apply_errored") {
    state.errored = true
    return
  }
  state.completed = true
  const key = HOOK_COUNT_KEYS[hook.action ?? ""]
  if (key) counts[key] = (counts[key] ?? 0) + 1
}

/** Parses a -json-into file, in the NDJSON format of the tofu machine-readable UI. */
export function parseApply(text: string, unit: string): UnitApply {
  const result: UnitApply = {
    unit,
    planned: [],
    hookCounts: { add: 0, change: 0, remove: 0 },
    outcomes: new Map(),
    outputActions: new Map(),
    diagnostics: [],
    skippedLines: 0,
  }
  const hooks = new Map<string, HookState>()
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim()
    if (line === "") continue
    let message: unknown
    try {
      message = JSON.parse(line)
    } catch {
      result.skippedLines++
      continue
    }
    const type =
      typeof message === "object" && message !== null
        ? (message as { type?: unknown }).type
        : undefined
    if (typeof type !== "string") {
      result.skippedLines++
      continue
    }
    if (!handleMessage(result, hooks, type, message)) result.skippedLines++
  }
  for (const [address, state] of hooks) {
    const outcome: HookOutcome = {
      outcome: state.errored ? "errored" : state.completed ? "complete" : "started",
    }
    if (state.elapsedSeconds !== undefined) outcome.elapsedSeconds = state.elapsedSeconds
    result.outcomes.set(address, outcome)
  }
  return result
}

function handleMessage(
  result: UnitApply,
  hooks: Map<string, HookState>,
  type: string,
  message: unknown,
): boolean {
  switch (type) {
    case "version": {
      const parsed = Version.safeParse(message)
      if (!parsed.success) return false
      const version = parsed.data.tofu ?? parsed.data.terraform
      if (version) result.version = version
      return true
    }
    case "planned_change": {
      const parsed = PlannedChangeMessage.safeParse(message)
      if (!parsed.success) return false
      const { change } = parsed.data
      const planned: PlannedChange = { address: change.resource.addr, action: change.action }
      if (change.previous_resource) planned.previousAddress = change.previous_resource.addr
      if (change.reason) planned.reason = change.reason
      result.planned.push(planned)
      return true
    }
    case "change_summary": {
      const parsed = ChangeSummary.safeParse(message)
      if (!parsed.success) return false
      const counts = toCounts(parsed.data.changes)
      if (parsed.data.changes.operation === "plan") result.planCounts = counts
      else result.applyCounts = counts
      const text = parsed.data["@message"]
      if (text) result.lastSummary = text
      return true
    }
    case "apply_start":
    case "apply_complete":
    case "apply_errored": {
      const parsed = HookMessage.safeParse(message)
      if (!parsed.success) return false
      recordHook(hooks, result.hookCounts, type, parsed.data.hook)
      return true
    }
    case "outputs": {
      const parsed = Outputs.safeParse(message)
      if (!parsed.success) return false
      for (const [name, output] of Object.entries(parsed.data.outputs)) {
        if (output.action) result.outputActions.set(name, output.action)
      }
      return true
    }
    case "diagnostic": {
      const parsed = DiagnosticMessage.safeParse(message)
      if (!parsed.success) return false
      result.diagnostics.push(toDiagnostic(parsed.data.diagnostic))
      return true
    }
    default:
      return true
  }
}

export function applyUnitLabel(file: string, workingDirectory: string): string {
  const relative = path
    .relative(path.resolve(workingDirectory), path.resolve(file))
    .split(path.sep)
    .join("/")
  const cache = `/${relative}`.indexOf("/.terragrunt-cache/")
  if (cache !== -1) return cache === 0 ? "." : relative.slice(0, cache - 1)
  return path.posix.dirname(relative)
}

/**
 * When more than one file has the same unit, for example from a stale
 * terragrunt cache directory, the function reads only the newest file.
 */
export function readApplyFiles(files: readonly ApplyFile[]): UnitApply[] {
  const newest = new Map<string, { path: string; mtime: number }>()
  for (const file of files) {
    const mtime = statSync(file.path).mtimeMs
    const current = newest.get(file.unit)
    if (!current || mtime > current.mtime) newest.set(file.unit, { path: file.path, mtime })
  }
  return [...newest.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([unit, file]) => parseApply(readFileSync(file.path, "utf8"), unit))
}
