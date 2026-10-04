import { readFileSync } from "node:fs"
import { z } from "zod"
import type { UnitResult } from "./model.ts"

export type ReportEntry = {
  name: string
  result: UnitResult
  reason?: string
  cause?: string
  cmd?: string
  /** The Started time, in epoch milliseconds. */
  startedAt?: number
  durationSeconds?: number
}

const ReportSchema = z.array(
  z.looseObject({
    Started: z.string().nullish(),
    Ended: z.string().nullish(),
    Name: z.string(),
    Result: z.string(),
    Reason: z.string().nullish(),
    Cause: z.string().nullish(),
    Cmd: z.string().nullish(),
  }),
)

const RESULTS: ReadonlySet<string> = new Set(["succeeded", "failed", "early exit", "excluded"])

/** Returns an RFC 3339 time in epoch milliseconds. */
export function parseTime(value: unknown): number | undefined {
  const time = typeof value === "string" ? Date.parse(value) : Number.NaN
  return Number.isFinite(time) ? time : undefined
}

export function parseReport(text: string, source = "report"): ReportEntry[] {
  let value: unknown
  try {
    value = JSON.parse(text)
  } catch (error) {
    throw new Error(
      `${source}: the file is not valid JSON. Use --report-format json. ${(error as Error).message}`,
      { cause: error },
    )
  }
  const parsed = ReportSchema.safeParse(value)
  if (!parsed.success) {
    throw new Error(
      `${source}: the file is not a terragrunt report file:\n${z.prettifyError(parsed.error)}`,
    )
  }
  return parsed.data.map((raw) => {
    const entry: ReportEntry = {
      name: raw.Name,
      result: RESULTS.has(raw.Result) ? (raw.Result as UnitResult) : "unknown",
    }
    if (raw.Reason) entry.reason = raw.Reason
    if (raw.Cause) entry.cause = raw.Cause
    if (raw.Cmd) entry.cmd = raw.Cmd
    const started = parseTime(raw.Started)
    const ended = parseTime(raw.Ended)
    if (started !== undefined) entry.startedAt = started
    if (started !== undefined && ended !== undefined)
      entry.durationSeconds = (ended - started) / 1000
    return entry
  })
}

export function readReportFile(file: string): ReportEntry[] {
  return parseReport(readFileSync(file, "utf8"), file)
}
