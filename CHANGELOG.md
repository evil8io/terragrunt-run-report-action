# Changelog

## [0.6.2](https://github.com/evil8io/terragrunt-run-report-action/compare/v0.6.1...v0.6.2) (2026-10-06)


### Bug Fixes

* join a tofu line that terragrunt logs as two lines ([#47](https://github.com/evil8io/terragrunt-run-report-action/issues/47)) ([4a266da](https://github.com/evil8io/terragrunt-run-report-action/commit/4a266dad54712937ca16faf9b70b5afb41039597))

## [0.6.1](https://github.com/evil8io/terragrunt-run-report-action/compare/v0.6.0...v0.6.1) (2026-10-05)


### Bug Fixes

* keep the YAML list items of a heredoc in a list as context lines ([#44](https://github.com/evil8io/terragrunt-run-report-action/issues/44)) ([b14d0f4](https://github.com/evil8io/terragrunt-run-report-action/commit/b14d0f40f680af1066ed0c575aa5af67827c4ec8))

## [0.6.0](https://github.com/evil8io/terragrunt-run-report-action/compare/v0.5.0...v0.6.0) (2026-10-04)


### Features

* add the output warnings ([#39](https://github.com/evil8io/terragrunt-run-report-action/issues/39)) ([550c15d](https://github.com/evil8io/terragrunt-run-report-action/commit/550c15d675476a5c3d198fe125c5d4712772b183))
* read the warnings of a plan from the -json-into files ([#37](https://github.com/evil8io/terragrunt-run-report-action/issues/37)) ([fb3a8de](https://github.com/evil8io/terragrunt-run-report-action/commit/fb3a8de70aa196b5bd4344a4d5b5e17694f57b60))
* render one header for each warning summary ([#40](https://github.com/evil8io/terragrunt-run-report-action/issues/40)) ([780b2a4](https://github.com/evil8io/terragrunt-run-report-action/commit/780b2a4a9bd82424e37932b3d36afd13c7c9e442))
* report an init or a validate with its command as the kind ([#41](https://github.com/evil8io/terragrunt-run-report-action/issues/41)) ([c5189d0](https://github.com/evil8io/terragrunt-run-report-action/commit/c5189d01cdbf620c5d01cc67791a5827a0a33a9e))


### Bug Fixes

* stale files after a configuration error and warnings without a location ([#42](https://github.com/evil8io/terragrunt-run-report-action/issues/42)) ([aa0071e](https://github.com/evil8io/terragrunt-run-report-action/commit/aa0071e35b08d811695f3e7d1e3415abdff14c8e))

## [0.5.0](https://github.com/evil8io/terragrunt-run-report-action/compare/v0.4.0...v0.5.0) (2026-10-04)


### Features

* count the warnings in the status line and sort the warning groups ([#35](https://github.com/evil8io/terragrunt-run-report-action/issues/35)) ([f6c0ace](https://github.com/evil8io/terragrunt-run-report-action/commit/f6c0aceae640a304a2c6ab076e55633da5bf3020))

## [0.4.0](https://github.com/evil8io/terragrunt-run-report-action/compare/v0.3.0...v0.4.0) (2026-10-04)


### Features

* group the warnings of a unit and collapse them ([#33](https://github.com/evil8io/terragrunt-run-report-action/issues/33)) ([67feddc](https://github.com/evil8io/terragrunt-run-report-action/commit/67feddced6dd254ee6f7ac959e60644710dc7459))

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
