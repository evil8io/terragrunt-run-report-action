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
      replace=0fb34389-cd0c-c715-696c-760d85aa5b8f
  EOT -> (known after apply) # forces replacement
! content_base64sha256 = "co7s6M4KGun83wAQuW8cdQIp6c49WmcPlLv8NaZSKgQ=" -> (known after apply)
! content_base64sha512 = "wp4SuuY2U347RKz69Go5S5whOMEElrMlLYHZSQo5Z//2sboqQmN5UKRkWq9g5b7TvBtuKYNl45CADbgisQEwGg==" -> (known after apply)
! content_md5          = "c9be7c1f18efee78e19d12c9ace70535" -> (known after apply)
! content_sha1         = "bba6724c54fe11dc44083ceef45ef566a7874d67" -> (known after apply)
! content_sha256       = "728eece8ce0a1ae9fcdf0010b96f1c750229e9ce3d5a670f94bbfc35a6522a04" -> (known after apply)
! content_sha512       = "c29e12bae636537e3b44acfaf46a394b9c2138c10496b3252d81d9490a3967fff6b1ba2a42637950a4645aaf60e5bed3bc1b6e298365e390800db822b101301a" -> (known after apply)
! id                   = "bba6724c54fe11dc44083ceef45ef566a7874d67" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
! id               = "0fb34389-cd0c-c715-696c-760d85aa5b8f" -> (known after apply)
! triggers_replace = "phase-1" -> "phase-2"
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
! content    = "alpha phase 1" -> "alpha phase 2"
! replace_id = "0fb34389-cd0c-c715-696c-760d85aa5b8f" -> (known after apply)
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
      replace=222bc366-78c8-8d40-e1fc-9d75149fdda4
  EOT
! content_base64sha256 = "BOCuQ8KNZ9lszxXvMPJNoX8dBPDpB8+401A2tVRjJ9I=" -> (known after apply)
! content_base64sha512 = "P6Qo7buRnRAAwd3p0xvY2xunxB2THcjh87wgrKiClA4Z+QCjySfnq7tv8RoPz8d+zxyiiQBTqBmU8Z+UV83chw==" -> (known after apply)
! content_md5          = "4986fd8d8b64fb8d7775039cd3f9c9e2" -> (known after apply)
! content_sha1         = "efadb5dfce91de9ef6c3452da6de329eb4971207" -> (known after apply)
! content_sha256       = "04e0ae43c28d67d96ccf15ef30f24da17f1d04f0e907cfb8d35036b5546327d2" -> (known after apply)
! content_sha512       = "3fa428edbb919d1000c1dde9d31bd8db1ba7c41d931dc8e1f3bc20aca882940e19f900a3c927e7abbb6ff11a0fcfc77ecf1ca2890053a81994f19f9457cddc87" -> (known after apply)
! id                   = "efadb5dfce91de9ef6c3452da6de329eb4971207" -> (known after apply)
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
      replace=cc2139ed-cbb2-43ec-70a3-cc4e7818d531
  EOT
! content_base64sha256 = "H7FiL7qGnGK0NQyFOk9UG4T+yvnCvH8mCX/GakWbnBE=" -> (known after apply)
! content_base64sha512 = "i4o1Zcg3v+ZY2ouwBgMOlB6AQLnuALYIIxs1SvES14rPxpDzkmPmqixF0qfOIUbAtpV8U1XwHSgwX7vSI0GWmg==" -> (known after apply)
! content_md5          = "f30d9638701c652a0cc751b359c94743" -> (known after apply)
! content_sha1         = "4953dcbc03464ac5a6c98f4ee4f431f7771af30f" -> (known after apply)
! content_sha256       = "1fb1622fba869c62b4350c853a4f541b84fecaf9c2bc7f26097fc66a459b9c11" -> (known after apply)
! content_sha512       = "8b8a3565c837bfe658da8bb006030e941e8040b9ee00b608231b354af112d78acfc690f39263e6aa2c45d2a7ce2146c0b6957c5355f01d28305fbbd22341969a" -> (known after apply)
! id                   = "4953dcbc03464ac5a6c98f4ee4f431f7771af30f" -> (known after apply)
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
      replace=f7304e6c-b6a5-e318-a0aa-0758ad265d6f
  EOT
! content_base64sha256 = "+Dv+y86bB5gJEOa84c13cKFnhmTYnQcOAfFEMqhCvJs=" -> (known after apply)
! content_base64sha512 = "wCoSnwWG/F0I0WaCagY1R+QmcJhwfBS0XofejUoSmoK4MgFEZcfNZAAHZ9/WXMWK+YkjasK8ISCjF5jQc7ng2g==" -> (known after apply)
! content_md5          = "f68766e18acc2149bb0c1b3663c4ad0f" -> (known after apply)
! content_sha1         = "6ce3b59c194dd9edc80e43b1cb73a3fba301f227" -> (known after apply)
! content_sha256       = "f83bfecbce9b07980910e6bce1cd7770a1678664d89d070e01f14432a842bc9b" -> (known after apply)
! content_sha512       = "c02a129f0586fc5d08d166826a063547e4267098707c14b45e87de8d4a129a82b832014465c7cd64000767dfd65cc58af989236ac2bc2120a31798d073b9e0da" -> (known after apply)
! id                   = "6ce3b59c194dd9edc80e43b1cb73a3fba301f227" -> (known after apply)
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
      replace=b6792be6-cb6c-02f5-97fc-fafee462bd4e
  EOT
! content_base64sha256 = "lAg4qRukO8vEft82mrOGw+Fc+gBTtb3+CFqDlGvzGUk=" -> (known after apply)
! content_base64sha512 = "IL8PtSLUy0AXbmBNRpwy7RIIF7/wjR51KTL5JDPskn4WqGVY/J1m0FVr2V31/VWYKTBdAxkZgMTigfdHt+4kQg==" -> (known after apply)
! content_md5          = "00591b601620eec614308b738bbbb1f5" -> (known after apply)
! content_sha1         = "39474f7f2386413e60bc9000d0b5d30f80f62c7d" -> (known after apply)
! content_sha256       = "940838a91ba43bcbc47edf369ab386c3e15cfa0053b5bdfe085a83946bf31949" -> (known after apply)
! content_sha512       = "20bf0fb522d4cb40176e604d469c32ed120817bff08d1e752932f92433ec927e16a86558fc9d66d0556bd95df5fd559829305d03191980c4e281f747b7ee2442" -> (known after apply)
! id                   = "39474f7f2386413e60bc9000d0b5d30f80f62c7d" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
! content    = "zeta phase 1" -> "zeta phase 2"
```

</details>
