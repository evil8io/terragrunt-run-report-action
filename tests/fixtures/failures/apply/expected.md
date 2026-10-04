<!-- terragrunt-run-report: Terragrunt run report -->
## Terragrunt run report

**Apply: 6 units, 2 with changes, 1 unchanged, 2 failed, 1 early exit.** 4 added, 0 changed, 5 destroyed. ⚠️ 15 warnings in 5 units.

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
      replace=494d04b3-caa4-b131-a9c4-66155c6e0491
  EOT -> (known after apply) # forces replacement
! content_base64sha256 = "UT4AfilfFTHgq6/2ngj6AVzQ+Ua6GdQkAzTNaczg4UE=" -> (known after apply)
! content_base64sha512 = "4OxF8zC33B9RqWYPwxZPeWbfrWr0A/vwEbZty9Cvme+mlmSg6j2j7SqKHxZn/DVHOZrr1bu18TUEEHygsN15Rw==" -> (known after apply)
! content_md5          = "174ea7357be92179f35347dd70211225" -> (known after apply)
! content_sha1         = "f8e68636bd9340836dd9e4e535e48bb6805567c7" -> (known after apply)
! content_sha256       = "513e007e295f1531e0abaff69e08fa015cd0f946ba19d4240334cd69cce0e141" -> (known after apply)
! content_sha512       = "e0ec45f330b7dc1f51a9660fc3164f7966dfad6af403fbf011b66dcbd0af99efa69664a0ea3da3ed2a8a1f1667fc3547399aebd5bbb5f13504107ca0b0dd7947" -> (known after apply)
! id                   = "f8e68636bd9340836dd9e4e535e48bb6805567c7" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
! id               = "494d04b3-caa4-b131-a9c4-66155c6e0491" -> (known after apply)
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
! replace_id = "494d04b3-caa4-b131-a9c4-66155c6e0491" -> (known after apply)
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
      replace=6e9cb995-1623-16cd-b6e5-00d1988e8976
  EOT
! content_base64sha256 = "GnHbTj69KN9Vr3USyh6xWr6k9Rt2diarGZVG2Yp857M=" -> (known after apply)
! content_base64sha512 = "bxLYH1HED5jEVVFfdOYlKH2RIfvrFbZU2t3Y8DXeg/QzEyZpJO4i7GRauYMgB7sP69GwpCPKyspqgF35OvDdNw==" -> (known after apply)
! content_md5          = "0b88da56920f38f8a8701444798f5a4f" -> (known after apply)
! content_sha1         = "fddb3371a81239886a188f546ae73af3de88c4af" -> (known after apply)
! content_sha256       = "1a71db4e3ebd28df55af7512ca1eb15abea4f51b767626ab199546d98a7ce7b3" -> (known after apply)
! content_sha512       = "6f12d81f51c40f98c455515f74e625287d9121fbeb15b654daddd8f035de83f43313266924ee22ec645ab9832007bb0febd1b0a423cacaca6a805df93af0dd37" -> (known after apply)
! id                   = "fddb3371a81239886a188f546ae73af3de88c4af" -> (known after apply)
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
      replace=ccd28744-083a-c82c-3da0-710f1799fd0c
  EOT
! content_base64sha256 = "JXOV6MH21xci0RiH3mxHM9yT2ORCReWg2GqOC1JqZ8U=" -> (known after apply)
! content_base64sha512 = "DAwHrIzho23mU4anYSRzi2AudLnBV/QItOzRNy0eefN0EfCjrKLtN94CANcnYVguq0tfo8b0dYIP9MzDyV4jiA==" -> (known after apply)
! content_md5          = "dcf955a53348be417e28482e1147e893" -> (known after apply)
! content_sha1         = "55125d82b32874f57f1cfc7ee0cb62a68b2c60c6" -> (known after apply)
! content_sha256       = "257395e8c1f6d71722d11887de6c4733dc93d8e44245e5a0d86a8e0b526a67c5" -> (known after apply)
! content_sha512       = "0c0c07ac8ce1a36de65386a76124738b602e74b9c157f408b4ecd1372d1e79f37411f0a3aca2ed37de0200d72761582eab4b5fa3c6f475820ff4ccc3c95e2388" -> (known after apply)
! id                   = "55125d82b32874f57f1cfc7ee0cb62a68b2c60c6" -> (known after apply)
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
      replace=2b99c17b-4ce0-effd-d4d1-13fcbb5dd989
  EOT
! content_base64sha256 = "gTZJCGiDKxNiCrSUJqJYzYB2ICb3IyfMWIaWqVN9Wsk=" -> (known after apply)
! content_base64sha512 = "DkVC60IA79dMbHFR7DgHNA8dhFygQ/XrkLb9CR7YGVKmC6gKWy+hR1dMI02Q4M2MO3ins7wtm4Jl25WCKIghZw==" -> (known after apply)
! content_md5          = "1ee3abb56d8324038e8f329e8705f865" -> (known after apply)
! content_sha1         = "d7139e64879a1d465ba5e02e500dac0b4dc480a5" -> (known after apply)
! content_sha256       = "8136490868832b13620ab49426a258cd80762026f72327cc588696a9537d5ac9" -> (known after apply)
! content_sha512       = "0e4542eb4200efd74c6c7151ec3807340f1d845ca043f5eb90b6fd091ed81952a60ba80a5b2fa147574c234d90e0cd8c3b78a7b3bc2d9b8265db958228882167" -> (known after apply)
! id                   = "d7139e64879a1d465ba5e02e500dac0b4dc480a5" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
! content    = "zeta phase 2" -> "zeta phase 3"
```

</details>
