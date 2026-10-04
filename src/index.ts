import { readFileSync } from "node:fs"
import { tmpdir } from "node:os"
import * as core from "@actions/core"
import * as github from "@actions/github"
import { postComment } from "./comment.ts"
import { readInputs, resolveJsonIntoFiles } from "./inputs.ts"
import { buildReport, countWarnings, loadSources } from "./model.ts"
import { markerLine, renderMarkdown, renderRunLink, statusLine } from "./render.ts"
import { buildSummary, writeMarkdownFile } from "./summary.ts"

async function run(): Promise<void> {
  const inputs = readInputs()
  const planJsonFiles =
    inputs.planJsonFiles.length > 0
      ? await resolveJsonIntoFiles(inputs.planJsonFiles, inputs.workingDirectory)
      : undefined
  if (planJsonFiles) core.info(`The action found ${planJsonFiles.length} plan -json-into files.`)
  const applyJsonFiles =
    inputs.applyJsonFiles.length > 0
      ? await resolveJsonIntoFiles(inputs.applyJsonFiles, inputs.workingDirectory)
      : undefined
  if (applyJsonFiles) core.info(`The action found ${applyJsonFiles.length} -json-into files.`)

  const sources = loadSources({
    logFile: inputs.logFile,
    planJsonDir: inputs.planJsonDir,
    planJsonFiles,
    applyJsonFiles,
    reportFile: inputs.reportFile,
  })
  for (const warning of sources.warnings ?? []) core.warning(warning)
  const report = buildReport(sources)
  const status = statusLine(report)
  core.info(status)

  const markdown = renderMarkdown(report, { header: inputs.header, expand: inputs.expand })
  core.setOutput("summary", status)
  core.setOutput("warnings", String(countWarnings(report).warnings))
  core.setOutput("empty", String(report.empty))
  core.setOutput("failed", String(report.failed))
  core.setOutput("markdown-file", writeMarkdownFile(markdown, process.env.RUNNER_TEMP ?? tmpdir()))

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
    const content =
      inputs.skipEmpty && report.empty ? undefined : renderRunLink(markdown, inputs.runUrl)
    await postComment(target, content, inputs.commentFailure, core)
  }
}

run().catch((error: unknown) => {
  core.setFailed(error instanceof Error ? error.message : String(error))
})
