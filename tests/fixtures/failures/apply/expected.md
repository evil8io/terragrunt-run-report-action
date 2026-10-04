<!-- terragrunt-run-report: Terragrunt run report -->
## Terragrunt run report

**Apply: 6 units, 2 with changes, 1 unchanged, 2 failed, 1 early exit.** 4 added, 0 changed, 5 destroyed.

| Unit | Result | Add | Change | Destroy | Duration |
| --- | --- | ---: | ---: | ---: | ---: |
| [`.terragrunt-stack/alpha`](#user-content-trr-terragrunt-run-report-terragrunt-stack-alpha) | ✅ succeeded | 2 | 0 | 3 | 1s |
| [`.terragrunt-stack/beta`](#user-content-trr-terragrunt-run-report-terragrunt-stack-beta) | ✅ succeeded | 1 | 0 | 1 | 1s |
| [`.terragrunt-stack/delta`](#user-content-trr-terragrunt-run-report-terragrunt-stack-delta) | ❌ failed (run error) | 1 of 2 | 0 | 1 | 1s |
| `.terragrunt-stack/epsilon` | ⏭️ early exit (ancestor error: delta) |  |  |  | 1s |
| [`.terragrunt-stack/gamma`](#user-content-trr-terragrunt-run-report-terragrunt-stack-gamma) | ✅ no changes | 0 | 0 | 0 | 1s |
| [`.terragrunt-stack/zeta`](#user-content-trr-terragrunt-run-report-terragrunt-stack-zeta) | ❌ failed (run error) | 0 of 1 | 0 | 0 of 1 | 1s |

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

Apply complete! Resources: 2 added, 0 changed, 3 destroyed.

<details><summary>⚙️ Replace (2)</summary>

<details><summary><code>local_file.main</code> ✅ 0s</summary>

```diff
! content              = <<-EOT # forces replacement
      alpha phase 2
      replace=6a365a60-6fe4-d957-6d62-fc566cc0924e
  EOT -> (known after apply) # forces replacement
! content_base64sha256 = "HN7KIqlReJITX66McTFr3JLEMmyGkb9lzkGCMwTZ1gc=" -> (known after apply)
! content_base64sha512 = "H2ArmVxHN9lZKhN8vIhYF2++GRHe50B/8wHddMgy6K4vOd8pH36EWzrw4RX67ZDNAaaXYZ4Tyma2MIwq1VdcHQ==" -> (known after apply)
! content_md5          = "0c47e5d00bd02ae167d4b10637e51587" -> (known after apply)
! content_sha1         = "5fc26f27ab73af27411444cc1dbc4ce2d01ad06c" -> (known after apply)
! content_sha256       = "1cdeca22a9517892135fae8c71316bdc92c4326c8691bf65ce41823304d9d607" -> (known after apply)
! content_sha512       = "1f602b995c4737d9592a137cbc8858176fbe1911dee7407ff301dd74c832e8ae2f39df291f7e845b3af0e115faed90cd01a697619e13ca66b6308c2ad5575c1d" -> (known after apply)
! id                   = "5fc26f27ab73af27411444cc1dbc4ce2d01ad06c" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
! id               = "6a365a60-6fe4-d957-6d62-fc566cc0924e" -> (known after apply)
! triggers_replace = "phase-2" -> "phase-3"
```

</details>

</details>

<details><summary>🗑️ Destroy (1)</summary>

<details><summary><code>local_file.extra[0]</code> ✅ 0s</summary>

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
! replace_id = "6a365a60-6fe4-d957-6d62-fc566cc0924e" -> (known after apply)
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

Apply complete! Resources: 1 added, 0 changed, 1 destroyed.

<details><summary>⚙️ Replace (1)</summary>

<details><summary><code>local_file.main</code> ✅ 0s</summary>

```diff
! content              = <<-EOT # forces replacement
-     beta after alpha, phase 2
+     beta after alpha, phase 3
      replace=fd98a5eb-06ae-4bbd-958b-0ee57ac1e3c5
  EOT
! content_base64sha256 = "b6NRKfbuWc541TGwuKSZ/goaOyDoQqzSJYiKE6I1040=" -> (known after apply)
! content_base64sha512 = "JsyoLJ7yz+VcnJl45rlqf86ehAZ51YJ9k/288y6W8Jur4vo3IGVljVkpCTrV4hKP35p7yxEuaRKTlyO5rIjglg==" -> (known after apply)
! content_md5          = "5c41495a892fbd33a205db80324a2d1c" -> (known after apply)
! content_sha1         = "43ab2c5bc9a1d8b433420322601c6492acbe7392" -> (known after apply)
! content_sha256       = "6fa35129f6ee59ce78d531b0b8a499fe0a1a3b20e842acd225888a13a235d38d" -> (known after apply)
! content_sha512       = "26cca82c9ef2cfe55c9c9978e6b96a7fce9e840679d5827d93fdbcf32e96f09babe2fa372065658d5929093ad5e2128fdf9a7bcb112e6912939723b9ac88e096" -> (known after apply)
! id                   = "43ab2c5bc9a1d8b433420322601c6492acbe7392" -> (known after apply)
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

❌ failed (run error)

```
Error: local-exec provisioner error
  with terraform_data.fail[0],
  on main.tf line 74, in resource "terraform_data" "fail":
  74:   provisioner "local-exec" {
Error running command 'echo 'simulated failure in delta' >&2; exit 1': exit
status 1. Output: simulated failure in delta
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

Plan: 2 to add, 0 to change, 1 to destroy.

<details open><summary>✨ Create (1)</summary>

<details open><summary><code>terraform_data.fail[0]</code> ❌ failed</summary>

```diff
+ id     = (known after apply)
+ input  = "delta phase 3"
+ output = (known after apply)
```

</details>

</details>

<details><summary>⚙️ Replace (1)</summary>

<details><summary><code>local_file.main</code> ✅ 0s</summary>

```diff
! content              = <<-EOT # forces replacement
-     delta phase 2
+     delta phase 3
      replace=3b06cc70-90e0-1315-cb65-6d655943a066
  EOT
! content_base64sha256 = "xUDc/9de7DrGaQOzoRUfDyAmMR7ygzPTrQFzjoQZERk=" -> (known after apply)
! content_base64sha512 = "mU/u4l+kJqlzZDBw/amnp9IWb1D7MX/d+An/TSdqmpVJ7ZAjfF+VgQAOM/Ti/x34x2jCaf/IMVobY3VYdQMEaQ==" -> (known after apply)
! content_md5          = "d528ca582c6eac87381bbbe74491c090" -> (known after apply)
! content_sha1         = "0c6137175ceb6f27cae6ef43ab292d93a9bdf077" -> (known after apply)
! content_sha256       = "c540dcffd75eec3ac66903b3a1151f0f2026311ef28333d3ad01738e84191119" -> (known after apply)
! content_sha512       = "994feee25fa426a973643070fda9a7a7d2166f50fb317fddf809ff4d276a9a9549ed90237c5f9581000e33f4e2ff1df8c768c269ffc8315a1b63755875030469" -> (known after apply)
! id                   = "0c6137175ceb6f27cae6ef43ab292d93a9bdf077" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
! content    = "delta phase 2" -> "delta phase 3"
```

</details>

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

Apply complete! Resources: 0 added, 0 changed, 0 destroyed.

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

<details><summary><code>local_file.main</code> ⏳ not applied</summary>

```diff
! content              = <<-EOT # forces replacement
-     zeta phase 2
+     zeta phase 3
      replace=5517f486-d950-f570-4fe7-baf2e9d46234
  EOT
! content_base64sha256 = "RSOG4UP26gkIoEaJr6WZDp817+wL/lucFydOwDmOmM0=" -> (known after apply)
! content_base64sha512 = "EXs7QupP6N8ZgMwPOQBfkIUBRMmMcLFkh1uVItqqR4EwDRDB1oVBqgPyp3i77ifIv6UjF2GEUgHlDqOJEO92oA==" -> (known after apply)
! content_md5          = "7a9cdee3dacd3635d6df6ae653340e2d" -> (known after apply)
! content_sha1         = "95198e5fb6c7a6d29cec70f09c1c8828df325fe8" -> (known after apply)
! content_sha256       = "452386e143f6ea0908a04689afa5990e9f35efec0bfe5b9c17274ec0398e98cd" -> (known after apply)
! content_sha512       = "117b3b42ea4fe8df1980cc0f39005f90850144c98c70b164875b9522daaa4781300d10c1d68541aa03f2a778bbee27c8bfa5231761845201e50ea38910ef76a0" -> (known after apply)
! id                   = "95198e5fb6c7a6d29cec70f09c1c8828df325fe8" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
! content    = "zeta phase 2" -> "zeta phase 3"
```

</details>
