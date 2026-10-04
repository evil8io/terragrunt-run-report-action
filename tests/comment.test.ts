import { describe, expect, it } from "vitest"
import {
  chunkComment,
  createOrUpdateComment,
  deleteComments,
  postComment,
  type Octokit,
} from "../src/comment.ts"
import type { RunReport, UnitReport } from "../src/model.ts"
import { markerLine, renderMarkdown } from "../src/render.ts"

const MARKER = "<!-- terragrunt-run-report: Report -->"
const CONTINUED = "*(The report continues in the next comment.)*"

function content(sections: number, size: number): string {
  const section = (n: number) =>
    `<details><summary>${n}</summary>\n\n\`\`\`diff\n${"x".repeat(size)}\n\`\`\`\n\n</details>`
  return [`${MARKER}\n## Report`, ...Array.from({ length: sections }, (_, n) => section(n))].join(
    "\n\n",
  )
}

describe("chunkComment", () => {
  it("returns short content as one chunk", () => {
    const text = content(2, 10)
    expect(chunkComment(text, MARKER)).toEqual([text])
  })

  it("splits after a closing details tag and numbers the parts", () => {
    const chunks = chunkComment(content(10, 100), MARKER, 500)
    expect(chunks.length).toBeGreaterThan(1)
    for (const chunk of chunks) expect(chunk.length).toBeLessThanOrEqual(500)
    expect(chunks[0]?.startsWith(`${MARKER}\n## Report (Part 1)\n\n`)).toBe(true)
    chunks.slice(1).forEach((chunk, index) => {
      expect(chunk.startsWith(`${MARKER}\n## Report (Part ${index + 2})\n\n<details>`)).toBe(true)
    })
    chunks.slice(0, -1).forEach((chunk) => {
      expect(chunk.endsWith(`</details>\n\n${CONTINUED}`)).toBe(true)
    })
    expect(chunks.at(-1)?.endsWith(CONTINUED)).toBe(false)
  })

  it("keeps every section when it splits", () => {
    const chunks = chunkComment(content(10, 100), MARKER, 500)
    const joined = chunks.join("\n")
    for (let n = 0; n < 10; n++) expect(joined).toContain(`<summary>${n}</summary>`)
  })

  it("splits at a paragraph boundary without a details tag", () => {
    const text = `${MARKER}\n## Report\n\n${"a".repeat(200)}\n\n${"b".repeat(200)}`
    const chunks = chunkComment(text, MARKER, 320)
    expect(chunks).toHaveLength(2)
    expect(chunks[0]?.endsWith(`${"a".repeat(200)}\n\n${CONTINUED}`)).toBe(true)
    expect(chunks[1]).toBe(`${MARKER}\n## Report (Part 2)\n\n${"b".repeat(200)}`)
  })

  it("splits a diff larger than one comment at line boundaries with balanced fences", () => {
    const diff = Array.from({ length: 2500 }, (_, i) => `+ "key${i}" = "${"v".repeat(20)}"`)
    const unit = (name: string, lines: string[]): UnitReport => ({
      name,
      result: "succeeded",
      changes: [{ address: "helm_release.big", kind: "update", diff: lines.join("\n") }],
      diagnostics: [],
      counts: { add: 0, change: 1, remove: 0 },
    })
    const report: RunReport = {
      kind: "plan",
      units: [unit("a", diff), unit("b", ["! small = 1 -> 2"])],
      totals: { add: 0, change: 2, remove: 0, import: 0, forget: 0 },
      failedUnits: 0,
      earlyExitUnits: 0,
      excludedUnits: 0,
      changedUnits: 2,
      unchangedUnits: 0,
      uncountedUnits: 0,
      empty: false,
      failed: false,
    }
    const markdown = renderMarkdown(report, { header: "Report", expand: false })
    const chunks = chunkComment(markdown, markerLine("Report"))
    expect(chunks.length).toBeGreaterThan(1)
    const lines = new Set<string>()
    let headings = 0
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(65000)
      let open = false
      for (const line of chunk.split("\n")) {
        lines.add(line)
        if (line.startsWith("```")) open = !open
        if (line === '### <a id="trr-report-b"></a>`b`') {
          expect(open).toBe(false)
          headings++
        }
      }
      expect(open).toBe(false)
    }
    expect(headings).toBe(1)
    for (const line of diff) expect(lines.has(line)).toBe(true)
  })

  it("splits inside a paragraph that is larger than a chunk", () => {
    const chunks = chunkComment(`${MARKER}\n## Report\n${"c".repeat(1000)}`, MARKER, 300)
    expect(chunks.length).toBeGreaterThan(3)
    for (const chunk of chunks) expect(chunk.length).toBeLessThanOrEqual(300)
  })
})

type FakeComment = { id: number; body?: string }

function fakeOctokit(initial: FakeComment[]) {
  const comments = [...initial]
  const calls: string[] = []
  let nextId = 100
  const octokit = {
    paginate: async (
      method: (params: unknown) => Promise<{ data: FakeComment[] }>,
      params: unknown,
    ) => (await method(params)).data,
    rest: {
      issues: {
        listComments: async ({ issue_number }: { issue_number: number }) => {
          calls.push(`list ${issue_number}`)
          return { data: comments.map((comment) => ({ ...comment })) }
        },
        createComment: async ({ body }: { body: string }) => {
          calls.push(`create ${nextId}`)
          comments.push({ id: nextId++, body })
          return { data: {} }
        },
        updateComment: async ({ comment_id, body }: { comment_id: number; body: string }) => {
          calls.push(`update ${comment_id}`)
          const comment = comments.find((c) => c.id === comment_id)
          if (comment) comment.body = body
          return { data: {} }
        },
        deleteComment: async ({ comment_id }: { comment_id: number }) => {
          calls.push(`delete ${comment_id}`)
          comments.splice(
            comments.findIndex((c) => c.id === comment_id),
            1,
          )
          return { data: {} }
        },
      },
    },
  }
  return { octokit: octokit as unknown as Octokit, comments, calls }
}

const target = { owner: "o", repo: "r", prNumber: 7, marker: MARKER }

describe("createOrUpdateComment", () => {
  it("creates the comments when none exist", async () => {
    const fake = fakeOctokit([{ id: 1, body: "unrelated" }])
    const result = await createOrUpdateComment({
      ...target,
      octokit: fake.octokit,
      content: `${MARKER}\n## Report`,
    })
    expect(result).toEqual({ chunks: 1, created: 1, updated: 0, deleted: 0 })
    expect(fake.calls).toEqual(["list 7", "create 100"])
    expect(fake.comments.map((c) => c.id)).toEqual([1, 100])
  })

  it("updates the marked comments in order and deletes the extra ones", async () => {
    const fake = fakeOctokit([
      { id: 1, body: `${MARKER}\n## Report (Part 1)` },
      { id: 2, body: "unrelated" },
      { id: 3, body: `${MARKER}\n## Report (Part 2)` },
      { id: 4, body: `${MARKER}\n## Report (Part 3)` },
      { id: 5 },
    ])
    const result = await createOrUpdateComment({
      ...target,
      octokit: fake.octokit,
      content: `${MARKER}\n## Report\n\nnew`,
    })
    expect(result).toEqual({ chunks: 1, created: 0, updated: 1, deleted: 2 })
    expect(fake.calls).toEqual(["list 7", "update 1", "delete 3", "delete 4"])
    expect(fake.comments).toEqual([
      { id: 1, body: `${MARKER}\n## Report\n\nnew` },
      { id: 2, body: "unrelated" },
      { id: 5 },
    ])
  })

  it("ignores a comment of a report with another header", async () => {
    const fake = fakeOctokit([
      { id: 1, body: "<!-- terragrunt-run-report: Report 2 -->\n## Report 2" },
    ])
    await createOrUpdateComment({
      ...target,
      octokit: fake.octokit,
      content: `${MARKER}\n## Report`,
    })
    expect(fake.calls).toEqual(["list 7", "create 100"])
  })
})

describe("deleteComments", () => {
  it("deletes every marked comment and returns the count", async () => {
    const fake = fakeOctokit([
      { id: 1, body: `${MARKER}\n## Report` },
      { id: 2, body: "unrelated" },
      { id: 3, body: `${MARKER}\n## Report (Part 2)` },
    ])
    expect(await deleteComments({ ...target, octokit: fake.octokit })).toBe(2)
    expect(fake.comments).toEqual([{ id: 2, body: "unrelated" }])
  })
})

/** A token without write permission can list the comments, but not change them. */
function readOnlyOctokit(initial: FakeComment[]): Octokit {
  const { octokit } = fakeOctokit(initial)
  const issues = (octokit as unknown as { rest: { issues: Record<string, unknown> } }).rest.issues
  const forbidden = async () => {
    throw new Error("Resource not accessible by integration")
  }
  issues.createComment = forbidden
  issues.updateComment = forbidden
  issues.deleteComment = forbidden
  return octokit
}

function recorder() {
  const messages = { info: [] as string[], warning: [] as string[] }
  const logger = {
    info: (message: string) => {
      messages.info.push(message)
    },
    warning: (message: string) => {
      messages.warning.push(message)
    },
  }
  return { messages, logger }
}

describe("postComment", () => {
  it.each([
    ["a create", [], `${MARKER}\n## Report`],
    ["an update", [{ id: 1, body: `${MARKER}\n## Report` }], `${MARKER}\n## Report\n\nnew`],
    ["a delete", [{ id: 1, body: `${MARKER}\n## Report` }], undefined],
  ])("writes a warning for a failed %s with warn", async (_, initial, content) => {
    const { messages, logger } = recorder()
    const octokit = readOnlyOctokit(initial)
    await expect(postComment({ ...target, octokit }, content, "warn", logger)).resolves.toBe(
      undefined,
    )
    expect(messages.warning).toEqual([
      "The comment request failed: Resource not accessible by integration",
    ])
  })

  it("throws the request error with fail", async () => {
    const { messages, logger } = recorder()
    const octokit = readOnlyOctokit([])
    await expect(
      postComment({ ...target, octokit }, `${MARKER}\n## Report`, "fail", logger),
    ).rejects.toThrow("Resource not accessible by integration")
    expect(messages.warning).toEqual([])
  })

  it("writes the comment counts after a successful request", async () => {
    const { messages, logger } = recorder()
    const fake = fakeOctokit([])
    await postComment({ ...target, octokit: fake.octokit }, `${MARKER}\n## Report`, "warn", logger)
    expect(messages).toEqual({
      info: ["The report has 1 comments. The action updated 0, created 1, and deleted 0 comments."],
      warning: [],
    })
  })
})
