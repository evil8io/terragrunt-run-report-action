import { parseArgs } from "node:util"
import { resolveApplyFiles } from "./inputs.ts"
import { buildReport, loadSources } from "./model.ts"
import { renderMarkdown } from "./render.ts"

const USAGE = `Usage: node src/cli.ts [options]

Renders the terragrunt run report as markdown to stdout.

Options:
  --log-file <path>            The terragrunt log.
  --plan-json-dir <path>       The --json-out-dir directory of a plan run.
  --apply-json-files <glob>    Glob pattern of the -json-into files. Repeat for more patterns.
  --report-file <path>         The terragrunt --report-file in JSON format.
  --working-directory <path>   The base of the unit labels of the apply JSON files. Default: .
  --header <text>              The report heading. Default: Terragrunt run report
  --expand                     Open every details element.
  -h, --help                   Show this help.
`

async function resolveQuietly(patterns: readonly string[], workingDirectory: string) {
  // @actions/glob writes ::debug:: workflow commands to stdout, and stdout has the report.
  const write = process.stdout.write
  process.stdout.write = () => true
  try {
    return await resolveApplyFiles(patterns, workingDirectory)
  } finally {
    process.stdout.write = write
  }
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      "log-file": { type: "string" },
      "plan-json-dir": { type: "string" },
      "apply-json-files": { type: "string", multiple: true },
      "report-file": { type: "string" },
      "working-directory": { type: "string", default: "." },
      header: { type: "string", default: "Terragrunt run report" },
      expand: { type: "boolean", default: false },
      help: { type: "boolean", short: "h", default: false },
    },
  })
  if (values.help) {
    process.stdout.write(USAGE)
    return
  }
  const patterns = (values["apply-json-files"] ?? [])
    .flatMap((value) => value.split("\n"))
    .map((value) => value.trim())
    .filter((value) => value !== "")
  if (
    values["log-file"] === undefined &&
    values["plan-json-dir"] === undefined &&
    patterns.length === 0 &&
    values["report-file"] === undefined
  ) {
    throw new Error(
      "Set at least one of --log-file, --plan-json-dir, --apply-json-files, or --report-file.",
    )
  }
  const applyJsonFiles =
    patterns.length > 0 ? await resolveQuietly(patterns, values["working-directory"]) : undefined
  const report = buildReport(
    loadSources({
      logFile: values["log-file"],
      planJsonDir: values["plan-json-dir"],
      applyJsonFiles,
      reportFile: values["report-file"],
    }),
  )
  process.stdout.write(renderMarkdown(report, { header: values.header, expand: values.expand }))
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
  process.exitCode = 1
})
