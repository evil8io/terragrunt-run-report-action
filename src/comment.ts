// The chunking is a port of borchero/terraform-plan-comment (MIT license).
import type { getOctokit } from "@actions/github"

export type Octokit = ReturnType<typeof getOctokit>

export type CommentTarget = {
  octokit: Octokit
  owner: string
  repo: string
  prNumber: number
  /** The first line of every comment of the report. */
  marker: string
}

const CONTINUATION = "\n\n*(continued in next comment)*"
const DETAILS_END = "</details>"

export function chunkComment(content: string, marker: string, maxChunkSize = 65000): string[] {
  const heading = content.split("\n").find((line) => line.startsWith("## ")) ?? "##"
  const firstPrefix = `${marker}\n${heading}`
  const partOneSuffix = " (Part 1)"
  const chunks: string[] = []
  let remaining = content
  for (let part = 1; remaining.length > 0; part++) {
    const prefix = part > 1 ? `${marker}\n${heading} (Part ${part})\n\n` : ""
    let max = maxChunkSize - prefix.length
    if (remaining.length <= max) {
      chunks.push(prefix + remaining)
      break
    }
    max -= CONTINUATION.length
    if (part === 1) max -= partOneSuffix.length

    let split = remaining.lastIndexOf(DETAILS_END, max - DETAILS_END.length)
    if (split !== -1) {
      split += DETAILS_END.length
    } else {
      split = remaining.lastIndexOf("\n\n", max - 2)
      if (split === -1) split = max
    }
    if (split <= 0) split = Math.max(1, max)

    let chunk = prefix + remaining.slice(0, split) + CONTINUATION
    if (part === 1 && chunk.startsWith(firstPrefix)) {
      chunk = firstPrefix + partOneSuffix + chunk.slice(firstPrefix.length)
    }
    chunks.push(chunk)
    remaining = remaining.slice(split).trimStart()
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
