import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { parsePlan, readPlanDir } from "../src/plan.ts"

const dir = (scenario: string) =>
  fileURLToPath(new URL(`./fixtures/${scenario}/plan/plans`, import.meta.url))

describe("readPlanDir", () => {
  it("labels each tfplan.json file with its parent directory", () => {
    expect(readPlanDir(dir("changes")).map((plan) => plan.unit)).toEqual([
      ".terragrunt-stack/alpha",
      ".terragrunt-stack/beta",
      ".terragrunt-stack/delta",
      ".terragrunt-stack/epsilon",
      ".terragrunt-stack/gamma",
      ".terragrunt-stack/zeta",
    ])
  })

  it("reads the resource changes and the output actions", () => {
    const beta = readPlanDir(dir("changes")).find((plan) => plan.unit.endsWith("beta"))
    expect(beta?.resourceChanges.slice(0, 2)).toEqual([
      {
        address: "local_file.extra[0]",
        actions: ["delete"],
        actionReason: "delete_because_count_index",
        importing: false,
      },
      {
        address: "local_file.main",
        actions: ["delete", "create"],
        actionReason: "replace_because_cannot_update",
        importing: false,
      },
    ])
    expect(Object.fromEntries(beta?.outputActions ?? [])).toEqual({
      content: "update",
      name: "no-op",
      replace_id: "no-op",
    })
    expect(beta?.errored).toBe(false)
  })

  it("has no plan for a unit that failed at plan time", () => {
    expect(readPlanDir(dir("failures")).map((plan) => plan.unit)).not.toContain(
      ".terragrunt-stack/zeta",
    )
  })

  it("throws for a missing directory", () => {
    expect(() => readPlanDir(dir("missing"))).toThrow(/ENOENT/)
  })
})

describe("parsePlan", () => {
  it("accepts unknown fields and marks an import", () => {
    const plan = parsePlan(
      JSON.stringify({
        format_version: "9.9",
        future: true,
        resource_changes: [
          { address: "a.b", change: { actions: ["no-op"], importing: { id: "x" }, extra: 1 } },
        ],
      }),
      "u",
    )
    expect(plan.resourceChanges).toEqual([{ address: "a.b", actions: ["no-op"], importing: true }])
    expect(plan.outputActions.size).toBe(0)
  })

  it("throws with the source for invalid JSON", () => {
    expect(() => parsePlan("{", "u", "x/tfplan.json")).toThrow(
      /^x\/tfplan.json: the file is not valid JSON/,
    )
  })

  it("throws with the source for a file that is not a plan", () => {
    expect(() => parsePlan('{"resource_changes": [{}]}', "u", "x/tfplan.json")).toThrow(
      /x\/tfplan.json: the file is not a tofu plan in JSON format/,
    )
  })
})
