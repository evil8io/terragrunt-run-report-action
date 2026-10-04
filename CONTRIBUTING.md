# Contributing

## Layout

```
src/log.ts              the parser of the terragrunt log
src/text.ts             the extraction of the diff of each resource
src/plan.ts             the reader of the plan files
src/apply.ts            the reader of the apply files
src/report.ts           the reader of the terragrunt report file
src/model.ts            the merge of the readers into one model
src/render.ts           the markdown renderer
src/comment.ts          the sticky pull request comment
src/summary.ts          the job summary
src/inputs.ts           the action inputs
src/index.ts            the entry point of the action
src/cli.ts              local rendering of the files of a run
tests/                  unit tests
tests/fixtures/         outputs of the e2e stack
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

`tests/e2e/generate.sh` runs the stack in `tests/e2e/` through the three phases: baseline, changes, and failures. It writes the outputs to `tests/fixtures/`. Run the script again after a change to the stack, to terragrunt, or to OpenTofu. Review the `expected.md` snapshots in the diff.

## End-to-end workflow

The workflow `e2e` runs on each pull request. It builds the action and applies the stack as a baseline. Then it runs a plan and an apply with changes. It runs a plan and an apply with failures. After each plan and each apply, it runs the action from the checkout, and it posts the report as a comment. It checks the outputs `failed` and `empty` of the four runs. The failure phase exits with code 1 by design.

## Pull requests

A pull request title follows [Conventional Commits](https://www.conventionalcommits.org/), and a check on the title blocks the merge otherwise. Every pull request is squash-merged, and the title becomes the commit subject on `main`. Add a `!` after the type for a breaking change.

## Releases

[release-please](https://github.com/googleapis/release-please) reads the commit subjects on `main` and opens a release pull request. The merge of that pull request creates a tag and a GitHub release. The repository has no 1.0 release yet, and a breaking change raises the minor version (`bump-minor-pre-major`).

`dist/` changes only in the release pull request. The release workflow builds it and commits it to that pull request. The merge of the pull request puts the build on `main`, and the release tag points at that commit. The workflow also moves the tag `v0` to the newest release. A local `pnpm build` changes the tracked `dist/` files; do not commit that change.
