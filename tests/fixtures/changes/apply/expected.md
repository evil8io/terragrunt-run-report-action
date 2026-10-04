<!-- terragrunt-run-report: Terragrunt run report -->
## Terragrunt run report

**Apply: 6 units, 5 with changes, 1 unchanged.** 7 added, 0 changed, 7 destroyed. ⚠️ 18 warnings in 6 units.

| Unit | Result | Add | Change | Destroy | Duration |
| --- | --- | ---: | ---: | ---: | ---: |
| [`.terragrunt-stack/alpha`](#user-content-trr-terragrunt-run-report-terragrunt-stack-alpha) | ✅ succeeded | 3 | 0 | 2 | 1s |
| [`.terragrunt-stack/beta`](#user-content-trr-terragrunt-run-report-terragrunt-stack-beta) | ✅ succeeded | 1 | 0 | 2 | 1s |
| [`.terragrunt-stack/delta`](#user-content-trr-terragrunt-run-report-terragrunt-stack-delta) | ✅ succeeded | 1 | 0 | 1 | 1s |
| [`.terragrunt-stack/epsilon`](#user-content-trr-terragrunt-run-report-terragrunt-stack-epsilon) | ✅ succeeded | 1 | 0 | 1 | 1s |
| [`.terragrunt-stack/gamma`](#user-content-trr-terragrunt-run-report-terragrunt-stack-gamma) | ✅ no changes | 0 | 0 | 0 | 1s |
| [`.terragrunt-stack/zeta`](#user-content-trr-terragrunt-run-report-terragrunt-stack-zeta) | ✅ succeeded | 1 | 0 | 1 | 1s |

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

Apply complete! Resources: 3 added, 0 changed, 2 destroyed.

<details><summary>✨ Create (1)</summary>

<details><summary><code>local_file.extra[0]</code> ✅ 0s</summary>

```diff
+ content              = <<-EOT
      extra file of alpha
  EOT
+ content_base64sha256 = (known after apply)
+ content_base64sha512 = (known after apply)
+ content_md5          = (known after apply)
+ content_sha1         = (known after apply)
+ content_sha256       = (known after apply)
+ content_sha512       = (known after apply)
+ directory_permission = "0777"
+ file_permission      = "0777"
+ filename             = "./.out/alpha-extra.txt"
+ id                   = (known after apply)
```

</details>

</details>

<details><summary>⚙️ Replace (2)</summary>

<details><summary><code>local_file.main</code> ✅ 0s</summary>

```diff
! content              = <<-EOT # forces replacement
      alpha phase 1
      replace=05faebba-2b8e-0d00-1a9e-7a8cc76e8a69
  EOT -> (known after apply) # forces replacement
! content_base64sha256 = "X8jnaHtFRcIvoKi89r6WeX5uNsyNi97EfZFhjifAzPs=" -> (known after apply)
! content_base64sha512 = "dO9VcQ2h1zUWWLtwQjo4FFw8KzbuoQz7eFENb7i3594PUIdF8pF20V7vT2MzPWXe+SYAoUwTy2MfNsZlyuAglw==" -> (known after apply)
! content_md5          = "854738f90d2045d0d1bc5651bba6e43b" -> (known after apply)
! content_sha1         = "c8f47f39b049e4b53eb97f7fd6573328008dbba3" -> (known after apply)
! content_sha256       = "5fc8e7687b4545c22fa0a8bcf6be96797e6e36cc8d8bdec47d91618e27c0ccfb" -> (known after apply)
! content_sha512       = "74ef55710da1d7351658bb70423a38145c3c2b36eea10cfb78510d6fb8b7e7de0f508745f29176d15eef4f63333d65def92600a14c13cb631f36c665cae02097" -> (known after apply)
! id                   = "c8f47f39b049e4b53eb97f7fd6573328008dbba3" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
! id               = "05faebba-2b8e-0d00-1a9e-7a8cc76e8a69" -> (known after apply)
! triggers_replace = "phase-1" -> "phase-2"
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
! content    = "alpha phase 1" -> "alpha phase 2"
! replace_id = "05faebba-2b8e-0d00-1a9e-7a8cc76e8a69" -> (known after apply)
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

Apply complete! Resources: 1 added, 0 changed, 2 destroyed.

<details><summary>⚙️ Replace (1)</summary>

<details><summary><code>local_file.main</code> ✅ 0s</summary>

```diff
! content              = <<-EOT # forces replacement
-     beta after alpha, phase 1
+     beta after alpha, phase 2
      replace=fd98a5eb-06ae-4bbd-958b-0ee57ac1e3c5
  EOT
! content_base64sha256 = "EhceYUzguUQ7govKcykRkpymr4CvhUoHEm6ffN5R/as=" -> (known after apply)
! content_base64sha512 = "LL1sVybTjXXk7y5iLbQTF0h8ZbpskNcnu3xvhjLaM0JKgBNhBBF48gELhsARGAfUQBtofa2NgjgKIs4i43U8QA==" -> (known after apply)
! content_md5          = "05c5818d393b994fb0d696af6e5c545b" -> (known after apply)
! content_sha1         = "44b9eab1fec84a59d8526610625e97cef8da9046" -> (known after apply)
! content_sha256       = "12171e614ce0b9443b828bca732911929ca6af80af854a07126e9f7cde51fdab" -> (known after apply)
! content_sha512       = "2cbd6c5726d38d75e4ef2e622db41317487c65ba6c90d727bb7c6f8632da33424a801361041178f2010b86c0111807d4401b687dad8d82380a22ce22e3753c40" -> (known after apply)
! id                   = "44b9eab1fec84a59d8526610625e97cef8da9046" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

</details>

<details><summary>🗑️ Destroy (1)</summary>

<details><summary><code>local_file.extra[0]</code> ✅ 0s</summary>

```diff
- content              = <<-EOT
      extra file of beta
  EOT -> null
- content_base64sha256 = "3TqhLnJ8n53E7Rqbb06XG/LL2g67GAqt1J8dK9haW+g=" -> null
- content_base64sha512 = "W7qlrDm2KgQ2v7moly2KdzzwtW9YY/QhMHddvP4Sfav9ID3yMEO/bjlcnH/5+5y+kqC9KrWxV0mMMC98/oEGhw==" -> null
- content_md5          = "42461363abb2499ab78c3fb22c122733" -> null
- content_sha1         = "69294b4f0f99b5bba224256e9931e2a0cd13ae43" -> null
- content_sha256       = "dd3aa12e727c9f9dc4ed1a9b6f4e971bf2cbda0ebb180aadd49f1d2bd85a5be8" -> null
- content_sha512       = "5bbaa5ac39b62a0436bfb9a8972d8a773cf0b56f5863f42130775dbcfe127dabfd203df23043bf6e395c9c7ff9fb9cbe92a0bd2ab5b157498c302f7cfe810687" -> null
- directory_permission = "0777" -> null
- file_permission      = "0777" -> null
- filename             = "./.out/beta-extra.txt" -> null
- id                   = "69294b4f0f99b5bba224256e9931e2a0cd13ae43" -> null
```

_→ because index [0] is out of range for count_

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
! content    = "beta after alpha, phase 1" -> "beta after alpha, phase 2"
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

Apply complete! Resources: 1 added, 0 changed, 1 destroyed.

<details><summary>⚙️ Replace (1)</summary>

<details><summary><code>local_file.main</code> ✅ 0s</summary>

```diff
! content              = <<-EOT # forces replacement
-     delta phase 1
+     delta phase 2
      replace=3b06cc70-90e0-1315-cb65-6d655943a066
  EOT
! content_base64sha256 = "uB2oiMH13ghbTTbn8Z24yLfQFZQHuvQltkAgQkn6oGg=" -> (known after apply)
! content_base64sha512 = "p74zAtUFdCEv0Ex96DjxdApICIxFHGsnN35QI3e+gFfKJr55yXmFtiI2ribURhpvZ40B6ka6wR8J9WuN3ibwzQ==" -> (known after apply)
! content_md5          = "f92dffb27a088b50c389ccca9028b5e3" -> (known after apply)
! content_sha1         = "3359bdc2937bb15f95b0e39896efc5fd1570d5cc" -> (known after apply)
! content_sha256       = "b81da888c1f5de085b4d36e7f19db8c8b7d0159407baf425b640204249faa068" -> (known after apply)
! content_sha512       = "a7be3302d50574212fd04c7de838f1740a48088c451c6b27377e502377be8057ca26be79c97985b62236ae26d4461a6f678d01ea46bac11f09f56b8dde26f0cd" -> (known after apply)
! id                   = "3359bdc2937bb15f95b0e39896efc5fd1570d5cc" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
! content    = "delta phase 1" -> "delta phase 2"
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

Apply complete! Resources: 1 added, 0 changed, 1 destroyed.

<details><summary>⚙️ Replace (1)</summary>

<details><summary><code>local_file.main</code> ✅ 0s</summary>

```diff
! content              = <<-EOT # forces replacement
-     epsilon after delta phase 1
+     epsilon after delta phase 2
      replace=40965365-3405-9aee-fa76-9cf8656a70a7
  EOT
! content_base64sha256 = "X2RLutviedYjQM8pKy5kysTy7ek0ahdsDld0asNjbH0=" -> (known after apply)
! content_base64sha512 = "qEbMoNhOcXCryUWwSbq7mbIevdH4sljPwdLOKMQzjfqRn1WHfxMSSAYyefjFAQAswS6ac4hBI7dtL0OYD5iE5Q==" -> (known after apply)
! content_md5          = "17c27e7f32860863c0a242fff564067e" -> (known after apply)
! content_sha1         = "71234d1c9b37a23e1a98114ab5bddf4825ad749f" -> (known after apply)
! content_sha256       = "5f644bbadbe279d62340cf292b2e64cac4f2ede9346a176c0e57746ac3636c7d" -> (known after apply)
! content_sha512       = "a846cca0d84e7170abc945b049babb99b21ebdd1f8b258cfc1d2ce28c4338dfa919f55877f131248063279f8c501002cc12e9a73884123b76d2f43980f9884e5" -> (known after apply)
! id                   = "71234d1c9b37a23e1a98114ab5bddf4825ad749f" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
! content    = "epsilon after delta phase 1" -> "epsilon after delta phase 2"
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
-     zeta phase 1
+     zeta phase 2
      replace=5517f486-d950-f570-4fe7-baf2e9d46234
  EOT
! content_base64sha256 = "izgFOfb+ALsHjimHeoAKaJ4liss20/BQlpz9UGu2lb4=" -> (known after apply)
! content_base64sha512 = "eiTmd3TysK15MjjutJhexywwvqB6U0eAXSO8bQEVTJ6tQRZLien5lzQWEX82tpPEUztO36OMpDeGd+aNHiETKA==" -> (known after apply)
! content_md5          = "b8fbe940b4176b6f83f769110e81f186" -> (known after apply)
! content_sha1         = "0966ff8ef30bd769cf0cac1b4665084219a6052d" -> (known after apply)
! content_sha256       = "8b380539f6fe00bb078e29877a800a689e258acb36d3f050969cfd506bb695be" -> (known after apply)
! content_sha512       = "7a24e67774f2b0ad793238eeb4985ec72c30bea07a5347805d23bc6d01154c9ead41164b89e9f9973416117f36b693c4533b4edfa38ca4378677e68d1e211328" -> (known after apply)
! id                   = "0966ff8ef30bd769cf0cac1b4665084219a6052d" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
! content    = "zeta phase 1" -> "zeta phase 2"
```

</details>
