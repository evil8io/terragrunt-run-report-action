import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { applyUnitLabel } from "../src/apply.ts"
import { buildReport, loadSources } from "../src/model.ts"
import { renderMarkdown } from "../src/render.ts"

const FIXTURES = fileURLToPath(new URL("./fixtures", import.meta.url))

function applyFiles(dir: string, name: string) {
  return readdirSync(dir, { recursive: true, encoding: "utf8" })
    .filter((file) => path.basename(file) === name)
    .map((file) => ({
      unit: applyUnitLabel(path.join(dir, file), dir),
      path: path.join(dir, file),
    }))
}

describe("a plan log in the JSON format", () => {
  it.each(["changes", "failures"])("renders the expected report of %s/plan", (scenario) => {
    const dir = path.join(FIXTURES, scenario, "plan")
    const sources = loadSources({
      logFile: path.join(dir, "plan.jsonl"),
      planJsonDir: path.join(dir, "plans"),
      planJsonFiles: applyFiles(path.join(dir, "json-into"), "plan.json"),
      reportFile: path.join(dir, "report.json"),
    })
    const md = renderMarkdown(buildReport(sources), {
      header: "Terragrunt run report",
      expand: false,
    })
    expect(md).toBe(readFileSync(path.join(dir, "expected.md"), "utf8"))
  })
})
