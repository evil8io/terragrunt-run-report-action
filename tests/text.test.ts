import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"
import { linesByUnit, parseLog } from "../src/log.ts"
import {
  extractBlocks,
  extractOutputs,
  findSummaries,
  formatBody,
  formatDiff,
  phraseKind,
  stderrText,
} from "../src/text.ts"

function stdout(file: string, unit: string): string[] {
  const text = readFileSync(fileURLToPath(new URL(`./fixtures/${file}`, import.meta.url)), "utf8")
  return linesByUnit(parseLog(text)).get(`.terragrunt-stack/${unit}`)?.stdout ?? []
}

describe("extractBlocks", () => {
  const beta = stdout("changes/plan/plan.log", "beta")

  it("finds each diff block with its reason lines and its verbatim body", () => {
    const blocks = extractBlocks(beta)
    expect(blocks.map((b) => [b.address, b.phrase])).toEqual([
      ["local_file.extra[0]", "will be destroyed"],
      ["local_file.main", "must be replaced"],
    ])
    const [extra] = blocks
    expect(extra?.reasons).toEqual(["because index [0] is out of range for count"])
    expect(extra?.body.slice(0, 3)).toEqual([
      "      - content              = <<-EOT",
      "            extra file of beta",
      "        EOT -> null",
    ])
    expect(extra?.body.at(-1)).toBe(
      '      - id                   = "69294b4f0f99b5bba224256e9931e2a0cd13ae43" -> null',
    )
  })

  it("prefers a known address that contains spaces and a verb", () => {
    const lines = [
      '  # aws_s3_object.this["this is it"] will be created',
      '  + resource "aws_s3_object" "this" {',
      '      + key = "this is it"',
      "    }",
    ]
    expect(extractBlocks(lines)[0]?.address).toBe('aws_s3_object.this["this is it"]')
    expect(extractBlocks(lines, ['aws_s3_object.this["this is it"]'])[0]).toEqual({
      address: 'aws_s3_object.this["this is it"]',
      phrase: "will be created",
      reasons: [],
      body: ['      + key = "this is it"'],
    })
  })

  it("uses the header pattern when no known address matches", () => {
    const lines = [
      "  # null_resource.a will be created",
      '  + resource "null_resource" "a" {',
      "    }",
    ]
    expect(extractBlocks(lines, ["null_resource.b"])[0]?.address).toBe("null_resource.a")
  })

  it("reads a data source block with a reason", () => {
    const lines = [
      "  # data.local_file.x will be read during apply",
      "  # (config refers to values not yet known)",
      ' <= data "local_file" "x" {',
      "      + content = (known after apply)",
      "    }",
    ]
    expect(extractBlocks(lines)[0]).toMatchObject({
      address: "data.local_file.x",
      phrase: "will be read during apply",
      reasons: ["config refers to values not yet known"],
    })
  })

  it("reads an import block without an action marker", () => {
    const lines = [
      "  # aws_instance.web will be imported",
      '    resource "aws_instance" "web" {',
      '        ami = "ami-1"',
      "    }",
    ]
    expect(extractBlocks(lines)[0]?.body).toEqual(['        ami = "ami-1"'])
  })

  it("reads the deposed key of a header into the address", () => {
    const lines = [
      "  # aws_instance.web (deposed object 1a2b3c4d) will be destroyed",
      "  # (left over from a partially-failed replacement of this instance)",
      '  - resource "aws_instance" "web" {',
      '      - id = "i-old" -> null',
      "    }",
    ]
    const expected = {
      address: "aws_instance.web (deposed object 1a2b3c4d)",
      phrase: "will be destroyed",
      reasons: ["left over from a partially-failed replacement of this instance"],
    }
    expect(extractBlocks(lines, ["aws_instance.web"])[0]).toMatchObject(expected)
    expect(extractBlocks(lines)[0]).toMatchObject(expected)
  })

  it("skips a header without a resource line", () => {
    expect(extractBlocks(["  # local_file.a will be created", "Plan: 1 to add"])).toEqual([])
  })

  it.each([
    ['a.b["x will be y"]', "will be created"],
    ['a.b["it is here"]', "must be replaced"],
    ['a.b["k has v"]', "will be destroyed"],
    ['a.b["you must"]', "will be updated in-place"],
    ['a.b["x is y"]', "will be removed from the Terraform state but will not be destroyed"],
  ])("reads the address %s before the phrase %j without known addresses", (address, phrase) => {
    const lines = [`  # ${address} ${phrase}`, '  ~ resource "a" "b" {', "    }"]
    expect(extractBlocks(lines)[0]).toMatchObject({ address, phrase })
  })

  it.each(["is tainted, so must be replaced", "is tainted, so it must be replaced"])(
    "reads the address before the tainted phrase %j",
    (phrase) => {
      const lines = [
        `  # terraform_data.tainted ${phrase}`,
        '-/+ resource "terraform_data" "tainted" {',
        '      ~ id = "a" -> (known after apply)',
        "    }",
      ]
      const expected = { address: "terraform_data.tainted", phrase }
      expect(extractBlocks(lines)[0]).toMatchObject(expected)
      expect(extractBlocks(lines, ["terraform_data.tainted"])[0]).toMatchObject(expected)
    },
  )

  it("reads a removed block with the dot marker and the closing brace in column 0", () => {
    const lines = [
      "  # terraform_data.gone[0] will be removed from the OpenTofu state but will not be destroyed",
      '  . resource "terraform_data" "gone" {',
      '    id     = "a"',
      "}",
      "  # terraform_data.next will be created",
      '  + resource "terraform_data" "next" {',
      "    }",
    ]
    const blocks = extractBlocks(lines)
    expect(blocks.map((b) => [b.address, phraseKind(b.phrase)])).toEqual([
      ["terraform_data.gone[0]", "forget"],
      ["terraform_data.next", "create"],
    ])
    expect(blocks[0]?.body).toEqual(['    id     = "a"'])
  })

  it("keeps the nested braces of a removed block in its body", () => {
    const lines = [
      "  # terraform_data.gone will be removed from the OpenTofu state but will not be destroyed",
      '  . resource "terraform_data" "gone" {',
      '    id     = "id-gone"',
      "    input  = {",
      '        a = "1"',
      "        b = {",
      '            c = "2"',
      "        }",
      "    }",
      "    output = {",
      '        a = "1"',
      "        b = {",
      '            c = "2"',
      "        }",
      "    }",
      "}",
      "Plan: 0 to add, 0 to change, 0 to destroy, 1 to forget.",
    ]
    const blocks = extractBlocks(lines)
    expect(blocks).toHaveLength(1)
    expect(blocks[0]?.body).toEqual(lines.slice(2, 15))
  })

  it("ends a removed block with a one-space marker at a brace with 4 spaces", () => {
    const lines = [
      "  # a.b will no longer be managed by Terraform, but will not be destroyed",
      ' . resource "a" "b" {',
      '        id = "x"',
      "    }",
      "  # a.c will be created",
      '  + resource "a" "c" {',
      "    }",
    ]
    expect(extractBlocks(lines).map((b) => b.address)).toEqual(["a.b", "a.c"])
  })

  it("reads the new address and the previous address of a move", () => {
    const lines = [
      "  # terraform_data.old[0] has moved to terraform_data.new[0]",
      '    resource "terraform_data" "new" {',
      '        id = "a"',
      "    }",
    ]
    const expected = {
      address: "terraform_data.new[0]",
      previousAddress: "terraform_data.old[0]",
      phrase: "has moved to terraform_data.new[0]",
    }
    expect(extractBlocks(lines)[0]).toMatchObject(expected)
    expect(extractBlocks(lines, ["terraform_data.new[0]"])[0]).toMatchObject(expected)
  })

  it("joins a line in column 0 to the previous body line", () => {
    const lines = [
      "  # helm_release.a[0] will be updated in-place",
      '  ~ resource "helm_release" "a" {',
      '      ~ name   = "ab',
      'c" -> "abd"',
      "      ~ values = [",
      "          ~ <<-EOT",
      "                key: value",
      "            E",
      "OT,",
      "        ]",
      "    }",
      "Plan: 0 to add, 1 to change, 0 to destroy.",
    ]
    expect(extractBlocks(lines)[0]?.body).toEqual([
      '      ~ name   = "abc" -> "abd"',
      "      ~ values = [",
      "          ~ <<-EOT",
      "                key: value",
      "            EOT,",
      "        ]",
    ])
  })

  it("ends a block at a closing brace whose indentation a split cut", () => {
    const lines = [
      "  # a.b will be created",
      '  + resource "a" "b" {',
      "      + x = 1",
      "  ",
      "  }",
      "Plan: 1 to add, 0 to change, 0 to destroy.",
      "a.b: Creating...",
    ]
    const blocks = extractBlocks(lines)
    expect(blocks).toHaveLength(1)
    expect(blocks[0]?.body).toEqual(["      + x = 1"])
  })

  it("keeps a line in column 0 as the first body line", () => {
    const lines = ["  # a.b will be created", '  + resource "a" "b" {', "x = 1", "    }"]
    expect(extractBlocks(lines)[0]?.body).toEqual(["x = 1"])
  })
})

describe("formatDiff", () => {
  it("moves the markers of a heredoc diff to column 0", () => {
    const zeta = extractBlocks(stdout("changes/plan/plan.log", "zeta"))[0]
    expect(formatDiff(zeta?.body ?? []).slice(0, 4)).toEqual([
      "! content              = <<-EOT # forces replacement",
      "-     zeta phase 1",
      "+     zeta phase 2",
      "      replace=b6792be6-cb6c-02f5-97fc-fafee462bd4e",
    ])
  })

  it("keeps nested markers aligned and context lines unchanged", () => {
    expect(
      formatDiff([
        "      ~ tags = {",
        '          + "a" = "b"',
        '            "c" = "d"',
        "        }",
        "        # (3 unchanged attributes hidden)",
      ]),
    ).toEqual([
      "! tags = {",
      '+     "a" = "b"',
      '      "c" = "d"',
      "  }",
      "  # (3 unchanged attributes hidden)",
    ])
  })

  it("keeps the YAML list items of a heredoc as context lines", () => {
    expect(
      formatDiff([
        "      ~ content = <<-EOT # forces replacement",
        "            containers:",
        "              - name: app",
        "          -     image: app:1",
        "          +     image: app:2",
        "            args:",
        "              - --flag",
        "              ~ tilde",
        "              + plus",
        "        EOT",
        '      ~ id      = "a" -> (known after apply)',
      ]),
    ).toEqual([
      "! content = <<-EOT # forces replacement",
      "      containers:",
      "        - name: app",
      "-         image: app:1",
      "+         image: app:2",
      "      args:",
      "        - --flag",
      "        ~ tilde",
      "        + plus",
      "  EOT",
      '! id      = "a" -> (known after apply)',
    ])
  })

  it("keeps the YAML list items of a heredoc in a list as context lines", () => {
    expect(
      formatDiff([
        "      ~ values = [",
        "          ~ <<-EOT",
        "                env:",
        "                  - name: REGION",
        "                    value: eu",
        "              -   queueName: q",
        "              +   queue: q",
        "            EOT,",
        "        ]",
        '      ~ id     = "a" -> (known after apply)',
      ]),
    ).toEqual([
      "! values = [",
      "!     <<-EOT",
      "          env:",
      "            - name: REGION",
      "              value: eu",
      "-           queueName: q",
      "+           queue: q",
      "      EOT,",
      "  ]",
      '! id     = "a" -> (known after apply)',
    ])
  })

  it("leaves a line with less indentation in place", () => {
    expect(formatDiff(["  ~ x = 1 -> 2"])).toEqual(["!   x = 1 -> 2"])
  })
})

describe("formatBody", () => {
  it("removes the indentation of a removed block and keeps the lines without markers", () => {
    expect(
      formatBody([
        '    id               = "a"',
        "    input            = {",
        "        replicas = 2",
        "    }",
        "    triggers_replace = <<-EOT",
        "        list:",
        "            - item",
        "            + plus",
        "    EOT",
      ]),
    ).toEqual([
      'id               = "a"',
      "input            = {",
      "    replicas = 2",
      "}",
      "triggers_replace = <<-EOT",
      "    list:",
      "        - item",
      "        + plus",
      "EOT",
    ])
  })
})

describe("extractOutputs", () => {
  it("reads the output lines after the plan line", () => {
    expect(extractOutputs(stdout("changes/plan/plan.log", "alpha"))).toEqual([
      '  ~ content    = "alpha phase 1" -> "alpha phase 2"',
      '  ~ replace_id = "0fb34389-cd0c-c715-696c-760d85aa5b8f" -> (known after apply)',
    ])
  })

  it("stops at the first apply progress line", () => {
    expect(extractOutputs(stdout("changes/apply/apply.log", "zeta"))).toEqual([
      '  ~ content    = "zeta phase 1" -> "zeta phase 2"',
    ])
  })

  it("formats the output lines with an indentation of 2", () => {
    const lines = extractOutputs(stdout("changes/plan/plan.log", "alpha")) ?? []
    expect(formatDiff(lines, 2)[0]).toBe('! content    = "alpha phase 1" -> "alpha phase 2"')
  })

  it("returns undefined without the header", () => {
    expect(extractOutputs(stdout("changes/plan/plan.log", "gamma"))).toBeUndefined()
  })
})

describe("findSummaries", () => {
  it("parses the plan line and the apply line in order", () => {
    expect(findSummaries(stdout("changes/apply/apply.log", "alpha"))).toEqual([
      {
        line: "Plan: 3 to add, 0 to change, 2 to destroy.",
        operation: "plan",
        counts: { add: 3, change: 0, remove: 2 },
      },
      {
        line: "Apply complete! Resources: 3 added, 0 changed, 2 destroyed.",
        operation: "apply",
        counts: { add: 3, change: 0, remove: 2 },
      },
    ])
  })

  it("parses the variants with import and forget", () => {
    expect(
      findSummaries([
        "Plan: 1 to import, 2 to add, 0 to change, 0 to destroy.",
        "Plan: 0 to add, 0 to change, 0 to destroy, 1 to forget.",
        "Apply complete! Resources: 1 imported, 2 added, 0 changed, 0 destroyed.",
        "Destroy complete! Resources: 4 destroyed.",
        "No changes. Your infrastructure matches the configuration.",
      ]).map((s) => s.counts),
    ).toEqual([
      { add: 2, change: 0, remove: 0, import: 1 },
      { add: 0, change: 0, remove: 0, forget: 1 },
      { add: 2, change: 0, remove: 0, import: 1 },
      { add: 0, change: 0, remove: 4 },
      { add: 0, change: 0, remove: 0 },
    ])
  })

  it("returns the line without counts when the format does not match", () => {
    expect(findSummaries(["Plan: something else."])).toEqual([
      { line: "Plan: something else.", operation: "plan" },
    ])
  })
})

describe("phraseKind", () => {
  it.each([
    ["will be created", "create"],
    ["will be destroyed", "delete"],
    ["will be updated in-place", "update"],
    ["must be replaced", "replace"],
    ["is tainted, so must be replaced", "replace"],
    ["is tainted, so it must be replaced", "replace"],
    ["will be replaced, as requested", "replace"],
    ["will be read during apply", "read"],
    ["will be imported", "import"],
    ["will no longer be managed by OpenTofu, but will not be destroyed", "forget"],
    ["will be removed from the OpenTofu state but will not be destroyed", "forget"],
    ["has moved to a.b", "move"],
    ["has moved to a.replaced", "move"],
    ["has changed", undefined],
    ["has been deleted", undefined],
  ])("maps %j to %s", (phrase, kind) => {
    expect(phraseKind(phrase)).toBe(kind)
  })
})

describe("stderrText", () => {
  it("joins the lines and drops the trailing empty lines", () => {
    expect(stderrText(["Error: x", "  detail", ""])).toBe("Error: x\n  detail")
    expect(stderrText([])).toBeUndefined()
  })
})
