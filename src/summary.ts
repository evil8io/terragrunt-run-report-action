import { mkdtempSync, writeFileSync } from "node:fs"
import path from "node:path"
import { stripAnsi } from "./log.ts"
import { closeState, nextState, type MarkdownState } from "./render.ts"

export const CUT_NOTE =
  "_The action cut the report here, because the job summary has a size limit._"

function bytes(text: string): number {
  return Buffer.byteLength(text, "utf8")
}

function longestBacktickRun(text: string): number {
  let longest = 0
  for (const match of text.matchAll(/`+/g)) longest = Math.max(longest, match[0].length)
  return longest
}

function logSection(log: string, ticks: string): string {
  return `\n<details><summary>Log</summary>\n\n${ticks}text\n${log}\n${ticks}\n\n</details>\n`
}

function cutNotice(count: number): string {
  return `[The action removed ${count} lines here.]`
}

/** The cut closes the open fence and then the open details elements. */
function cutMarkdown(markdown: string, maxBytes: number): string {
  const note = `\n\n${CUT_NOTE}\n`
  const kept: string[] = []
  let state: MarkdownState = { details: 0 }
  let used = bytes(note)
  for (const line of markdown.split("\n")) {
    const next = nextState(state, line)
    const size = bytes(line) + 1
    if (used + size + bytes(closeState(next)) > maxBytes) break
    kept.push(line)
    used += size
    state = next
  }
  return `${kept.join("\n").trimEnd()}${closeState(state)}${note}`
}

function cutLog(lines: readonly string[], budget: number): string {
  const available = budget - bytes(cutNotice(lines.length)) - 1
  const head: string[] = []
  let used = 0
  for (const line of lines) {
    const size = bytes(line) + 1
    if (used + size > available / 2) break
    head.push(line)
    used += size
  }
  const tail: string[] = []
  for (let i = lines.length - 1; i >= head.length; i--) {
    const line = lines[i] ?? ""
    const size = bytes(line) + 1
    if (used + size > available) break
    tail.unshift(line)
    used += size
  }
  return [...head, cutNotice(lines.length - head.length - tail.length), ...tail].join("\n")
}

/**
 * When the markdown with the raw log is larger than maxBytes, the function
 * cuts lines from the middle of the raw log. When the markdown alone is
 * larger than maxBytes, the function cuts the end of the markdown and leaves
 * out the raw log.
 */
export function buildSummary({
  markdown,
  rawLog,
  maxBytes = 1_000_000,
}: {
  markdown: string
  rawLog?: string | undefined
  maxBytes?: number
}): string {
  if (bytes(markdown) > maxBytes) return cutMarkdown(markdown, maxBytes)
  if (rawLog === undefined) return markdown
  const base = markdown.endsWith("\n") ? markdown : `${markdown}\n`
  const log = stripAnsi(rawLog).replace(/\s+$/, "")
  const ticks = "`".repeat(Math.max(4, longestBacktickRun(log) + 1))
  const full = base + logSection(log, ticks)
  if (bytes(full) <= maxBytes) return full
  const lines = log.split("\n")
  const budget = maxBytes - bytes(base) - bytes(logSection("", ticks))
  if (budget < bytes(cutNotice(lines.length))) return markdown
  return base + logSection(cutLog(lines, budget), ticks)
}

export function writeMarkdownFile(markdown: string, baseDir: string): string {
  const file = path.join(mkdtempSync(path.join(baseDir, "terragrunt-run-report-")), "report.md")
  writeFileSync(file, markdown)
  return file
}
