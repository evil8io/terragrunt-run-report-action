import { describe, expect, it } from "vitest"
import { buildSummary, CUT_NOTE } from "../src/summary.ts"

const bytes = (text: string) => Buffer.byteLength(text, "utf8")

describe("buildSummary", () => {
  const markdown = "## Report\n\nBody.\n"

  it("returns the markdown without a raw log", () => {
    expect(buildSummary({ markdown })).toBe(markdown)
  })

  it("appends the raw log in a collapsed text fence", () => {
    expect(buildSummary({ markdown, rawLog: "line 1\nline 2\n" })).toBe(
      `${markdown}\n<details><summary>Log</summary>\n\n\`\`\`\`text\nline 1\nline 2\n\`\`\`\`\n\n</details>\n`,
    )
  })

  it("removes colour codes from the raw log and lengthens the fence for a long backtick run", () => {
    const text = buildSummary({ markdown, rawLog: "\u001b[31mred\u001b[0m\n`````" })
    expect(text).toContain("``````text\nred\n`````\n``````")
  })

  it("cuts the raw log in the middle when the summary is larger than maxBytes", () => {
    const lines = Array.from({ length: 1000 }, (_, i) => `log line ${i}`)
    const text = buildSummary({ markdown, rawLog: lines.join("\n"), maxBytes: 2000 })
    expect(bytes(text)).toBeLessThanOrEqual(2000)
    expect(text.startsWith(markdown)).toBe(true)
    expect(text).toContain("````text\nlog line 0\nlog line 1\n")
    expect(text).toContain("log line 999\n````")
    const cut = /\[The action removed (\d+) lines here\.\]/.exec(text)
    expect(cut).not.toBeNull()
    const kept = lines.filter((line) => text.includes(`${line}\n`)).length
    expect(kept + Number(cut?.[1])).toBe(1000)
  })

  it("leaves out the raw log when no line fits", () => {
    expect(
      buildSummary({ markdown, rawLog: "x".repeat(500), maxBytes: bytes(markdown) + 40 }),
    ).toBe(markdown)
  })

  it("cuts the markdown at the end, closes an open fence, and leaves out the raw log", () => {
    const big = `## Report\n\n\`\`\`diff\n${Array.from({ length: 500 }, (_, i) => `+ line ${i}`).join("\n")}\n\`\`\`\n`
    const text = buildSummary({ markdown: big, rawLog: "log", maxBytes: 1000 })
    expect(bytes(text)).toBeLessThanOrEqual(1000)
    expect(text.endsWith(`\n\`\`\`\n\n${CUT_NOTE}\n`)).toBe(true)
    expect(text).not.toContain("<summary>Log</summary>")
  })

  it("closes the open details elements after the open fence at the cut", () => {
    const diff = Array.from({ length: 500 }, (_, i) => `+ line ${i}`).join("\n")
    const big = `## Report\n\n<details><summary>a</summary>\n\n<details><summary>b</summary>\n\n\`\`\`diff\n${diff}\n\`\`\`\n\n</details>\n\n</details>\n`
    const text = buildSummary({ markdown: big, maxBytes: 1000 })
    expect(bytes(text)).toBeLessThanOrEqual(1000)
    expect(text.endsWith(`\n\`\`\`\n\n</details>\n\n</details>\n\n${CUT_NOTE}\n`)).toBe(true)
  })
})
