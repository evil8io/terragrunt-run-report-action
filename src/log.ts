export type LogEntry = {
  level: string
  unit: string | null
  lines: string[]
}

export type UnitOutput = {
  stdout: string[]
  stderr: string[]
}

const LINE = /^(\d\d:\d\d:\d\d\.\d{3}) (STDOUT|STDERR|ERROR|WARN|INFO|DEBUG|TRACE)\s+(.*)$/
/** A unit name can contain "] ", so the binary token after the prefix marks its end. */
const OUTPUT_PREFIX = /^\[(.+?)\] (?=\S+:(?: |$))/
const PREFIX = /^\[(.+?)\] /
/** The base name of the tofu or terraform binary, for example "tofu: ". */
const BINARY = /^\S+:(?: |$)/

// eslint-disable-next-line no-control-regex
const ANSI = /\u001b(?:\[[0-?]*[ -/]*[@-~]|\][^\u0007\u001b]*(?:\u0007|\u001b\\)|[@-Z\\-_])/g

export function stripAnsi(text: string): string {
  return text.replace(ANSI, "")
}

function isUnitOutput(level: string): boolean {
  return level === "STDOUT" || level === "STDERR"
}

function parseJsonEntry(line: string): LogEntry | undefined {
  if (!line.startsWith("{")) return undefined
  let value: unknown
  try {
    value = JSON.parse(line)
  } catch {
    return undefined
  }
  if (typeof value !== "object" || value === null) return undefined
  const record = value as Record<string, unknown>
  const { level, msg } = record
  if (typeof level !== "string" || typeof msg !== "string") return undefined
  const dir = record["working-dir"]
  const unit = typeof dir === "string" && dir !== "" ? dir.replace(/^\.\//, "") : null
  const upper = level.toUpperCase()
  let lines = stripAnsi(msg).split(/\r?\n/)
  if (isUnitOutput(upper)) {
    lines = lines.filter((line) => line !== "")
  } else {
    if (lines[0] === "") lines.shift()
    if (lines.at(-1) === "") lines.pop()
  }
  return { level: upper, unit, lines }
}

function textEntry(level: string, rest: string): LogEntry {
  const output = isUnitOutput(level)
  const prefix = (output ? OUTPUT_PREFIX.exec(rest) : undefined) ?? PREFIX.exec(rest)
  let message = prefix ? rest.slice(prefix[0].length) : rest
  if (output) message = message.replace(BINARY, "")
  return { level, unit: prefix?.[1] ?? null, lines: [message] }
}

/**
 * A text line that does not match the line grammar continues the previous
 * terragrunt message. Terragrunt prints the run summary block without a
 * prefix, directly after the last tofu line. After a unit STDOUT or STDERR
 * line, such lines start an entry with the level TEXT and no unit.
 */
export function parseLog(text: string): LogEntry[] {
  const entries: LogEntry[] = []
  let continuable = false
  for (const raw of text.split(/\r?\n/)) {
    const line = stripAnsi(raw)
    const json = parseJsonEntry(line)
    if (json) {
      entries.push(json)
      continuable = false
      continue
    }
    const match = LINE.exec(line)
    if (match) {
      const level = match[2] ?? ""
      entries.push(textEntry(level, match[3] ?? ""))
      continuable = !isUnitOutput(level)
      continue
    }
    const previous = entries.at(-1)
    if (!previous) continue
    if (continuable) {
      previous.lines.push(line)
    } else if (line !== "") {
      entries.push({ level: "TEXT", unit: null, lines: [line] })
      continuable = true
    }
  }
  return entries
}

export function linesByUnit(entries: readonly LogEntry[]): Map<string, UnitOutput> {
  const units = new Map<string, UnitOutput>()
  for (const entry of entries) {
    if (entry.unit === null || !isUnitOutput(entry.level)) continue
    let output = units.get(entry.unit)
    if (!output) {
      output = { stdout: [], stderr: [] }
      units.set(entry.unit, output)
    }
    const target = entry.level === "STDOUT" ? output.stdout : output.stderr
    target.push(...entry.lines)
  }
  return units
}

export function unitNames(entries: readonly LogEntry[]): Set<string> {
  return new Set(linesByUnit(entries).keys())
}
