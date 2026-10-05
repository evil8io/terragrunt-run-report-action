import type { ChangeKind, Counts } from "./model.ts"

export type DiffBlock = {
  address: string
  /** The address before a move. */
  previousAddress?: string
  phrase: string
  reasons: string[]
  body: string[]
}

export type SummaryLine = {
  line: string
  operation: "plan" | "apply"
  counts?: Counts
}

const PRODUCT = "(?:OpenTofu|Terraform)"
const PHRASES = [
  "will be created",
  "will be destroyed",
  "will be updated in-place",
  "must be replaced",
  "is tainted, so must be replaced",
  "will be replaced, as requested",
  "will be replaced due to changes in replace_triggered_by",
  "will be read during apply",
  "will be imported",
  `will be removed from the ${PRODUCT} state but will not be destroyed`,
  `will no longer be managed by ${PRODUCT}, but will not be destroyed`,
  "has moved to \\S.*",
  "will be opened during apply",
]
const PHRASE = new RegExp(`^(.+?) (${PHRASES.join("|")})$`)
const HEADER = /^([^\s(].*?) ((?:will|must|is|has) .*)$/
const MOVED = "has moved to "
const COMMENT = /^ {2}# (.*)$/
const DEPOSED = /^ \(deposed object [0-9a-f]+\)/
const RESOURCE = /^\s*(?:(?:\+|-|~|\.|-\/\+|\+\/-|<=)\s+)?(?:resource|data|ephemeral)\s/
const BLOCK_END = "    }"
const MARKER = /^(\s*)([+~-])( .*)$/
const HEREDOC_START = /^( *)(?:([+~-]) )?(?:\S.*= )?<<-?EOT(?: #.*)?$/

type Header = { address: string; previousAddress?: string; phrase: string }

/** A move header names the old address first and the new address in the phrase. */
function toHeader(before: string, phrase: string): Header {
  if (!phrase.startsWith(MOVED)) return { address: before, phrase }
  return { address: phrase.slice(MOVED.length), previousAddress: before, phrase }
}

function matchHeader(line: string, known: ReadonlySet<string>): Header | undefined {
  if (!line.startsWith("  # ") || line.startsWith("  # (")) return undefined
  const rest = line.slice(4)
  let address: string | undefined
  for (let space = rest.indexOf(" "); space !== -1; space = rest.indexOf(" ", space + 1)) {
    const candidate = rest.slice(0, space)
    if (known.has(candidate)) address = candidate
  }
  if (address !== undefined) {
    address += DEPOSED.exec(rest.slice(address.length))?.[0] ?? ""
    return toHeader(address, rest.slice(address.length + 1))
  }
  const moved = ` ${MOVED}`
  for (let at = rest.indexOf(moved); at !== -1; at = rest.indexOf(moved, at + 1)) {
    if (known.has(rest.slice(at + moved.length)))
      return toHeader(rest.slice(0, at), rest.slice(at + 1))
  }
  const match = PHRASE.exec(rest) ?? HEADER.exec(rest)
  return match ? toHeader(match[1] ?? "", match[2] ?? "") : undefined
}

function endsBody(line: string): boolean {
  return line === BLOCK_END || (line !== "" && !line.startsWith(" "))
}

/**
 * Returns the resource diff blocks in the order of the tofu output. A header
 * line that matches one of the known addresses takes precedence over the
 * header pattern, because an address can contain spaces.
 */
export function extractBlocks(
  lines: readonly string[],
  knownAddresses: Iterable<string> = [],
): DiffBlock[] {
  const known = new Set(knownAddresses)
  const blocks: DiffBlock[] = []
  let i = 0
  while (i < lines.length) {
    const header = matchHeader(lines[i] ?? "", known)
    if (!header) {
      i++
      continue
    }
    let j = i + 1
    const reasons: string[] = []
    for (
      let comment = COMMENT.exec(lines[j] ?? "");
      comment;
      comment = COMMENT.exec(lines[j] ?? "")
    ) {
      const text = comment[1] ?? ""
      reasons.push(text.startsWith("(") && text.endsWith(")") ? text.slice(1, -1) : text)
      j++
    }
    if (!RESOURCE.test(lines[j] ?? "")) {
      i++
      continue
    }
    const body: string[] = []
    let k = j + 1
    while (k < lines.length && !endsBody(lines[k] ?? "")) {
      body.push(lines[k] ?? "")
      k++
    }
    blocks.push({ ...header, reasons, body })
    i = lines[k] === BLOCK_END ? k + 1 : k
  }
  return blocks
}

export function phraseKind(phrase: string): ChangeKind | undefined {
  if (phrase.startsWith("has moved to ")) return "move"
  if (phrase.includes("replaced")) return "replace"
  if (phrase.startsWith("will be created")) return "create"
  if (phrase.startsWith("will be destroyed")) return "delete"
  if (phrase.startsWith("will be updated in-place")) return "update"
  if (phrase.startsWith("will be read during apply")) return "read"
  if (phrase.startsWith("will be imported")) return "import"
  if (phrase.startsWith("will be removed from the")) return "forget"
  if (phrase.startsWith("will no longer be managed")) return "forget"
  if (phrase.startsWith("will be opened")) return "open"
  return undefined
}

function moveMarker(spaces: string, marker: string, rest: string): string {
  return `${marker === "~" ? "!" : marker}${spaces}${rest}`
}

type Heredoc = { changed: RegExp; end: RegExp }

/**
 * Tofu prints the content of a heredoc at 6 columns right of the marker of
 * its first line, the marker of a changed content line at 4 columns, and the
 * terminator at 2 columns. A heredoc in a list has `<<-EOT` on a line of its
 * own, without an attribute name.
 */
function heredoc(line: string): Heredoc | undefined {
  const match = HEREDOC_START.exec(line)
  if (!match) return undefined
  const [, spaces = "", marker] = match
  const column = Math.max(0, marker === undefined ? spaces.length - 2 : spaces.length)
  return {
    changed: new RegExp(`^( {${column + 4}})([+~-])( .*)$`),
    end: new RegExp(`^ {0,${column + 2}}EOT\\b`),
  }
}

// The diff format comes from borchero/terraform-plan-comment (MIT license).
/**
 * Formats tofu diff lines for a fenced diff block. Tofu indents resource
 * attributes by 6 spaces and output values by 2 spaces. GitHub colours only a
 * marker in column 0, and it has no colour for "~", so "~" becomes "!".
 */
export function formatDiff(lines: readonly string[], indent = 6): string[] {
  const prefix = " ".repeat(indent)
  let open: Heredoc | undefined
  return lines.map((raw) => {
    const line = raw.startsWith(prefix) ? raw.slice(indent) : raw
    if (open) {
      if (open.end.test(line)) {
        open = undefined
        return line
      }
      const changed = open.changed.exec(line)
      return changed ? moveMarker(changed[1] ?? "", changed[2] ?? "", changed[3] ?? "") : line
    }
    open = heredoc(line)
    const match = MARKER.exec(line)
    return match ? moveMarker(match[1] ?? "", match[2] ?? "", match[3] ?? "") : line
  })
}

export function extractOutputs(lines: readonly string[]): string[] | undefined {
  const start = lines.findLastIndex((line) => line.trimEnd() === "Changes to Outputs:")
  if (start === -1) return undefined
  const outputs: string[] = []
  for (let i = start + 1; i < lines.length && (lines[i] ?? "").startsWith(" "); i++) {
    outputs.push(lines[i] ?? "")
  }
  return outputs.length > 0 ? outputs : undefined
}

const PLAN_COUNT = /(\d+) to (add|change|destroy|import|forget)\b/g
const APPLY_COUNT = /(\d+) (added|changed|destroyed|imported|forgotten)\b/g
const COUNT_KEYS: Record<string, keyof Counts> = {
  add: "add",
  added: "add",
  change: "change",
  changed: "change",
  destroy: "remove",
  destroyed: "remove",
  import: "import",
  imported: "import",
  forget: "forget",
  forgotten: "forget",
}

function parseCounts(text: string, pattern: RegExp): Counts | undefined {
  const found: Partial<Record<keyof Counts, number>> = {}
  for (const match of text.matchAll(pattern)) {
    const key = COUNT_KEYS[match[2] ?? ""]
    if (key) found[key] = Number(match[1])
  }
  const { add, change, remove } = found
  if (add === undefined || change === undefined || remove === undefined) return undefined
  const counts: Counts = { add, change, remove }
  if (found.import !== undefined) counts.import = found.import
  if (found.forget !== undefined) counts.forget = found.forget
  return counts
}

function parseSummary(line: string): SummaryLine | undefined {
  if (line.startsWith("No changes.")) {
    return { line, operation: "plan", counts: { add: 0, change: 0, remove: 0 } }
  }
  let operation: SummaryLine["operation"]
  let counts: Counts | undefined
  if (line.startsWith("Plan: ")) {
    operation = "plan"
    counts = parseCounts(line, PLAN_COUNT)
  } else if (line.startsWith("Apply complete! Resources: ")) {
    operation = "apply"
    counts = parseCounts(line, APPLY_COUNT)
  } else if (line.startsWith("Destroy complete! Resources: ")) {
    operation = "apply"
    const destroyed = /(\d+) destroyed/.exec(line)
    if (destroyed) counts = { add: 0, change: 0, remove: Number(destroyed[1]) }
  } else {
    return undefined
  }
  return counts ? { line, operation, counts } : { line, operation }
}

export function findSummaries(lines: readonly string[]): SummaryLine[] {
  return lines.flatMap((line) => parseSummary(line) ?? [])
}

export function stderrText(lines: readonly string[]): string | undefined {
  const text = lines.join("\n").replace(/\s+$/, "")
  return text === "" ? undefined : text
}
