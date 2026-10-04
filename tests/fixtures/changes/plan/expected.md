<!-- terragrunt-run-report: Terragrunt run report -->
## Terragrunt run report

**Plan: 6 units, 4 with changes, 2 unchanged.** 6 to add, 0 to change, 6 to destroy. ⚠️ 18 warnings in 6 units.

| Unit | Result | Add | Change | Destroy | Duration |
| --- | --- | ---: | ---: | ---: | ---: |
| [`.terragrunt-stack/alpha`](#user-content-trr-terragrunt-run-report-terragrunt-stack-alpha) | ✅ succeeded | 3 | 0 | 2 | 1s |
| [`.terragrunt-stack/beta`](#user-content-trr-terragrunt-run-report-terragrunt-stack-beta) | ✅ succeeded | 1 | 0 | 2 | 1s |
| [`.terragrunt-stack/delta`](#user-content-trr-terragrunt-run-report-terragrunt-stack-delta) | ✅ succeeded | 1 | 0 | 1 | 1s |
| [`.terragrunt-stack/epsilon`](#user-content-trr-terragrunt-run-report-terragrunt-stack-epsilon) | ✅ no changes | 0 | 0 | 0 | 1s |
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

Plan: 3 to add, 0 to change, 2 to destroy.

<details><summary>✨ Create (1)</summary>

<details><summary><code>local_file.extra[0]</code></summary>

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

<details><summary><code>local_file.main</code></summary>

```diff
! content              = <<-EOT # forces replacement
      alpha phase 1
      replace=8ecce4d8-5014-09f3-fdaf-bb93a9df3581
  EOT -> (known after apply) # forces replacement
! content_base64sha256 = "SlplaLKQD//YtUur9L5yd1un+B3SC3J+BI3MjAufHxo=" -> (known after apply)
! content_base64sha512 = "Kzt6a+ABVifa7ZUShn9Modn6VdXXioGmOzg5gPD4uufgKyzB9AlrycQU8hCrJS6o68BcoRq3a5MRIc7nFWxl6w==" -> (known after apply)
! content_md5          = "acdff416ee705e7afaa76c8eb3d0d50e" -> (known after apply)
! content_sha1         = "a6a65a88e6e4b84683ee8909d401062123c39ead" -> (known after apply)
! content_sha256       = "4a5a6568b2900fffd8b54babf4be72775ba7f81dd20b727e048dcc8c0b9f1f1a" -> (known after apply)
! content_sha512       = "2b3b7a6be0015627daed9512867f4ca1d9fa55d5d78a81a63b383980f0f8bae7e02b2cc1f4096bc9c414f210ab252ea8ebc05ca11ab76b931121cee7156c65eb" -> (known after apply)
! id                   = "a6a65a88e6e4b84683ee8909d401062123c39ead" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

<details><summary><code>terraform_data.replace</code></summary>

```diff
! id               = "8ecce4d8-5014-09f3-fdaf-bb93a9df3581" -> (known after apply)
! triggers_replace = "phase-1" -> "phase-2"
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
! content    = "alpha phase 1" -> "alpha phase 2"
! replace_id = "8ecce4d8-5014-09f3-fdaf-bb93a9df3581" -> (known after apply)
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

Plan: 1 to add, 0 to change, 2 to destroy.

<details><summary>⚙️ Replace (1)</summary>

<details><summary><code>local_file.main</code></summary>

```diff
! content              = <<-EOT # forces replacement
-     beta after alpha, phase 1
+     beta after alpha, phase 2
      replace=6e9cb995-1623-16cd-b6e5-00d1988e8976
  EOT
! content_base64sha256 = "/nhmx0rIFIFKlKZbhmv4jPOEObZ/Tp2iveMob7VzkxM=" -> (known after apply)
! content_base64sha512 = "mVinjxW/tW5LxV8QMNDllQkq093Ta0zov6MEw1pQoug6VnsIUxV4bXulzMm88j6Z6avD5VpRFfiHcLyZ8wLkFA==" -> (known after apply)
! content_md5          = "c5a477110ebeb8c060a10ad2b52f2392" -> (known after apply)
! content_sha1         = "399b2d2406b8ee101d958f0134e1bec0c9ca7586" -> (known after apply)
! content_sha256       = "fe7866c74ac814814a94a65b866bf88cf38439b67f4e9da2bde3286fb5739313" -> (known after apply)
! content_sha512       = "9958a78f15bfb56e4bc55f1030d0e595092ad3ddd36b4ce8bfa304c35a50a2e83a567b085315786d7ba5ccc9bcf23e99e9abc3e55a5115f88770bc99f302e414" -> (known after apply)
! id                   = "399b2d2406b8ee101d958f0134e1bec0c9ca7586" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

</details>

<details><summary>🗑️ Destroy (1)</summary>

<details><summary><code>local_file.extra[0]</code></summary>

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

Plan: 1 to add, 0 to change, 1 to destroy.

<details><summary>⚙️ Replace (1)</summary>

<details><summary><code>local_file.main</code></summary>

```diff
! content              = <<-EOT # forces replacement
-     delta phase 1
+     delta phase 2
      replace=ccd28744-083a-c82c-3da0-710f1799fd0c
  EOT
! content_base64sha256 = "d3OBE9d/dLtKFkc0Yu3xyEaQXgjCahshd4ZzzmzK1X8=" -> (known after apply)
! content_base64sha512 = "HovwVuT/RBArbjgA1oHIqJ5whWPAy9EI7jdjKhJTIS5UU9UnaqHslDSX8L8cN0vCgukqKwcT8AxJxgvdmFynHg==" -> (known after apply)
! content_md5          = "4fec4e75f1ec460854d56fbc0eaef6fa" -> (known after apply)
! content_sha1         = "2144adfeb99000a13597aa7d5f9d7a0c565d8f34" -> (known after apply)
! content_sha256       = "77738113d77f74bb4a16473462edf1c846905e08c26a1b21778673ce6ccad57f" -> (known after apply)
! content_sha512       = "1e8bf056e4ff44102b6e3800d681c8a89e708563c0cbd108ee37632a1253212e5453d5276aa1ec943497f0bf1c374bc282e92a2b0713f00c49c60bdd985ca71e" -> (known after apply)
! id                   = "2144adfeb99000a13597aa7d5f9d7a0c565d8f34" -> (known after apply)
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
-     zeta phase 1
+     zeta phase 2
      replace=2b99c17b-4ce0-effd-d4d1-13fcbb5dd989
  EOT
! content_base64sha256 = "yMb+OrjhqD5kUSbM/lnTW2qA5bP93cXNPfGJ81R/SeM=" -> (known after apply)
! content_base64sha512 = "yJwDjc/Qquopnr2ejjDbuu3oE2DIpYYrWx4uE7wPa2gK92LbFjvZyFQwjKKQmknrfpqrQwftTmcJBMyMVqnISQ==" -> (known after apply)
! content_md5          = "e5b5511a7f0b793c0fecc714ad8f6fe4" -> (known after apply)
! content_sha1         = "d36bd7274beea695f3cc53487116fdc6bc9e3883" -> (known after apply)
! content_sha256       = "c8c6fe3ab8e1a83e645126ccfe59d35b6a80e5b3fdddc5cd3df189f3547f49e3" -> (known after apply)
! content_sha512       = "c89c038dcfd0aaea299ebd9e8e30dbbaede81360c8a5862b5b1e2e13bc0f6b680af762db163bd9c854308ca2909a49eb7e9aab4307ed4e670904cc8c56a9c849" -> (known after apply)
! id                   = "d36bd7274beea695f3cc53487116fdc6bc9e3883" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
! content    = "zeta phase 1" -> "zeta phase 2"
```

</details>
