import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { parseLog, linesByUnit } from "../src/log.ts"
import { buildReport, loadSources } from "../src/model.ts"
import { renderMarkdown } from "../src/render.ts"

const UNIT = /^\S+ (?:STDOUT|STDERR) \[([^\]]+)\]/

// Terragrunt runs units in parallel and writes each line when it comes.
// This function keeps the order of the lines of one unit, and it takes one
// line of each unit in turn, so every block has lines of other units in it.
function interleave(log: string): string {
  const lines = log.split("\n")
  const queues = new Map<string, string[]>()
  const rest: string[] = []
  for (const line of lines) {
    const unit = UNIT.exec(line)?.[1]
    if (unit === undefined) {
      rest.push(line)
      continue
    }
    const queue = queues.get(unit) ?? []
    queue.push(line)
    queues.set(unit, queue)
  }
  const out: string[] = []
  const active = [...queues.values()]
  while (active.some((queue) => queue.length > 0)) {
    for (const queue of active) {
      const line = queue.shift()
      if (line !== undefined) out.push(line)
    }
  }
  return [...out, ...rest].join("\n")
}

function report(logFile: string, extra: Parameters<typeof loadSources>[0]): string {
  const sources = loadSources({ logFile, ...extra })
  return renderMarkdown(buildReport(sources), { header: "Parallel", expand: false })
}

describe("a log with interleaved units", () => {
  const plan = "tests/fixtures/changes/plan"
  const apply = "tests/fixtures/failures/apply"
  const planLog = readFileSync(`${plan}/plan.log`, "utf8")
  const applyLog = readFileSync(`${apply}/apply.log`, "utf8")

  it("keeps the lines of each unit in order", () => {
    const before = linesByUnit(parseLog(planLog))
    const after = linesByUnit(parseLog(interleave(planLog)))
    expect(after).toEqual(before)
  })

  it("renders the same plan report", () => {
    const mixed = `${plan}/plan.interleaved.log`
    const extra = { planJsonDir: `${plan}/plans`, reportFile: `${plan}/report.json` }
    const expected = report(`${plan}/plan.log`, extra)
    const { writeFileSync, rmSync } = require("node:fs") as typeof import("node:fs")
    writeFileSync(mixed, interleave(planLog))
    try {
      expect(report(mixed, extra)).toBe(expected)
    } finally {
      rmSync(mixed)
    }
  })

  it("renders the same apply report from the log alone", () => {
    const mixed = `${apply}/apply.interleaved.log`
    const extra = { reportFile: `${apply}/report.json` }
    const expected = report(`${apply}/apply.log`, extra)
    const { writeFileSync, rmSync } = require("node:fs") as typeof import("node:fs")
    writeFileSync(mixed, interleave(applyLog))
    try {
      expect(report(mixed, extra)).toBe(expected)
    } finally {
      rmSync(mixed)
    }
  })
})
