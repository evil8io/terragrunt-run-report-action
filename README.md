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

**terragrunt-run-report-action** is a GitHub Action for `terragrunt run --all`. It reads the files of a plan or an apply, and it makes one markdown report from them. The report has one row for each unit and the diff of each changed resource. The action writes the report to the job summary, and it can post the report as a sticky pull request comment. A sticky comment is one comment that the action updates on each run.

## Report

The report starts with the `header` as a heading, then a status line, then a table with one row for each unit. After the table, the report has one section for each unit with changes or a failure. A section has one collapsed diff for each resource, in groups by the kind of change. After the groups, the section has the changes to the outputs. The section of a failed unit starts with the error. A unit without changes, a unit that exited early, and an excluded unit have a table row only.

An apply with one failed unit looks like this:

> **Apply: 4 units, 2 with changes, 1 unchanged, 1 failed.** 3 added, 0 changed, 2 destroyed.
>
> | Unit      | Result                                  |    Add | Change | Destroy |
> | --------- | --------------------------------------- | -----: | -----: | ------: |
> | `network` | ✅ succeeded                            |      2 |      0 |       1 |
> | `dns`     | ✅ no changes                           |      0 |      0 |       0 |
> | `cluster` | ❌ failed (run error)                   | 1 of 2 |      0 |       1 |
> | `apps`    | ⏭️ early exit (ancestor error: cluster) |        |        |         |
>
> **`cluster`**
>
> ❌ failed (run error)
>
> ```
> Error: creating EKS Node Group: operation error ...
> ```
>
> Plan: 2 to add, 0 to change, 1 to destroy.
>
> <details><summary>✨ Create (1)</summary>
>
> <details><summary><code>aws_eks_node_group.workers</code> ❌ failed</summary>
>
> ```diff
> + cluster_name    = "cluster"
> + node_group_name = "workers"
> + scaling_config {
> +     desired_size = 3
>   }
> ```
>
> </details>
>
> </details>

In the pull request, the name of each unit section is a heading, and the groups are collapsed. The comment ends with a link to the workflow run that produced it.

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

The plan step writes three files. `tee` writes the log to `plan.log`, and each log line has the name of its unit. With `--json-out-dir`, terragrunt writes the plan of each unit as JSON. With `--report-file`, terragrunt writes the result of each unit. The `exit` command returns the exit code of terragrunt, so the step fails when a unit fails. The action still runs, because of `if: always()`.

The token of a pull request from a fork has no write permission, so the example posts a comment only for a branch of the repository.

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

The apply step writes the log and the result of each unit, as the plan step does. In place of the plan JSON, tofu writes a `-json-into` file for each unit, with the applied changes. Tofu writes that file in the working directory of the unit, under `.terragrunt-cache/`. One glob pattern matches all of these files. A push event has no pull request number, so the example writes the job summary only.

### Versions

The examples use the tag `v0`, which points to the newest 0.x release. For a fixed version, pin a release tag such as `v0.1.0`, or the commit SHA of that tag. The tests run the action with the terragrunt and OpenTofu versions in [mise.toml](mise.toml).

## Rules for the terragrunt command

- Keep the default log format, or use `--log-format=json`. Do not use `--tf-forward-stdout`, because the log then has no unit names.
- Units can run in parallel. Each log line has the name of its unit, and the action groups the lines by unit before it reads them.
- `--log-level=error` is permitted. Terragrunt still writes the lines from tofu to the log.
- Do not apply from a saved plan file. A saved plan contains the mock outputs of the dependencies, so the apply writes the mock values.
- Delete the `-json-into` files of an earlier run before an apply. The action reads an old file of a unit that did not run as a result of this run.
- Give each report on a pull request its own `header`. The action finds its comment by the header. Jobs with different headers can post to one pull request at the same time.
- Set `pr-number` from the event. Use `${{ github.event.pull_request.number }}` on a `pull_request` event, and `${{ github.event.issue.number }}` on an `issue_comment` event.

## Limits

- The action puts at most 65,000 characters in one comment. It splits a longer report into more comments.
- GitHub limits a job summary to 1 MB. Above that limit, the action removes lines from the middle of the log first, and then from the end of the report.
- A unit can have a longer path in one file than in the log, for example `live/unit2` and `unit2`. This happens with a `--filter` on a git range and a `--working-dir` in a subdirectory, see [terragrunt issue 6602](https://github.com/gruntwork-io/terragrunt/issues/6602). The action then uses the name from the log. When more than one unit matches, the report contains the unit twice.

## Inputs

Set the three file inputs of the run, as in the examples:

| Run   | Inputs                                            |
| ----- | ------------------------------------------------- |
| plan  | `log-file`, `plan-json-dir`, and `report-file`    |
| apply | `log-file`, `apply-json-files`, and `report-file` |

Each file adds a part of the report. The action needs at least one of them. The report then has the parts that these files give:

- `log-file` contains the diff of each resource, the error text of a failed unit, and the text of a run error. Without it, the report has the list of changes, but no diff.
- `plan-json-dir` or `apply-json-files` contains the exact list of changes, with the kind of each change and the counts. In an apply, it also contains the outcome of each resource. Without it, the action reads the list of changes from the log.
- `report-file` contains the result of each unit: succeeded, failed, early exit, or excluded, with the reason. Without it, the report does not contain a unit that did not run.

| Input               | Required | Default                                                                               | Description                                                                                                                                                                                     |
| ------------------- | -------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `log-file`          | no       |                                                                                       | The stdout and stderr of `terragrunt run --all`, in the default log format or with `--log-format=json`. The Usage examples write it with `tee`. The diff of each resource comes from this file. |
| `plan-json-dir`     | no       |                                                                                       | The directory of the `--json-out-dir` option of `terragrunt run --all -- plan`. It has one `tfplan.json` file per unit.                                                                         |
| `apply-json-files`  | no       |                                                                                       | Glob patterns, one per line, of the files that `terragrunt run --all -- apply -json-into=apply.json` writes, one per unit. The patterns are relative to the workspace.                          |
| `report-file`       | no       |                                                                                       | The file of the `--report-file` option of `terragrunt run --all`, written with `--report-format json`.                                                                                          |
| `working-directory` | no       | `.`                                                                                   | The directory where `terragrunt run --all` ran. The action reads the unit name of each `-json-into` file from its path relative to this directory.                                              |
| `header`            | no       | `Terragrunt run report`                                                               | The title of the report. It is also the key of the sticky comment.                                                                                                                              |
| `summary`           | no       | `true`                                                                                | Write the report to the job summary.                                                                                                                                                            |
| `raw-log`           | no       | `true`                                                                                | Add the log file to the job summary in a collapsed section.                                                                                                                                     |
| `comment`           | no       | `false`                                                                               | Post the report as a sticky pull request comment.                                                                                                                                               |
| `repository`        | no       | `${{ github.repository }}`                                                            | The `owner/name` of the repository of the pull request.                                                                                                                                         |
| `pr-number`         | no       |                                                                                       | The number of the pull request. This input is required when `comment` is `true`.                                                                                                                |
| `token`             | no       | `${{ github.token }}`                                                                 | The token for the comment requests. It needs `pull-requests: write`.                                                                                                                            |
| `skip-empty`        | no       | `false`                                                                               | When the output `empty` is `true`, the action deletes the sticky comment and posts no comment.                                                                                                  |
| `expand`            | no       | `false`                                                                               | Open every collapsed section of the report.                                                                                                                                                     |
| `run-url`           | no       | `${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}` | A link to the workflow run or job that produced the report. The pull request comment ends with this link. Set an empty value for no link.                                                       |

## Outputs

The action does not fail the step when a unit failed. Use the output `failed` to react to a failure.

| Output    | Description                                                                                                       |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| `summary` | One line with the kind of run, the unit counts, and the resource totals.                                          |
| `empty`   | The value is `true` when the run changed nothing: no unit has a change, no unit failed, and no unit exited early. |
| `failed`  | The value is `true` when a unit failed, a unit exited early, or the run failed.                                   |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

The license is the [Apache License 2.0](LICENSE). The diff format and the code that splits the report into comments come from [borchero/terraform-plan-comment](https://github.com/borchero/terraform-plan-comment), under the MIT license. See [NOTICE](NOTICE).
