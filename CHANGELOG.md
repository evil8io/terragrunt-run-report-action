# Changelog

## [0.3.0](https://github.com/evil8io/terragrunt-run-report-action/compare/v0.2.0...v0.3.0) (2026-10-04)


### Features

* link the table to the sections, add Duration and markdown-file ([#26](https://github.com/evil8io/terragrunt-run-report-action/issues/26)) ([4223c92](https://github.com/evil8io/terragrunt-run-report-action/commit/4223c92bfe22eb1b426a42da1c46ee24552aab7d))


### Bug Fixes

* drop the empty lines of tofu output in a JSON log ([#23](https://github.com/evil8io/terragrunt-run-report-action/issues/23)) ([c476f8e](https://github.com/evil8io/terragrunt-run-report-action/commit/c476f8ef6c05b89ca6055e7246e2a660dc03b771))
* keep early exits, mark failed deposed destroys, ignore stale plans ([#30](https://github.com/evil8io/terragrunt-run-report-action/issues/30)) ([63b245e](https://github.com/evil8io/terragrunt-run-report-action/commit/63b245eb36792cfb11ec491c314db6ec2401424c))
* match a unit name by its path suffix across the sources ([#21](https://github.com/evil8io/terragrunt-run-report-action/issues/21)) ([76eb6db](https://github.com/evil8io/terragrunt-run-report-action/commit/76eb6dbefa6f324b5e67d4ec2400ce6af2afe9fd))
* stale -json-into files, deposed objects, and fork comments ([#24](https://github.com/evil8io/terragrunt-run-report-action/issues/24)) ([8f50cc2](https://github.com/evil8io/terragrunt-run-report-action/commit/8f50cc23a177759d3f07ceff57004ae0eb6e3189))

## [0.2.0](https://github.com/evil8io/terragrunt-run-report-action/compare/v0.1.0...v0.2.0) (2026-10-04)


### Features

* end the comment with a link to the workflow run ([#19](https://github.com/evil8io/terragrunt-run-report-action/issues/19)) ([1e2f76e](https://github.com/evil8io/terragrunt-run-report-action/commit/1e2f76ee3a339441ab28251bdddb7c87b8ceaf83))

## 0.1.0 (2026-10-04)


### Features

* report the plan and apply of terragrunt run --all per unit ([#1](https://github.com/evil8io/terragrunt-run-report-action/issues/1)) ([7e00e6e](https://github.com/evil8io/terragrunt-run-report-action/commit/7e00e6e7bc44311a300bfbd54486b1ba816d8b6b))
