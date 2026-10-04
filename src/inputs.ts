import * as core from "@actions/core"
import * as glob from "@actions/glob"
import { applyUnitLabel, type ApplyFile } from "./apply.ts"

export type Inputs = {
  logFile: string | undefined
  planJsonDir: string | undefined
  /** The glob patterns, one for each line of the input. */
  applyJsonFiles: string[]
  reportFile: string | undefined
  workingDirectory: string
  header: string
  summary: boolean
  rawLog: boolean
  comment: boolean
  owner: string | undefined
  repo: string | undefined
  prNumber: number | undefined
  token: string | undefined
  skipEmpty: boolean
  expand: boolean
  runUrl: string | undefined
}

function optional(name: string): string | undefined {
  const value = core.getInput(name)
  return value === "" ? undefined : value
}

function flag(name: string, fallback: boolean): boolean {
  return core.getInput(name) === "" ? fallback : core.getBooleanInput(name)
}

export function readInputs(): Inputs {
  const repository = optional("repository")
  let owner: string | undefined
  let repo: string | undefined
  if (repository !== undefined) {
    const match = /^([^/\s]+)\/([^/\s]+)$/.exec(repository)
    if (!match) throw new Error(`The input repository must have the form owner/name: ${repository}`)
    owner = match[1]
    repo = match[2]
  }
  const prText = optional("pr-number")
  let prNumber: number | undefined
  if (prText !== undefined) {
    prNumber = Number(prText)
    if (!Number.isInteger(prNumber) || prNumber <= 0) {
      throw new Error(`The input pr-number must be a positive integer: ${prText}`)
    }
  }
  const inputs: Inputs = {
    logFile: optional("log-file"),
    planJsonDir: optional("plan-json-dir"),
    applyJsonFiles: core
      .getInput("apply-json-files")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== ""),
    reportFile: optional("report-file"),
    workingDirectory: optional("working-directory") ?? ".",
    header: optional("header") ?? "Terragrunt run report",
    summary: flag("summary", true),
    rawLog: flag("raw-log", true),
    comment: flag("comment", false),
    owner,
    repo,
    prNumber,
    token: optional("token"),
    skipEmpty: flag("skip-empty", false),
    expand: flag("expand", false),
    runUrl: optional("run-url"),
  }
  if (inputs.runUrl !== undefined && !/^https?:\/\/\S+$/.test(inputs.runUrl)) {
    throw new Error(`The input run-url must be an http or https URL: ${inputs.runUrl}`)
  }
  if (
    inputs.logFile === undefined &&
    inputs.planJsonDir === undefined &&
    inputs.applyJsonFiles.length === 0 &&
    inputs.reportFile === undefined
  ) {
    throw new Error(
      "Set at least one of the inputs log-file, plan-json-dir, apply-json-files, or report-file.",
    )
  }
  if (inputs.comment && (owner === undefined || prNumber === undefined || !inputs.token)) {
    throw new Error("The input comment needs the inputs repository, pr-number, and token.")
  }
  return inputs
}

export async function resolveApplyFiles(
  patterns: readonly string[],
  workingDirectory: string,
): Promise<ApplyFile[]> {
  const globber = await glob.create(patterns.join("\n"), { matchDirectories: false })
  const files = await globber.glob()
  return files.sort().map((file) => ({ unit: applyUnitLabel(file, workingDirectory), path: file }))
}
