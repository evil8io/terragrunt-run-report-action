<p align="left">
  <img src="https://img.shields.io/github/license/evil8io/terragrunt-run-report-action"/>
  <a href="https://github.com/evil8io/terragrunt-run-report-action/releases">
    <img src="https://img.shields.io/github/v/release/evil8io/terragrunt-run-report-action"/>
  </a>
  <a href="https://github.com/evil8io/terragrunt-run-report-action/actions/workflows/ci.yml">
    <img src="https://github.com/evil8io/terragrunt-run-report-action/actions/workflows/ci.yml/badge.svg"/>
  </a>
</p>

# terragrunt-run-report-action

**terragrunt-run-report-action** is a GitHub Action. It reads the files that `terragrunt run --all -- plan` or `terragrunt run --all -- apply` write. It writes one markdown report to the job summary. The report has one table row for each unit, and one section for each unit with changes or a failure. Optionally, it posts the report as a sticky pull request comment. A sticky comment is a comment that the action updates on each run, instead of a new comment.

The action never calls tofu, terraform, or terragrunt. It installs nothing, and it reads no event payload. The repository, the pull request number, and the token are inputs.

## Usage

### Plan on a pull request

```yaml
name: plan

on:
  pull_request:

permissions:
  contents: read
  pull-requests: write

jobs:
  plan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7

      # Install terragrunt and OpenTofu here.

      - name: Plan
        working-directory: live
        run: |
          terragrunt run --all --json-out-dir plans --report-file report.json --report-format json \
            -- plan -no-color -compact-warnings -concise 2>&1 | tee plan.log; exit ${PIPESTATUS[0]}

      - uses: evil8io/terragrunt-run-report-action@v0
        if: always()
        with:
          log-file: live/plan.log
          plan-json-dir: live/plans
          report-file: live/report.json
          working-directory: live
          comment: ${{ github.event.pull_request.head.repo.full_name == github.repository }}
          pr-number: ${{ github.event.pull_request.number }}
```

The token of a pull request from a fork cannot write a comment, so the example posts a comment only for a branch of the repository.

### Apply on a push to main

```yaml
name: apply

on:
  push:
    branches:
      - main

permissions:
  contents: read

jobs:
  apply:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7

      # Install terragrunt and OpenTofu here.

      - name: Apply
        working-directory: live
        run: |
          terragrunt run --all --report-file report.json --report-format json \
            -- apply -no-color -compact-warnings -json-into=apply.json 2>&1 | tee apply.log; exit ${PIPESTATUS[0]}

      - uses: evil8io/terragrunt-run-report-action@v0
        if: always()
        with:
          log-file: live/apply.log
          apply-json-files: live/**/.terragrunt-cache/**/apply.json
          report-file: live/report.json
          working-directory: live
```

The examples use the tag `v0`, which points to the newest 0.x release. For a fixed version, use a release tag such as `v0.1.0`, or the commit SHA of that tag.

## Inputs

Set at least one of `log-file`, `plan-json-dir`, `apply-json-files`, and `report-file`.

| Input               | Required | Default                    | Description                                                                                                                                                                                             |
| ------------------- | -------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `log-file`          | no       |                            | The log of the run: stdout and stderr of `terragrunt run --all`, in the default terragrunt log format or in `--log-format=json`. The diff of each resource comes from this file.                        |
| `plan-json-dir`     | no       |                            | The `--json-out-dir` of a plan run. It has one `tfplan.json` file per unit.                                                                                                                             |
| `apply-json-files`  | no       |                            | Glob patterns, one per line, of the `-json-into` files of an apply run. The patterns are relative to the workspace.                                                                                     |
| `report-file`       | no       |                            | The `--report-file` of the run, in JSON format.                                                                                                                                                         |
| `working-directory` | no       | `.`                        | The base directory of the `-json-into` file paths. The unit label is the name of a unit in the report. The unit label of a file is its path relative to this directory, cut before `.terragrunt-cache`. |
| `header`            | no       | `Terragrunt run report`    | The title of the report. It is also the key of the sticky comment.                                                                                                                                      |
| `summary`           | no       | `true`                     | Write the report to the job summary.                                                                                                                                                                    |
| `raw-log`           | no       | `true`                     | Add the log file to the job summary in a collapsed section.                                                                                                                                             |
| `comment`           | no       | `false`                    | Post the report as a sticky pull request comment.                                                                                                                                                       |
| `repository`        | no       | `${{ github.repository }}` | The `owner/name` of the repository of the pull request.                                                                                                                                                 |
| `pr-number`         | no       |                            | The number of the pull request. This input is required when `comment` is `true`.                                                                                                                        |
| `token`             | no       | `${{ github.token }}`      | The token for the comment requests. It needs `pull-requests: write`.                                                                                                                                    |
| `skip-empty`        | no       | `false`                    | When the output `empty` is `true`, the action deletes the sticky comment and posts no comment.                                                                                                          |
| `expand`            | no       | `false`                    | Open every collapsed section of the report.                                                                                                                                                             |

## Outputs

The action does not fail the step when a unit failed. Use the output `failed` to react to a failure.

| Output    | Description                                                                                                                                                                 |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `summary` | One line with the kind of run, the unit counts, and the resource totals.                                                                                                    |
| `empty`   | The value is `true` when no unit has a change, no unit failed, and no unit exited early. The value is `false` when the run failed or when the counts of a unit are unknown. |
| `failed`  | The value is `true` when a unit failed or exited early, or when the log reports a failed run.                                                                               |

## Report

The report has these parts, in this order:

1. The heading, with the text of the input `header`.
2. The status line, with the kind of run, the unit counts, and the resource totals. The kind of run is `Plan`, `Apply`, `Destroy`, or `Run` for an unknown kind.
3. The text of the run error, when the log reports a failed run and no unit failed.
4. A table with one row for each unit. The columns are Unit, Result, Add, Change, and Destroy. When the applied count differs from the planned count, a cell in an apply report contains both counts, for example `1 of 2`.
5. One section for each unit with changes, diagnostics, or a failure.

These units have a table row only:

- A unit without changes, diagnostics, or a failure.
- An early-exit unit.
- An excluded unit.

A section starts with the result of the unit, for example `❌ failed (run error)`, when the unit did not succeed. Next are the diagnostics and the tofu summary line, for example `Plan: 3 to add, 0 to change, 2 to destroy.` Then the section has one collapsed group for each kind of change, in this order: create, update, replace, destroy, read, import, forget, move, and ephemeral. A group has one collapsed diff for each resource, when the log contains the diff. In an apply report, each resource also has its outcome: `✅` with the duration, `❌ failed`, or `⏳ not applied`. The section ends with the changes to the outputs.

## Contract

The action depends on the format of the files that terragrunt writes. Use the invocations in the Usage section.

- Tofu writes the `-json-into` file of each unit in the working directory of the unit, under `.terragrunt-cache/`. The glob patterns in `apply-json-files` match these files. The action takes the unit label from the path.
- Delete the `-json-into` files of an earlier run before the apply, because a stale file of an early-exit unit would count as a result.
- Do not reuse a saved plan file for the apply. A saved plan contains the mock outputs of the dependencies, so an apply from that file writes the mock values.
- Use the default terragrunt log format, or `--log-format=json`. Do not use `--tf-forward-stdout`. With that flag, terragrunt writes no unit prefix, so the action cannot assign the lines to units.
- With `--log-level=error`, the log still contains the lines that terragrunt forwards from tofu.
- The action splits a report of more than 65,000 characters into more than one comment. The action cuts the job summary at 1 MB.
- The action finds the sticky comment by the `header`. Two reports on one pull request need two headers.
- Set `pr-number` in the workflow. Use `${{ github.event.pull_request.number }}` on a `pull_request` event, and `${{ github.event.issue.number }}` on an `issue_comment` event. A `push` event has no pull request number, so do not set `comment` there.
- With a `--filter` on a git range and a `--working-dir` in a subdirectory, the paths under `--json-out-dir` differ from the unit labels in the log. The report then contains such a unit twice (terragrunt issue 6602).

## Versions

The tests run the action against the terragrunt and OpenTofu versions in [mise.toml](mise.toml).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[Apache License 2.0](LICENSE). The diff format and the code that splits the report into comments come from [borchero/terraform-plan-comment](https://github.com/borchero/terraform-plan-comment), under the MIT license. See [NOTICE](NOTICE).
