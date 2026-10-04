import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"
import { parse } from "yaml"

type Action = {
  inputs: Record<string, { description: string; default?: string }>
  outputs: Record<string, { description: string }>
}

const action = parse(readFileSync("action.yml", "utf8")) as Action
const readme = readFileSync("README.md", "utf8")

function tableRows(text: string, columns: number): Map<string, string[]> {
  const rows = new Map<string, string[]>()
  for (const line of text.split("\n")) {
    if (!line.startsWith("| `")) continue
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim())
    if (cells.length !== columns) continue
    rows.set(cells[0]?.replace(/`/g, "") ?? "", cells)
  }
  return rows
}

describe("the README tables", () => {
  const inputs = tableRows(readme, 4)
  const outputs = tableRows(readme, 2)

  it("list every input of action.yml with the same description and default", () => {
    expect([...inputs.keys()].sort()).toEqual(Object.keys(action.inputs).sort())
    for (const [name, cells] of inputs) {
      const input = action.inputs[name]
      expect(cells[3], name).toBe(input?.description)
      const fallback = input?.default === undefined ? "" : `\`${input.default}\``
      expect(cells[2], name).toBe(fallback)
    }
  })

  it("list every output of action.yml with the same description", () => {
    const names = Object.keys(action.outputs)
    expect(names.every((name) => outputs.has(name))).toBe(true)
    for (const name of names) {
      expect(outputs.get(name)?.[1], name).toBe(action.outputs[name]?.description)
    }
  })
})
