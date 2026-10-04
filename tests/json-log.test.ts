import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { buildReport, loadSources } from "../src/model.ts"
import { renderMarkdown } from "../src/render.ts"

const FIXTURES = fileURLToPath(new URL("./fixtures", import.meta.url))

describe("a plan log in the JSON format", () => {
  it.each(["changes", "failures"])("renders the expected report of %s/plan", (scenario) => {
    const dir = path.join(FIXTURES, scenario, "plan")
    const sources = loadSources({
      logFile: path.join(dir, "plan.jsonl"),
      planJsonDir: path.join(dir, "plans"),
      reportFile: path.join(dir, "report.json"),
    })
    const md = renderMarkdown(buildReport(sources), {
      header: "Terragrunt run report",
      expand: false,
    })
    expect(md).toBe(readFileSync(path.join(dir, "expected.md"), "utf8"))
  })
})
