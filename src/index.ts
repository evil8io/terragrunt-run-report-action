import { readFileSync } from "node:fs"
import * as core from "@actions/core"
import * as github from "@actions/github"
import { createOrUpdateComment, deleteComments } from "./comment.ts"
import { readInputs, resolveApplyFiles } from "./inputs.ts"
import { buildReport, loadSources } from "./model.ts"
import { markerLine, renderMarkdown, statusLine } from "./render.ts"
import { buildSummary } from "./summary.ts"

async function run(): Promise<void> {
  const inputs = readInputs()
  const applyJsonFiles =
    inputs.applyJsonFiles.length > 0
      ? await resolveApplyFiles(inputs.applyJsonFiles, inputs.workingDirectory)
      : undefined
  if (applyJsonFiles) core.info(`The action found ${applyJsonFiles.length} -json-into files.`)

  const sources = loadSources({
    logFile: inputs.logFile,
    planJsonDir: inputs.planJsonDir,
    applyJsonFiles,
    reportFile: inputs.reportFile,
  })
  for (const warning of sources.warnings ?? []) core.warning(warning)
  const report = buildReport(sources)
  const status = statusLine(report)
  core.info(status)

  const markdown = renderMarkdown(report, { header: inputs.header, expand: inputs.expand })
  core.setOutput("summary", status)
  core.setOutput("empty", String(report.empty))
  core.setOutput("failed", String(report.failed))

  if (inputs.summary) {
    const rawLog =
      inputs.rawLog && inputs.logFile !== undefined
        ? readFileSync(inputs.logFile, "utf8")
        : undefined
    await core.summary.addRaw(buildSummary({ markdown, rawLog })).write()
  }

  if (inputs.comment && inputs.owner && inputs.repo && inputs.prNumber && inputs.token) {
    const target = {
      octokit: github.getOctokit(inputs.token),
      owner: inputs.owner,
      repo: inputs.repo,
      prNumber: inputs.prNumber,
      marker: markerLine(inputs.header),
    }
    if (inputs.skipEmpty && report.empty) {
      const deleted = await deleteComments(target)
      core.info(
        `The run has no changes, no failed unit, and no early exit. The action deleted ${deleted} comments.`,
      )
    } else {
      const result = await createOrUpdateComment({ ...target, content: markdown })
      core.info(
        `The report has ${result.chunks} comments. The action updated ${result.updated}, created ${result.created}, and deleted ${result.deleted} comments.`,
      )
    }
  }
}

run().catch((error: unknown) => {
  core.setFailed(error instanceof Error ? error.message : String(error))
})
