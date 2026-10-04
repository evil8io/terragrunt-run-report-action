import { parseArgs } from "node:util"
import { resolveJsonIntoFiles } from "./inputs.ts"
import { buildReport, loadSources } from "./model.ts"
import { renderMarkdown } from "./render.ts"

const USAGE = `Usage: node src/cli.ts [options]

Writes the markdown report of a terragrunt run to stdout.

Options:
  --log-file <path>            The terragrunt log.
  --plan-json-dir <path>       The --json-out-dir directory of a plan run.
  --plan-json-files <glob>     A glob pattern of the -json-into files of a plan. Repeat the option for more patterns.
  --apply-json-files <glob>    A glob pattern of the -json-into files. Repeat the option for more patterns.
  --report-file <path>         The terragrunt --report-file in JSON format.
  --working-directory <path>   The base directory of the unit labels of the -json-into files. Default: .
  --header <text>              The title of the report. Default: Terragrunt run report
  --expand                     Open every collapsed section of the report.
  -h, --help                   Show this help.
`

async function resolveQuietly(patterns: readonly string[], workingDirectory: string) {
  // @actions/glob writes ::debug:: workflow commands to stdout, and stdout has the report.
  const write = process.stdout.write
  process.stdout.write = () => true
  try {
    return await resolveJsonIntoFiles(patterns, workingDirectory)
  } finally {
    process.stdout.write = write
  }
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      "log-file": { type: "string" },
      "plan-json-dir": { type: "string" },
      "plan-json-files": { type: "string", multiple: true },
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
  const split = (given: string[] | undefined) =>
    (given ?? [])
      .flatMap((value) => value.split("\n"))
      .map((value) => value.trim())
      .filter((value) => value !== "")
  const planPatterns = split(values["plan-json-files"])
  const patterns = split(values["apply-json-files"])
  if (
    values["log-file"] === undefined &&
    values["plan-json-dir"] === undefined &&
    planPatterns.length === 0 &&
    patterns.length === 0 &&
    values["report-file"] === undefined
  ) {
    throw new Error(
      "Set at least one of --log-file, --plan-json-dir, --plan-json-files, --apply-json-files, or --report-file.",
    )
  }
  const planJsonFiles =
    planPatterns.length > 0
      ? await resolveQuietly(planPatterns, values["working-directory"])
      : undefined
  const applyJsonFiles =
    patterns.length > 0 ? await resolveQuietly(patterns, values["working-directory"]) : undefined
  const sources = loadSources({
    logFile: values["log-file"],
    planJsonDir: values["plan-json-dir"],
    planJsonFiles,
    applyJsonFiles,
    reportFile: values["report-file"],
  })
  for (const warning of sources.warnings ?? []) process.stderr.write(`Warning: ${warning}\n`)
  const report = buildReport(sources)
  process.stdout.write(renderMarkdown(report, { header: values.header, expand: values.expand }))
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
  process.exitCode = 1
})
