// The code that splits the report into comments comes from
// borchero/terraform-plan-comment (MIT license).
import type { getOctokit } from "@actions/github"
import { closeState, nextState, type MarkdownState } from "./render.ts"

export type Octokit = ReturnType<typeof getOctokit>

export type CommentTarget = {
  octokit: Octokit
  owner: string
  repo: string
  prNumber: number
  /** The first line of every comment of the report. */
  marker: string
}

const CONTINUATION = "\n\n*(The report continues in the next comment.)*"
const PART_ONE = " (Part 1)"

type Cut = { end: number; state: MarkdownState }

function isBlank(line: string | undefined): boolean {
  return line !== undefined && line.trim() === ""
}

/**
 * Returns the last line of the part. The preferred cut is after a closing
 * details tag, then before a blank line, then after any line.
 */
function findCut(
  lines: readonly string[],
  start: number,
  initial: MarkdownState,
  budget: number,
): Cut | undefined {
  const best: (Cut | undefined)[] = [undefined, undefined, undefined]
  let state = initial
  let length = -1
  for (let i = start; i < lines.length; i++) {
    const line = lines[i] ?? ""
    const before = state
    state = nextState(before, line)
    length += line.length + 1
    if (length > budget) break
    if (length + closeState(state).length > budget) continue
    const cut = { end: i, state }
    if (!before.fence && line === "</details>") best[0] = cut
    else if (!state.fence && isBlank(lines[i + 1])) best[1] = cut
    else best[2] = cut
  }
  return best[0] ?? best[1] ?? best[2]
}

/**
 * Splits the report into comments at line boundaries. A part closes the open
 * fence and the open details elements. The next part opens the fence again,
 * but not the details elements.
 */
export function chunkComment(content: string, marker: string, maxChunkSize = 65000): string[] {
  if (content.length <= maxChunkSize) return [content]
  const lines = content.split("\n")
  const heading = lines.find((line) => line.startsWith("## ")) ?? "##"
  const first = `${marker}\n${heading}`
  const labelled = content.startsWith(first)
  const chunks: string[] = []
  let start = 0
  let fence: MarkdownState["fence"]
  for (let part = 1; start < lines.length; part++) {
    const reopen = fence ? `${fence.line}\n` : ""
    const prefix = part === 1 ? "" : `${marker}\n${heading} (Part ${part})\n\n${reopen}`
    if (part > 1 && prefix.length + lines.slice(start).join("\n").length <= maxChunkSize) {
      chunks.push(prefix + lines.slice(start).join("\n"))
      break
    }
    const initial: MarkdownState = fence ? { fence, details: 0 } : { details: 0 }
    const label = part === 1 && labelled ? PART_ONE.length : 0
    const budget = maxChunkSize - prefix.length - label - CONTINUATION.length
    let cut = findCut(lines, start, initial, budget)
    if (!cut) {
      const line = lines[start] ?? ""
      const size = Math.max(1, budget - closeState(initial).length)
      lines.splice(start, 1, line.slice(0, size), line.slice(size))
      cut = { end: start, state: nextState(initial, lines[start] ?? "") }
    }
    let body = lines.slice(start, cut.end + 1).join("\n")
    if (!cut.state.fence) body = body.trimEnd()
    let chunk = prefix + body + closeState(cut.state) + CONTINUATION
    if (part === 1 && labelled) chunk = first + PART_ONE + chunk.slice(first.length)
    chunks.push(chunk)
    fence = cut.state.fence
    start = cut.end + 1
    while (!fence && isBlank(lines[start])) start++
  }
  return chunks
}

async function markedComments(target: CommentTarget) {
  const { octokit, owner, repo, prNumber, marker } = target
  const comments = await octokit.paginate(octokit.rest.issues.listComments, {
    owner,
    repo,
    issue_number: prNumber,
    per_page: 100,
  })
  return comments.filter((comment) => comment.body?.startsWith(marker))
}

export type CommentResult = {
  chunks: number
  created: number
  updated: number
  deleted: number
}

export async function createOrUpdateComment(
  target: CommentTarget & { content: string },
): Promise<CommentResult> {
  const { octokit, owner, repo, prNumber, marker, content } = target
  const chunks = chunkComment(content, marker)
  const existing = await markedComments(target)
  const result: CommentResult = { chunks: chunks.length, created: 0, updated: 0, deleted: 0 }
  for (const [index, body] of chunks.entries()) {
    const comment = existing[index]
    if (comment) {
      await octokit.rest.issues.updateComment({ owner, repo, comment_id: comment.id, body })
      result.updated++
    } else {
      await octokit.rest.issues.createComment({ owner, repo, issue_number: prNumber, body })
      result.created++
    }
  }
  for (const comment of existing.slice(chunks.length)) {
    await octokit.rest.issues.deleteComment({ owner, repo, comment_id: comment.id })
    result.deleted++
  }
  return result
}

export async function deleteComments(target: CommentTarget): Promise<number> {
  const { octokit, owner, repo } = target
  const existing = await markedComments(target)
  for (const comment of existing) {
    await octokit.rest.issues.deleteComment({ owner, repo, comment_id: comment.id })
  }
  return existing.length
}

/** "warn" writes a warning for a failed comment request, and "fail" throws the error. */
export type CommentFailure = "fail" | "warn"

export type Logger = {
  info: (message: string) => void
  warning: (message: string) => void
}

/** Without content, the function deletes the comments of the report. */
export async function postComment(
  target: CommentTarget,
  content: string | undefined,
  failure: CommentFailure,
  logger: Logger,
): Promise<void> {
  try {
    if (content === undefined) {
      const deleted = await deleteComments(target)
      logger.info(
        `The run has no changes, no failed unit, and no early exit. The action deleted ${deleted} comments.`,
      )
      return
    }
    const result = await createOrUpdateComment({ ...target, content })
    logger.info(
      `The report has ${result.chunks} comments. The action updated ${result.updated}, created ${result.created}, and deleted ${result.deleted} comments.`,
    )
  } catch (error) {
    if (failure === "fail") throw error
    logger.warning(
      `The comment request failed: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
