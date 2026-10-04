import { readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"
import { z } from "zod"

export type PlanResourceChange = {
  address: string
  actions: string[]
  actionReason?: string
  importing: boolean
}

export type UnitPlan = {
  unit: string
  resourceChanges: PlanResourceChange[]
  /** Output name to "create", "update", "delete", or "no-op". */
  outputActions: Map<string, string>
  errored: boolean
}

const PlanSchema = z.looseObject({
  format_version: z.string().optional(),
  errored: z.boolean().optional(),
  resource_changes: z
    .array(
      z.looseObject({
        address: z.string(),
        action_reason: z.string().nullish(),
        change: z.looseObject({
          actions: z.array(z.string()),
          importing: z.unknown().optional(),
        }),
      }),
    )
    .nullish(),
  output_changes: z.record(z.string(), z.looseObject({ actions: z.array(z.string()) })).nullish(),
})

function outputAction(actions: readonly string[]): string {
  if (actions.includes("create") && actions.includes("delete")) return "update"
  return actions.find((action) => action !== "no-op") ?? "no-op"
}

export function parsePlan(text: string, unit: string, source = unit): UnitPlan {
  let value: unknown
  try {
    value = JSON.parse(text)
  } catch (error) {
    throw new Error(`${source}: the file is not valid JSON: ${(error as Error).message}`, {
      cause: error,
    })
  }
  const parsed = PlanSchema.safeParse(value)
  if (!parsed.success) {
    throw new Error(
      `${source}: the file is not a tofu plan JSON:\n${z.prettifyError(parsed.error)}`,
    )
  }
  const resourceChanges = (parsed.data.resource_changes ?? []).map((change) => {
    const result: PlanResourceChange = {
      address: change.address,
      actions: change.change.actions,
      importing: change.change.importing !== undefined && change.change.importing !== null,
    }
    if (change.action_reason) result.actionReason = change.action_reason
    return result
  })
  const outputActions = new Map(
    Object.entries(parsed.data.output_changes ?? {}).map(([name, change]) => [
      name,
      outputAction(change.actions),
    ]),
  )
  return { unit, resourceChanges, outputActions, errored: parsed.data.errored ?? false }
}

export function readPlanDir(dir: string): UnitPlan[] {
  if (!statSync(dir).isDirectory()) throw new Error(`${dir}: the path is not a directory`)
  return readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((file) => path.basename(file) === "tfplan.json")
    .map((file) => {
      const unit = path.dirname(file).split(path.sep).join("/")
      const full = path.join(dir, file)
      return parsePlan(readFileSync(full, "utf8"), unit, full)
    })
    .sort((a, b) => (a.unit < b.unit ? -1 : a.unit > b.unit ? 1 : 0))
}
