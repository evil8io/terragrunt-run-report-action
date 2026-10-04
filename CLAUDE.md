# CLAUDE.md

terragrunt-run-report-action is a GitHub JavaScript action. `README.md` is for human readers. This file has only what the code does not show: rules, invariants, gotchas, external constraints, and wiring.

Write a rule in the imperative. Give the reason for the rule. Delete a line when it is no longer useful.

## Public repository

This repository is public. Do not write these names anywhere:

- a customer name
- an environment name
- the name of a private repository
- the name of an internal tool
- an issue tracker ID

This rule applies to code, comments, fixtures, commit messages, branch names, and pull request text. Link an issue from the tracker to the pull request by hand, from the tracker side.

## Wiring

- Do not edit the files in `tests/fixtures/` by hand. Each file must match the output of the e2e stack or of the renderer. `tests/e2e/generate.sh` writes the input files, and `pnpm test -u` writes the `expected.md` snapshots.
- Review each `expected.md` change by hand, because the snapshot is the specification of the report.
- When the action reads a new or changed file format, update the invocations in the Usage section of `README.md`. Consumers copy these invocations.
- Read no event payload in the action. Take the repository, the pull request number, and the token from inputs. A `push` or `issue_comment` event has no pull request in its payload.
- Do not fail the step for a failed unit. Set the output `failed`, because the workflow decides what a failed unit means for the job.

## Releases

`CONTRIBUTING.md` describes the release flow. These rules add to it.

- Change `dist/` only through the release workflow, for two reasons. A dependency update without a rebuild has no effect at runtime. If every pull request needs a rebuild, CI fails on every Renovate pull request, because Renovate does not rebuild `dist/`. The workflow adds the build with `git add -f`, because `dist/` is in `.gitignore`.
- Keep the release branch exempt from the `dist/` check in `ci.yml`, because the release workflow commits the build there.
- Merge the release pull request without the ci, e2e, and pr-title checks, because they do not run on it. release-please and the `dist/` commit step use the default token, and GitHub starts no workflow run for an event from that token. The ci run on `main` after the merge must pass.

## Facts about terragrunt and OpenTofu

These facts were verified on terragrunt 1.1.6 and OpenTofu 1.13.1. The code or the Contract section of `README.md` depends on each fact.

- The default log line is `HH:MM:SS.mmm LEVEL [unit] tofu: msg`. The `tofu:` token is the base name of the `--tf-path` binary, for example `opentofu:`. Terragrunt does not escape a `]` in the unit name, for example `[brkt[1]]`.
- Terragrunt drops the empty lines of the tofu output.
- With `--log-level=error`, the log still contains the STDOUT and STDERR lines of tofu.
- A failed plan writes no `tfplan.json` file.
- An early-exit unit writes no `-json-into` file.
- A `-json-into` file has no `apply_start` or `apply_complete` hook for an import or a forget.
- For a `removed` block, the `planned_change` action is `remove`, and the `tfplan.json` file has the actions `["forget"]`. The resource line of the diff block has the marker `.`.
- After a failed unit, terragrunt logs a top-level `ERROR` entry that starts with `Run failed`, and a last one that starts with `error occurred`.
- After a configuration error, terragrunt writes the report file `[]` and no `--json-out-dir` directory. The log then has top-level `ERROR` entries, but no `Run failed` entry.
- The `Cause` of an early exit in the report file is the base name of the failed ancestor, not its path.
- The `outputs` message of a `-json-into` file has the values of the outputs. Do not render these values, because they can be sensitive.

## Docs

- `README.md` is the consumer document. Do not put internal mechanics in it, because its readers use the action and do not change it. Put the mechanics in this file.
- The checks, the fixtures, and the release flow are in `CONTRIBUTING.md`. Do not repeat them here, because a second copy gets out of date.
- Write prose in the output style `.claude/output-styles/asd-ste100.md`. A sub-agent does not get the output style. Tell each sub-agent that writes a commit message, a pull request body, or a document to read that file.
