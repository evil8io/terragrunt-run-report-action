import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { linesByUnit, parseLog, stripAnsi, unitNames } from "../src/log.ts"

const fixture = (file: string) =>
  readFileSync(fileURLToPath(new URL(`./fixtures/${file}`, import.meta.url)), "utf8")

describe("parseLog with the text format", () => {
  const entries = parseLog(fixture("changes/plan/plan.log"))

  it("strips the tofu prefix and keeps the indentation of a unit STDOUT line", () => {
    const entry = entries.find((e) => e.lines[0]?.includes("# local_file.extra[0] will be created"))
    expect(entry).toEqual({
      level: "STDOUT",
      unit: ".terragrunt-stack/alpha",
      lines: ["  # local_file.extra[0] will be created"],
    })
  })

  it("parses a terragrunt line without a unit prefix", () => {
    expect(entries[0]).toEqual({
      level: "INFO",
      unit: null,
      lines: ["Terragrunt Cache server is listening on 127.0.0.1:45975"],
    })
  })

  it("attaches the dependency tree to the previous terragrunt message", () => {
    const entry = entries.find((e) => e.lines[0]?.startsWith("The following units will be run"))
    expect(entry?.lines).toHaveLength(8)
    expect(entry?.lines.at(-1)).toBe("    ╰── .terragrunt-stack/epsilon")
  })

  it("puts the run summary after a tofu line into a TEXT entry without a unit", () => {
    const text = entries.filter((e) => e.level === "TEXT")
    expect(text).toHaveLength(1)
    expect(text[0]?.unit).toBeNull()
    expect(text[0]?.lines[0]).toBe("❯❯ Run Summary  6 units  0ms")
    const epsilon = linesByUnit(entries).get(".terragrunt-stack/epsilon")
    expect(epsilon?.stdout).toEqual(["No changes. Your infrastructure matches the configuration."])
  })

  it("attaches a multi-line error to the ERROR entry", () => {
    const failures = parseLog(fixture("failures/plan/plan.log"))
    const error = failures.find((e) => e.level === "ERROR")
    expect(error?.lines[0]).toBe("Run failed: error occurred:")
    expect(error?.lines).toContain("  Error: Resource precondition failed")
  })

  it("skips a line that does not match before the first entry", () => {
    expect(parseLog("garbage\n\n12:00:00.000 INFO   ready")).toEqual([
      { level: "INFO", unit: null, lines: ["ready"] },
    ])
  })

  it("accepts the terraform prefix", () => {
    const [entry] = parseLog(
      "12:00:00.000 STDOUT [u] terraform: Plan: 1 to add, 0 to change, 0 to destroy.",
    )
    expect(entry?.lines).toEqual(["Plan: 1 to add, 0 to change, 0 to destroy."])
  })
})

describe("parseLog with the JSON format", () => {
  const line = (record: Record<string, unknown>) => JSON.stringify(record)

  it("takes the unit from working-dir, uppercases the level, and splits msg", () => {
    const text = [
      line({
        time: "2026-10-04CEST12:03:50+02:00",
        level: "stdout",
        "working-dir": ".terragrunt-stack/alpha",
        "tf-path": "tofu",
        msg: "\nNo changes. Your infrastructure matches the configuration.\n",
      }),
      line({
        level: "stderr",
        "working-dir": "./.terragrunt-stack/zeta",
        msg: "Error: one\n  detail",
      }),
      line({ level: "info", msg: "Terragrunt message" }),
    ].join("\n")
    const entries = parseLog(text)
    expect(entries).toEqual([
      {
        level: "STDOUT",
        unit: ".terragrunt-stack/alpha",
        lines: ["No changes. Your infrastructure matches the configuration."],
      },
      { level: "STDERR", unit: ".terragrunt-stack/zeta", lines: ["Error: one", "  detail"] },
      { level: "INFO", unit: null, lines: ["Terragrunt message"] },
    ])
  })

  it("keeps the empty lines inside msg", () => {
    const [entry] = parseLog(line({ level: "stdout", "working-dir": "u", msg: "a\n\nb\n" }))
    expect(entry?.lines).toEqual(["a", "", "b"])
  })

  it("treats a JSON line without level and msg as text", () => {
    const entries = parseLog(`12:00:00.000 INFO   start\n${line({ other: 1 })}`)
    expect(entries).toEqual([{ level: "INFO", unit: null, lines: ["start", '{"other":1}'] }])
  })
})

describe("linesByUnit", () => {
  it("returns the STDOUT and the STDERR lines of each unit in order", () => {
    const units = linesByUnit(parseLog(fixture("failures/plan/plan.log")))
    expect([...units.keys()].sort()).toEqual([
      ".terragrunt-stack/alpha",
      ".terragrunt-stack/beta",
      ".terragrunt-stack/delta",
      ".terragrunt-stack/epsilon",
      ".terragrunt-stack/gamma",
      ".terragrunt-stack/zeta",
    ])
    const zeta = units.get(".terragrunt-stack/zeta")
    expect(zeta?.stderr).toHaveLength(6)
    expect(zeta?.stderr[0]).toBe("Error: Resource precondition failed")
    expect(zeta?.stdout[0]).toBe(
      "OpenTofu used the selected providers to generate the following execution",
    )
  })

  it("ignores terragrunt messages with a unit prefix", () => {
    const entries = parseLog("12:00:00.000 INFO   [.terragrunt-stack/a] Downloading")
    expect(linesByUnit(entries).size).toBe(0)
    expect(unitNames(entries).size).toBe(0)
  })
})

describe("stripAnsi", () => {
  it("removes colour codes before the line grammar applies", () => {
    const text =
      "\u001b[36m12:00:00.000 STDOUT\u001b[0m [\u001b[1mu\u001b[0m] tofu: \u001b[32m+\u001b[0m create"
    expect(parseLog(text)).toEqual([{ level: "STDOUT", unit: "u", lines: ["+ create"] }])
  })

  it("removes OSC sequences", () => {
    expect(stripAnsi("\u001b]8;;https://x\u0007link\u001b]8;;\u0007")).toBe("link")
  })
})
