import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { parseReport, readReportFile } from "../src/report.ts"

describe("readReportFile", () => {
  const entries = readReportFile(
    fileURLToPath(new URL("./fixtures/failures/apply/report.json", import.meta.url)),
  )

  it("reads an early exit with the base name of the failed ancestor", () => {
    expect(entries.find((e) => e.name === ".terragrunt-stack/epsilon")).toEqual({
      name: ".terragrunt-stack/epsilon",
      result: "early exit",
      reason: "ancestor error",
      cause: "delta",
      cmd: "apply",
      durationSeconds: 1,
    })
  })

  it("reads a run error with the full error text", () => {
    const delta = entries.find((e) => e.name === ".terragrunt-stack/delta")
    expect(delta?.result).toBe("failed")
    expect(delta?.reason).toBe("run error")
    expect(delta?.cause).toContain("Error: local-exec provisioner error")
  })
})

describe("parseReport", () => {
  it("maps an unknown result to unknown and keeps unknown fields out", () => {
    expect(
      parseReport(JSON.stringify([{ Name: "u", Result: "skipped", Ref: "x", Future: 1 }])),
    ).toEqual([{ name: "u", result: "unknown" }])
  })

  it("throws for a CSV report", () => {
    expect(() => parseReport("Name,Started\n", "r.csv")).toThrow(
      /^r.csv: the file is not valid JSON/,
    )
  })

  it("throws for JSON that is not a list of runs", () => {
    expect(() => parseReport('{"Name":"u"}', "r.json")).toThrow(/not a terragrunt run report/)
  })
})
