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

**terragrunt-run-report-action** is a GitHub Action. It reads the files that `terragrunt run --all -- plan` or `terragrunt run --all -- apply` write. It posts one markdown report with one section per unit to the job summary. Optionally, it posts the report as a sticky pull request comment. The action never calls tofu, terraform, or terragrunt. It installs nothing, and it reads no event payload. The repository, the pull request number, and the token are inputs.

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
          comment: true
          pr-number: ${{ github.event.pull_request.number }}
```

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

Pin the action to a release tag, or to the commit SHA of a release tag.

## Inputs

Set at least one of `log-file`, `plan-json-dir`, `apply-json-files`, and `report-file`.

| Input               | Required | Default                    | Description                                                                                                                                                                      |
| ------------------- | -------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `log-file`          | no       |                            | The log of the run: stdout and stderr of `terragrunt run --all`, in the default terragrunt log format or in `--log-format=json`. The diff of each resource comes from this file. |
| `plan-json-dir`     | no       |                            | The `--json-out-dir` of a plan run. It has one `tfplan.json` per unit.                                                                                                           |
| `apply-json-files`  | no       |                            | Glob patterns, one per line, of the `-json-into` files of an apply run. The unit label of a file is its path relative to `working-directory`, cut before `.terragrunt-cache`.    |
| `report-file`       | no       |                            | The `--report-file` of the run, in JSON format.                                                                                                                                  |
| `working-directory` | no       | `.`                        | The directory of the run. The unit labels are relative to it.                                                                                                                    |
| `header`            | no       | `Terragrunt run report`    | The title of the report. It also identifies the sticky comment.                                                                                                                  |
| `summary`           | no       | `true`                     | Write the report to the job summary.                                                                                                                                             |
| `raw-log`           | no       | `true`                     | Add the log file to the job summary in a collapsed section.                                                                                                                      |
| `comment`           | no       | `false`                    | Post the report as a sticky pull request comment.                                                                                                                                |
| `repository`        | no       | `${{ github.repository }}` | The `owner/name` of the repository of the pull request.                                                                                                                          |
| `pr-number`         | no       |                            | The number of the pull request. Required when `comment` is `true`.                                                                                                               |
| `token`             | no       | `${{ github.token }}`      | The token that posts the comment. It needs `pull-requests: write`.                                                                                                               |
| `skip-empty`        | no       | `false`                    | Delete the sticky comment instead of a post when the run has no changes and no failed unit.                                                                                      |
| `expand`            | no       | `false`                    | Open every collapsed section of the report.                                                                                                                                      |

## Outputs

The action does not fail the step when a unit failed. Use the output `failed` to react to a failure.

| Output    | Description                                                              |
| --------- | ------------------------------------------------------------------------ |
| `summary` | One line with the kind of run, the unit counts, and the resource totals. |
| `empty`   | `true` when no unit has a change and no unit failed.                     |
| `failed`  | `true` when a unit failed or exited early.                               |

## Report

The report starts with a status line. A table follows, with one row for each unit. Then the report has one section for each unit that has changes or a failure. A section groups the resources into create, update, replace, and destroy. Each resource has one collapsed diff. A section also shows the changes to the outputs. A section of a failed unit shows the diagnostics. A unit that exited early is in the table only.

## Contract

The action depends on the format of the files that terragrunt writes. Use the invocations in the Usage section.

- Each unit writes its `-json-into` file in its own working directory, under `.terragrunt-cache/`. The glob finds these files, and the path gives the unit label.
- Do not reuse a saved plan file for the apply. A saved plan freezes the mock outputs of the dependencies.
- Use the default terragrunt log format, or `--log-format=json`. Do not use `--tf-forward-stdout`. It removes the unit prefix, and the action cannot attribute the lines to units.
- `--log-level=error` keeps the lines that terragrunt forwards from tofu.
- The comment has chunks of at most 65,000 characters. The job summary is cut at 1 MB.
- The action finds the sticky comment by the `header`. Two reports on one pull request need two headers.
- The workflow finds the pull request number. Use `${{ github.event.pull_request.number }}` on a `pull_request` event. Use `${{ github.event.issue.number }}` on an `issue_comment` event. The action does not find the number for a `push` event.

## Versions

The tests run the action against the terragrunt and OpenTofu versions in [mise.toml](mise.toml). The tag `v0` follows the newest 0.x release. Pin a release tag.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[Apache License 2.0](LICENSE). The comment chunking and the diff formatting come from [borchero/terraform-plan-comment](https://github.com/borchero/terraform-plan-comment), MIT license. See [NOTICE](NOTICE).
