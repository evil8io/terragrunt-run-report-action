<!-- terragrunt-run-report: Terragrunt run report -->
## Terragrunt run report

**Plan: 6 units, 3 with changes, 2 unchanged, 1 failed.** 6 to add, 0 to change, 6 to destroy. ⚠️ 18 warnings in 6 units.

| Unit | Result | Add | Change | Destroy | Duration |
| --- | --- | ---: | ---: | ---: | ---: |
| [`.terragrunt-stack/alpha`](#user-content-trr-terragrunt-run-report-terragrunt-stack-alpha) | ✅ succeeded | 2 | 0 | 3 | 1s |
| [`.terragrunt-stack/beta`](#user-content-trr-terragrunt-run-report-terragrunt-stack-beta) | ✅ succeeded | 1 | 0 | 1 | 1s |
| [`.terragrunt-stack/delta`](#user-content-trr-terragrunt-run-report-terragrunt-stack-delta) | ✅ succeeded | 2 | 0 | 1 | 1s |
| [`.terragrunt-stack/epsilon`](#user-content-trr-terragrunt-run-report-terragrunt-stack-epsilon) | ✅ no changes | 0 | 0 | 0 | 1s |
| [`.terragrunt-stack/gamma`](#user-content-trr-terragrunt-run-report-terragrunt-stack-gamma) | ✅ no changes | 0 | 0 | 0 | 1s |
| [`.terragrunt-stack/zeta`](#user-content-trr-terragrunt-run-report-terragrunt-stack-zeta) | ❌ failed (run error) | 1 | 0 | 1 | 1s |

### <a id="trr-terragrunt-run-report-terragrunt-stack-alpha"></a>`.terragrunt-stack/alpha`

<details><summary>⚠️ 3 warnings</summary>

```
Warning: Redundant ignore_changes element (3)
  on main.tf:38
  on main.tf:51
  on main.tf:70

Adding an attribute name to ignore_changes tells OpenTofu to ignore future changes to the argument in configuration after the object has been created, retaining the value originally configured.

The attribute id is decided by the provider alone and therefore there can be no configured value to compare with. Including this attribute in ignore_changes has no effect. Remove the attribute from ignore_changes to quiet this warning.
```

</details>

Plan: 2 to add, 0 to change, 3 to destroy.

<details><summary>⚙️ Replace (2)</summary>

<details><summary><code>local_file.main</code></summary>

```diff
! content              = <<-EOT # forces replacement
      alpha phase 2
      replace=19a7c450-b210-eadd-64df-ed08afcd767b
  EOT -> (known after apply) # forces replacement
! content_base64sha256 = "asW5IK8kONqC194RPWP7uZzib/V2w61qSmZEcBnSfK8=" -> (known after apply)
! content_base64sha512 = "wYRTSwZPZHOEh8sQQgg6iSFEtA+fgzSaQ0SvwRYJihLfkddndhuvBaYRR7RJW0fnlXqqzn4KCqAq1XvTg6ZazA==" -> (known after apply)
! content_md5          = "cdc15103e62b2128fa3e04ddb0656ee3" -> (known after apply)
! content_sha1         = "cad01bc59cbeff51ba6dbd074a5064a050053507" -> (known after apply)
! content_sha256       = "6ac5b920af2438da82d7de113d63fbb99ce26ff576c3ad6a4a66447019d27caf" -> (known after apply)
! content_sha512       = "c184534b064f64738487cb1042083a892144b40f9f83349a4344afc116098a12df91d767761baf05a61147b4495b47e7957aaace7e0a0aa02ad57bd383a65acc" -> (known after apply)
! id                   = "cad01bc59cbeff51ba6dbd074a5064a050053507" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

<details><summary><code>terraform_data.replace</code></summary>

```diff
! id               = "19a7c450-b210-eadd-64df-ed08afcd767b" -> (known after apply)
! triggers_replace = "phase-2" -> "phase-3"
```

</details>

</details>

<details><summary>🗑️ Destroy (1)</summary>

<details><summary><code>local_file.extra[0]</code></summary>

```diff
- content              = <<-EOT
      extra file of alpha
  EOT -> null
- content_base64sha256 = "tOdAO1fIo+Vyw/MQfTzArXVouon/T9R9E9ndLgX/+gY=" -> null
- content_base64sha512 = "tGFQ0qui6uv3xmyqXWlg4SLEc4Fag6HpQxJnQItL+BlUAY8loqDGI70P0A8938PWABo41Pkp+hu3P6WdzPiByQ==" -> null
- content_md5          = "f7a574d51faadb5b973a32cd96e2d692" -> null
- content_sha1         = "7358b17d760059a231a1813c267848540b8f592f" -> null
- content_sha256       = "b4e7403b57c8a3e572c3f3107d3cc0ad7568ba89ff4fd47d13d9dd2e05fffa06" -> null
- content_sha512       = "b46150d2aba2eaebf7c66caa5d6960e122c473815a83a1e9431267408b4bf81954018f25a2a0c623bd0fd00f3ddfc3d6001a38d4f929fa1bb73fa59dccf881c9" -> null
- directory_permission = "0777" -> null
- file_permission      = "0777" -> null
- filename             = "./.out/alpha-extra.txt" -> null
- id                   = "7358b17d760059a231a1813c267848540b8f592f" -> null
```

_→ because index [0] is out of range for count_

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
! content    = "alpha phase 2" -> "alpha phase 3"
! replace_id = "19a7c450-b210-eadd-64df-ed08afcd767b" -> (known after apply)
```

</details>

### <a id="trr-terragrunt-run-report-terragrunt-stack-beta"></a>`.terragrunt-stack/beta`

<details><summary>⚠️ 3 warnings</summary>

```
Warning: Redundant ignore_changes element (3)
  on main.tf:38
  on main.tf:51
  on main.tf:70

Adding an attribute name to ignore_changes tells OpenTofu to ignore future changes to the argument in configuration after the object has been created, retaining the value originally configured.

The attribute id is decided by the provider alone and therefore there can be no configured value to compare with. Including this attribute in ignore_changes has no effect. Remove the attribute from ignore_changes to quiet this warning.
```

</details>

Plan: 1 to add, 0 to change, 1 to destroy.

<details><summary>⚙️ Replace (1)</summary>

<details><summary><code>local_file.main</code></summary>

```diff
! content              = <<-EOT # forces replacement
-     beta after alpha, phase 2
+     beta after alpha, phase 3
      replace=222bc366-78c8-8d40-e1fc-9d75149fdda4
  EOT
! content_base64sha256 = "n/oM5qWTIPcdkYQZudicXUo9Ba/mS6gVsQ+U5CbJ/eg=" -> (known after apply)
! content_base64sha512 = "vethEuXd/R9WP3fViaOVUavCW8RjAI66TmgWQDLcFeEGlaOSjpIxqrxqQl3y1CHTjpdZp4qfU8ff0rdVNqrMqA==" -> (known after apply)
! content_md5          = "386ad1e669d2c7ff572866a7dc65636e" -> (known after apply)
! content_sha1         = "9addccda1f3a24870ccf008d0ec201f2f822b6a3" -> (known after apply)
! content_sha256       = "9ffa0ce6a59320f71d918419b9d89c5d4a3d05afe64ba815b10f94e426c9fde8" -> (known after apply)
! content_sha512       = "bdeb6112e5ddfd1f563f77d589a39551abc25bc463008eba4e68164032dc15e10695a3928e9231aabc6a425df2d421d38e9759a78a9f53c7dfd2b75536aacca8" -> (known after apply)
! id                   = "9addccda1f3a24870ccf008d0ec201f2f822b6a3" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
! content    = "beta after alpha, phase 2" -> "beta after alpha, phase 3"
```

</details>

### <a id="trr-terragrunt-run-report-terragrunt-stack-delta"></a>`.terragrunt-stack/delta`

<details><summary>⚠️ 3 warnings</summary>

```
Warning: Redundant ignore_changes element (3)
  on main.tf:38
  on main.tf:51
  on main.tf:70

Adding an attribute name to ignore_changes tells OpenTofu to ignore future changes to the argument in configuration after the object has been created, retaining the value originally configured.

The attribute id is decided by the provider alone and therefore there can be no configured value to compare with. Including this attribute in ignore_changes has no effect. Remove the attribute from ignore_changes to quiet this warning.
```

</details>

Plan: 2 to add, 0 to change, 1 to destroy.

<details><summary>✨ Create (1)</summary>

<details><summary><code>terraform_data.fail[0]</code></summary>

```diff
+ id     = (known after apply)
+ input  = "delta phase 3"
+ output = (known after apply)
```

</details>

</details>

<details><summary>⚙️ Replace (1)</summary>

<details><summary><code>local_file.main</code></summary>

```diff
! content              = <<-EOT # forces replacement
-     delta phase 2
+     delta phase 3
      replace=cc2139ed-cbb2-43ec-70a3-cc4e7818d531
  EOT
! content_base64sha256 = "3lYSkkZHvgYiIZWb6pWa8ln48m5PcFcsVUS+URtAKS8=" -> (known after apply)
! content_base64sha512 = "N/uqxoxa7YHHMKCAb9Zfu1EuQy5B2BBJIut8pnJduSmWbqVURyQXrowc2Kov+xofR49iLrz2PbCAVGPnbdsjJw==" -> (known after apply)
! content_md5          = "af5779f67d55ea8461ec8855ce0b47e5" -> (known after apply)
! content_sha1         = "febcc4ea6573bc611e2d26044153e2c537b1b5ff" -> (known after apply)
! content_sha256       = "de5612924647be062221959bea959af259f8f26e4f70572c5544be511b40292f" -> (known after apply)
! content_sha512       = "37fbaac68c5aed81c730a0806fd65fbb512e432e41d8104922eb7ca6725db929966ea554472417ae8c1cd8aa2ffb1a1f478f622ebcf63db0805463e76ddb2327" -> (known after apply)
! id                   = "febcc4ea6573bc611e2d26044153e2c537b1b5ff" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
! content    = "delta phase 2" -> "delta phase 3"
```

</details>

### <a id="trr-terragrunt-run-report-terragrunt-stack-epsilon"></a>`.terragrunt-stack/epsilon`

<details><summary>⚠️ 3 warnings</summary>

```
Warning: Redundant ignore_changes element (3)
  on main.tf:38
  on main.tf:51
  on main.tf:70

Adding an attribute name to ignore_changes tells OpenTofu to ignore future changes to the argument in configuration after the object has been created, retaining the value originally configured.

The attribute id is decided by the provider alone and therefore there can be no configured value to compare with. Including this attribute in ignore_changes has no effect. Remove the attribute from ignore_changes to quiet this warning.
```

</details>

No changes. Your infrastructure matches the configuration.

### <a id="trr-terragrunt-run-report-terragrunt-stack-gamma"></a>`.terragrunt-stack/gamma`

<details><summary>⚠️ 3 warnings</summary>

```
Warning: Redundant ignore_changes element (3)
  on main.tf:38
  on main.tf:51
  on main.tf:70

Adding an attribute name to ignore_changes tells OpenTofu to ignore future changes to the argument in configuration after the object has been created, retaining the value originally configured.

The attribute id is decided by the provider alone and therefore there can be no configured value to compare with. Including this attribute in ignore_changes has no effect. Remove the attribute from ignore_changes to quiet this warning.
```

</details>

No changes. Your infrastructure matches the configuration.

### <a id="trr-terragrunt-run-report-terragrunt-stack-zeta"></a>`.terragrunt-stack/zeta`

❌ failed (run error)

```
Error: Resource precondition failed
  on main.tf line 45, in resource "terraform_data" "main":
  45:       condition     = !var.fail_plan
    ├────────────────
    │ var.fail_plan is true
The unit zeta is configured to fail at plan time.
```

<details><summary>⚠️ 3 warnings</summary>

```
Warning: Redundant ignore_changes element (3)
  on main.tf:38
  on main.tf:51
  on main.tf:70

Adding an attribute name to ignore_changes tells OpenTofu to ignore future changes to the argument in configuration after the object has been created, retaining the value originally configured.

The attribute id is decided by the provider alone and therefore there can be no configured value to compare with. Including this attribute in ignore_changes has no effect. Remove the attribute from ignore_changes to quiet this warning.
```

</details>

Plan: 1 to add, 0 to change, 1 to destroy.

<details><summary>⚙️ Replace (1)</summary>

<details><summary><code>local_file.main</code></summary>

```diff
! content              = <<-EOT # forces replacement
-     zeta phase 2
+     zeta phase 3
      replace=b6792be6-cb6c-02f5-97fc-fafee462bd4e
  EOT
! content_base64sha256 = "X0P4Rd40glmQ89+t7Rsqfe2bXD7Sf9+Bd04krqat9Xg=" -> (known after apply)
! content_base64sha512 = "JGtYy5fw5Awtqt00TLxHNZ12y8oYhKywZpNGZnk5WeSuv2EtrB6a0oFEuve0D+K5VcU0qu/3vJ/Y9z6+dVmXVA==" -> (known after apply)
! content_md5          = "1a9de9f413b0c0aa7fc8fe60ff373676" -> (known after apply)
! content_sha1         = "49a320281df1a3d89830fa4a50f776c15103cf39" -> (known after apply)
! content_sha256       = "5f43f845de34825990f3dfaded1b2a7ded9b5c3ed27fdf81774e24aea6adf578" -> (known after apply)
! content_sha512       = "246b58cb97f0e40c2daadd344cbc47359d76cbca1884acb066934666793959e4aebf612dac1e9ad28144baf7b40fe2b955c534aaeff7bc9fd8f73ebe75599754" -> (known after apply)
! id                   = "49a320281df1a3d89830fa4a50f776c15103cf39" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
! content    = "zeta phase 2" -> "zeta phase 3"
```

</details>
