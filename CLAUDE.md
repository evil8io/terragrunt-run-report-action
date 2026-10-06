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
- Set the output `warnings` to the count of the status line, because a workflow can fail a step or send a message on the count without a parse of the `summary` text.
- Put the `run-url` link in the comment only, because the job summary is on the run page.
- Do not fail the step for a failed unit. Set the output `failed`, because the workflow decides what a failed unit means for the job.
- Write the markdown file in every mode, also with `summary: false` and `comment: false`, because a later step can need the file alone. Put it in a new directory under `RUNNER_TEMP`, so that two reports of one job do not overwrite one file.

## Report layout

`README.md` describes the report in one paragraph. The full layout is the specification of `src/render.ts`, and the `expected.md` snapshots show it. Keep these rules when you change the renderer:

- The first line is the marker comment with the `header`. The sticky comment logic finds its comments by that line.
- The status line names the kind of run: `Plan`, `Apply`, `Destroy`, or `Run` when the kind is unknown. For any other command, the label is the `Cmd` of the report file with its first letter in upper case, for example `Init`. The kind comes from the report file, else from the inputs, else from the log. For the kind `other`, the kind from a `Cmd` of the report file, write no totals in the status line and no count columns in the table, because such a run has no changes. The kind `run` keeps the totals, because a plan from the log alone has counts. The parts of that status line are the unit count, `N succeeded`, failed, early exit, and excluded.
- When the run has warnings, end the status line with one sentence outside the bold part, for example `⚠️ 52 warnings in 2 units.` Count every warning diagnostic of every unit, and count the units with at least one warning. The table has no warnings column, so without the sentence the top of the report does not show that the run has warnings. Write no sentence at zero warnings, so that a plan report and the `summary` output of a run without warnings do not change.
- When the log has a run error and no unit failed, the text of that error follows the status line.
- Take the changes and the counts of a plan from the `tfplan.json` files, and only the diagnostics from the `-json-into` files of the plan. The `tfplan.json` file has the deposed key and the action reason of each change, and the `-json-into` file has neither.
- The table has one row for each unit, sorted by name. In an apply report, a count cell shows `applied of planned` when the two differ.
- A unit gets a section only with changes, diagnostics, or a failure. A section has the result line (when not succeeded), the error fence, the warnings element, the tofu summary line, the groups in this order: create, update, replace, destroy, read, import, forget, move, ephemeral, and then the changes to outputs.
- Render the body of a forget with `formatBody`, not with `formatDiff`. A removed block has no markers, and `formatDiff` turns a YAML list item in a heredoc of that block into a change line. `formatBody` removes the common indentation, because OpenTofu prints the attributes at 4 spaces and Terraform at 8.
- A replacement with `lifecycle { destroy = false }` is in the Replace group with the reason `older instance will not be destroyed (lifecycle.destroy = false)`, unless the block has a reason line. The old object stays outside the state, and the diff alone does not show that.
- Put the warnings of a unit in one closed `<details>` element, grouped by summary, with one header for each summary. Under a header with more than one distinct detail, render each distinct detail as a sub-group: the occurrences, then the detail indented by four spaces. A warning whose detail names the resource address has a distinct detail for each occurrence, and one report showed 50 headers of one summary. Keep the errors in the open fence above the element, also for a failed unit. A unit can have 50 equal warnings, and an open block of that size hides the error and the diff.
- Sort the occurrences of a sub-group by location in natural order, then by address. Compare the line number as a number, so `a.tf:9` comes before `a.tf:10`. Sort the summaries by text. Sort the sub-groups of a summary by the location and the address of their first occurrence, then by detail. An empty part sorts first. Do not keep the order of the file, because OpenTofu changes the order of the warnings with equal locations between two runs of one configuration.
- Render two warnings of one sub-group with the same location and the same address as one line with a count suffix, for example `  on main.tf:30 (2)`. Keep every diagnostic in the group count and in the element count, because these counts must agree with the file and with the status line. A sub-group without a location and an address gets one line with its count, for example `  (3)`, so the detail of each sub-group follows a line of its own sub-group.
- In an apply report, each resource has its outcome: `✅` with the duration, `❌ failed`, or `⏳ not applied`.
- Put the anchor of a unit section on its heading line as `<a id="ID"></a>`, before the code span. GitHub gives a markdown heading in a comment no `id`, but it keeps an explicit `<a id>` and renders it as `id="user-content-ID"`.
- Link a table row to `#user-content-ID`, not to `#ID`. GitHub's own footnote links use this form, so the link works without the script of the page.
- Make the ID from `trr-`, the slug of the `header`, and the slug of the unit name. One page can show more than one report, for example two reports on one pull request, or the plan and apply summaries of one job.
- Above 10 unit sections, put the groups and the outputs diff of each section in one `<details>` element. The table is then the index. Keep the heading, the result line, the error fence, and the warnings element above that element. The reader then sees the error of a failed unit without a click.
- Escape the text of a `<summary>` element as HTML, not as markdown. GitHub renders an HTML block without markdown, so a markdown escape shows as a backslash.
- Open a failed resource, its group, and the collapsed section of a failed unit, also without `expand`. The reader of a failed run looks for the error first.
- Show the Duration column only when at least one unit has a duration. Only the report file gives a duration, and a report without that file must not have an empty column.
- The unit name of a `-json-into` file is its path relative to `working-directory`, cut before `/.terragrunt-cache/`. The unit name of a `tfplan.json` file is its directory relative to `plan-json-dir`. The unit name in the log is the terragrunt prefix. The three must be equal for one unit, so the README tells the user to pass the directory of the run as `working-directory`.
- Match a unit name by its path suffix across the sources. The name of a `-json-into` file is relative to `working-directory`, and the log name is relative to the `--working-dir` of terragrunt. When the two directories differ, the names differ, for example `live/unit2` and `unit2`. The rank is the log, the report file, the plan files, and the `-json-into` files. A name gets the one name of a higher rank that matches. Do not map a name to a name of its own source, because an early-exit unit has no log name. Without this rule, the action maps the report name `app` of an early-exit unit to the log name `team/app`. [Terragrunt issue 6602](https://github.com/gruntwork-io/terragrunt/issues/6602) describes a related case.
- `empty` is `false` when the counts of a unit are unknown, for example with a report file alone, because a deleted comment must not hide a change. For the kind `other`, `empty` is `true` when no unit failed, no unit exited early, and the log has no run error, because such a run cannot hide a change.

## Releases

`CONTRIBUTING.md` describes the release flow. These rules add to it.

- Change `dist/` only through the release workflow, for two reasons. A dependency update without a rebuild has no effect at runtime. If every pull request needs a rebuild, CI fails on every Renovate pull request, because Renovate does not rebuild `dist/`. The workflow adds the build with `git add -f`, because `dist/` is in `.gitignore`.
- Keep the release branch exempt from the `dist/` check in `ci.yml`, because the release workflow commits the build there.
- Merge the release pull request with `gh pr merge --admin`. The checks do not run on it, because release-please and the `dist/` commit step use the default token. GitHub starts no workflow run for an event from that token. The ruleset on `main` requires the checks, and the admin role has a bypass for pull requests. The ci run on `main` after the merge must pass.
- Keep the `-json-into` files of phase 2 in `e2e.yml` for phase 3. The early-exit unit of phase 3 then keeps its file of phase 2, and the action writes the stale-file warning for that unit.

## Facts about terragrunt and OpenTofu

These facts were verified on terragrunt 1.1.6 and OpenTofu 1.13.1. The code or the Contract section of `README.md` depends on each fact.

- The default log line is `HH:MM:SS.mmm LEVEL [unit] tofu: msg`. The `tofu:` token is the base name of the `--tf-path` binary, for example `opentofu:`. Terragrunt does not escape a `]` in the unit name, for example `[brkt[1]]`.
- In the default log format, terragrunt drops the empty lines of the tofu output. With `--log-format=json`, terragrunt keeps the empty lines in `msg`. The parser drops them, so that both formats give one report.
- With `--log-level=error`, the log still contains the STDOUT and STDERR lines of tofu.
- A failed plan writes no `tfplan.json` file. Terragrunt does not clear `--json-out-dir`, so the `tfplan.json` file of an earlier run stays.
- The `timestamp` of a `tfplan.json` file has whole seconds. So it can be up to 1 second earlier than the `Started` time of its unit.
- An early-exit unit writes no `-json-into` file.
- The first message of a `-json-into` file is `version`, and its `@timestamp` is later than the `Started` time of the unit in the report file. A unit that does not run keeps the file of an earlier run. This is true for a plan and for an apply.
- A `-json-into` file has no `apply_start` or `apply_complete` hook for an import or a forget.
- The `tfplan.json` file has the key of a deposed object in the field `deposed`, next to the live `address`. A `-json-into` file has no deposed key, so the messages and the hooks of a deposed object use the address of its live object. One address can then have more than one `apply_start` message.
- For a failed destroy of a deposed object, tofu writes no `apply_errored` message. The `-json-into` file has an `apply_start` message without an `apply_complete` message, and a diagnostic without an address.
- Two deposed objects of one address get one `apply_complete` message, and the `change_summary` counts the destroy once.
- A destroy-time provisioner does not run for a deposed object.
- The `tfplan.json` file has no `action_reason` for a deposed object, so only the log has the reason text.
- Terragrunt writes the tofu output to its log per write chunk of at most 32 KiB. A line that spans a chunk boundary becomes two log lines, and the second line starts with the rest of the first. A nested brace of a block has 8 or more spaces, except in a removed block, so `extractBlocks` ends every other block at a brace with at most 4 spaces, also when the split cut the indentation of the brace. A removed block ends only at a brace in column 0, so a split that cuts all the indentation of a nested brace of a removed block ends the block early. `extractBlocks` joins a line that does not start with a space to the previous body line. A second line that starts with a space stays a line of its own, because a normal body line starts the same way. A split in the header line, in a reason line, or before the type word of the resource line skips that block.
- A heredoc in a list, for example a `values` entry of a `helm_release`, has `<<-EOT` on a line of its own, 4 columns right of the attribute marker, and its terminator is `EOT,`. The content lines and the markers of the changed lines have the same offsets from that line as in an attribute heredoc.
- For a `removed` block, the `planned_change` action is `remove`, and the `tfplan.json` file has the actions `["forget"]`. The resource line of the diff block has the marker `.` at 2 spaces, the attribute lines and the closing brace of a top-level map have 4 spaces, a nested line has 8 or more spaces, and the block closes with `}` in column 0.
- Terraform 1.16.5 prints a removed block with one space before the `#` of the header, before the `#` of the reason line, and before the `.` of the resource line. Its attribute lines have 8 spaces, and the block closes at 4 spaces. `HEADER_START` and `COMMENT` accept one or two spaces, and `REMOVED` matches the marker at 2 spaces only, so the Terraform block ends at its brace with 4 spaces.
- For a replacement with `lifecycle { destroy = false }`, OpenTofu prints the header `must be replaced - older instance will not be destroyed (lifecycle.destroy = false)` and the marker `./+`, also with `create_before_destroy`. The `tfplan.json` file has the actions `["forget","create"]`. The `planned_change` message has the action `noop` and the reason of the replacement, for example `cannot_update`, because the machine-readable UI has no action name for the pair. The apply hooks have the action `create` only, and the `change_summary` of the apply counts no forget.
- For the same replacement, Terraform 1.16.5 prints the header `must be replaced, but the existing object will not be destroyed` and the reason line `(destroy = false is set in the configuration)`, both with one space before the `#`. The marker is `./+` in column 0, or `+/.` at one space with `create_before_destroy`. The `tfplan.json` file then has `["create","forget"]`. The plan line of Terraform does not count the forget.
- After a failed unit, terragrunt logs a top-level `ERROR` entry that starts with `Run failed`. The last entry starts with `error occurred`, or with `N errors occurred` after more than one error. The code takes the last entry that starts with `Run failed` or `error occurred`. After more than one error, that entry is the `Run failed` entry.
- After a configuration error, terragrunt writes the report file `[]` and no `--json-out-dir` directory. The log then has top-level `ERROR` entries, but no `Run failed` entry. The action then ignores every `tfplan.json` and `-json-into` file, because no unit ran and each file is from an earlier run.
- `run --all -- init` and `-- validate` write the report file, with `Cmd` `init` or `validate`. The stdout of these commands has no diff block and no summary line. A failed init or validate writes the error of the unit as STDERR lines and then the `Run failed` entry, as a failed apply does.
- The `Cause` of an early exit in the report file is the base name of the failed ancestor, not its path.
- The `outputs` message of a `-json-into` file has the values of the outputs. Do not render these values, because they can be sensitive.
- Tofu writes a warning to STDOUT and an error to STDERR. The stderr fence of a unit thus has no warning, and the warnings element shows each warning of the `-json-into` file once. A `tfplan.json` file has no diagnostics. The `-json-into` file of a plan has the diagnostics of the plan, so a plan report has a warnings element only with `plan-json-files`.
- Tofu prints each distinct warning summary once, with the first location and the count of the other locations: `(and 2 more similar warnings elsewhere)` in the full output, and `on main.tf line 38 (and 2 more)` with `-compact-warnings`. The `-json-into` file has every warning, so the element count is higher than the number of warnings in the log.
- OpenTofu prints `is tainted, so it must be replaced` in the header of a tainted resource, and Terraform 1.16.5 prints `is tainted, so must be replaced`. `PHRASES` in `src/text.ts` has both wordings, because a log-only report reads the address from the header.

## Docs

- `README.md` is the consumer document. Do not put internal mechanics in it, because its readers use the action and do not change it. Put the mechanics in this file.
- The checks, the fixtures, and the release flow are in `CONTRIBUTING.md`. Do not repeat them here, because a second copy gets out of date.
- Write prose in the output style `.claude/output-styles/asd-ste100.md`. A sub-agent does not get the output style. Tell each sub-agent that writes a commit message, a pull request body, or a document to read that file.
