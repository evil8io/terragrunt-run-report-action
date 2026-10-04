# Contributing

## Layout

```
src/log.ts              the parser of the terragrunt log
src/text.ts             the extraction of the diff of each resource
src/plan.ts             the reader of the tfplan.json files
src/apply.ts            the reader of the -json-into files
src/report.ts           the reader of the terragrunt report file
src/model.ts            the merge of the readers into one model
src/render.ts           the markdown renderer
src/comment.ts          the sticky pull request comment
src/summary.ts          the job summary
src/inputs.ts           the action inputs
src/index.ts            the entry point of the action
src/cli.ts              the command line renderer for local use (pnpm render)
tests/                  the vitest tests
tests/fixtures/         the input files from the e2e stack, and the expected.md snapshots
tests/e2e/              the terragrunt stack and generate.sh
```

## Tools

Mise installs the tool versions in `mise.toml`. Run `mise install`.

## Checks

Run these checks before a commit:

1. `pnpm lint`
2. `pnpm typecheck`
3. `pnpm test`
4. `pnpm build`

CI runs the same checks on every pull request.

## Fixtures

`tests/e2e/generate.sh` runs the stack in `tests/e2e/` through four phases: baseline, changes, failures, and destroy. It writes the logs, the `tfplan.json` files, the `-json-into` files, and the terragrunt report files to `tests/fixtures/<scenario>/<command>/`. It keeps the `expected.md` snapshots. The script uses OpenTofu only.

In the changes and failures phases, the script runs the plan a second time with `--log-format=json`. It keeps only the log of that run, as `plan.jsonl`. A test renders the report from `plan.jsonl` and the other files of the scenario, and expects the same `expected.md`.

After a change to the stack, to terragrunt, or to OpenTofu, update the fixtures:

1. Run `tests/e2e/generate.sh`.
2. Run `pnpm test`. When the report changes, the snapshot test fails.
3. Review the diff of the `expected.md` files. Run `pnpm test -u` to accept the diff.

Each run of the script gives new resource IDs. Update the tests that compare an ID.

## End-to-end workflow

The workflow `e2e` runs on each pull request. It has these steps:

1. It builds the action.
2. It applies the stack as a baseline.
3. It runs a plan and an apply with changes.
4. It runs a plan and an apply with failures, and a second plan with `--log-format=json`.
5. It destroys the stack.
6. After each plan, each apply, and the destroy, it runs the action from the checkout.
7. It checks the outputs `failed` and `empty` of the six runs.

The job runs once with OpenTofu and once with Terraform, as the checks `e2e (opentofu)` and `e2e (terraform)`. Terraform has no `-concise` option and no `-json-into` option. The Terraform job runs without these options, so the action reads the apply and the destroy from the log and the report file. Only the OpenTofu job posts comments, so that a pull request gets one set of comments. Both jobs write the job summary.

The action posts the report as a comment only for a pull request from this repository. The token of a pull request from a fork has no write access. In the failures phase, terragrunt exits with code 1, and the steps continue on error.

## Pull requests

Write the pull request title in the [Conventional Commits](https://www.conventionalcommits.org/) format. The workflow `pr-title` checks the title. Every pull request is squash-merged, and the title becomes the commit subject on `main`. Add a `!` after the type for a breaking change.

## Releases

[release-please](https://github.com/googleapis/release-please) reads the commit subjects on `main` and opens a release pull request. After the merge of that pull request, release-please creates a tag and a GitHub release. The repository has no 1.0 release yet, so release-please raises the minor version for a breaking change (`bump-minor-pre-major`).

Only the release pull request has a change to `dist/`. The release workflow builds `dist/` and commits it to that pull request. After the merge, `main` has the build, and the release tag points to that commit. The workflow also moves the tag `v0` to the newest release.

After the first release, `dist/index.cjs` is a tracked file. A local `pnpm build` changes it. Do not commit that change; CI rejects it in every pull request except the release pull request.
