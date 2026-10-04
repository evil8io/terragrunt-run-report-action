# CLAUDE.md

terragrunt-run-report-action is a GitHub JavaScript action. `README.md` is for human readers. This file has only what the code does not show: rules, invariants, gotchas, external constraints, and wiring.

Write a rule in the imperative. Give the reason for the rule. Delete a line when it is no longer useful.

## Public repository

This repository is public. Do not write a customer name, an environment name, the name of a private repository, an internal tool, or an issue tracker ID anywhere. This rule applies to code, comments, fixtures, commit messages, branch names, and pull request text. Link an issue from the tracker to the pull request by hand, from the tracker side.

## Wiring

- `dist/` changes only in the release pull request, where the release workflow commits the build. CI rejects a change to `dist/` in any other pull request. The reason: a dependency bump without a rebuild has no effect at runtime, and a rebuild in every pull request makes Renovate pull requests red. `dist/` is in `.gitignore`, so a local build never lands in a commit by accident; the workflow adds it with `git add -f`.
- The fixtures in `tests/fixtures/` come from `tests/e2e/generate.sh`. Do not edit them by hand. A human reviews each `expected.md` snapshot, because the snapshot is the specification of the report.
- The contract on the input formats is the documented invocation in `README.md`. A change to the formats that the action reads needs a change to that invocation.
- The action reads no event payload. The repository, the pull request number, and the token are inputs.
- The action never fails the step because of a failed unit. The output `failed` is the signal.

## Facts about terragrunt and OpenTofu

These facts were verified on terragrunt 1.1.6 and OpenTofu 1.13.1. The code depends on them.

- The default log line is `HH:MM:SS.mmm LEVEL [unit] tofu: msg`.
- Terragrunt drops the empty lines of the tofu output.
- `--log-level=error` keeps the lines from STDOUT and STDERR of tofu.
- A failed plan writes no `tfplan.json`.
- An early-exit unit writes no `-json-into` file.
- The `Cause` of an early exit in the report is the base name of the failed ancestor, not its path.
- The `outputs` message of `-json-into` has the values of the outputs. The action never renders these values, because they can be secret.
- The keys of `--json-out-dir` differ under a git-range `--filter` with `--working-dir` in a subdirectory. See terragrunt issue 6602.

## Docs

- `README.md` is the consumer document. Do not put internal mechanics in it. Put them in this file.
- The checks, the fixtures, and the release flow are in `CONTRIBUTING.md`. Do not repeat them here.
- Write prose in the output style `.claude/output-styles/asd-ste100.md`. A sub-agent does not get the output style. A sub-agent that writes a commit message, a pull request body, or a document reads that file first.
