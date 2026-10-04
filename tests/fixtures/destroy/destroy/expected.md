<!-- terragrunt-run-report: Terragrunt run report -->
## Terragrunt run report

**Destroy: 6 units, 6 with changes.** 19 destroyed.

| Unit | Result | Add | Change | Destroy | Duration |
| --- | --- | ---: | ---: | ---: | ---: |
| [`.terragrunt-stack/alpha`](#user-content-trr-terragrunt-run-report-terragrunt-stack-alpha) | ✅ succeeded | 0 | 0 | 3 | 1s |
| [`.terragrunt-stack/beta`](#user-content-trr-terragrunt-run-report-terragrunt-stack-beta) | ✅ succeeded | 0 | 0 | 3 | 1s |
| [`.terragrunt-stack/delta`](#user-content-trr-terragrunt-run-report-terragrunt-stack-delta) | ✅ succeeded | 0 | 0 | 4 | 1s |
| [`.terragrunt-stack/epsilon`](#user-content-trr-terragrunt-run-report-terragrunt-stack-epsilon) | ✅ succeeded | 0 | 0 | 3 | 1s |
| [`.terragrunt-stack/gamma`](#user-content-trr-terragrunt-run-report-terragrunt-stack-gamma) | ✅ succeeded | 0 | 0 | 3 | 1s |
| [`.terragrunt-stack/zeta`](#user-content-trr-terragrunt-run-report-terragrunt-stack-zeta) | ✅ succeeded | 0 | 0 | 3 | 1s |

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

Destroy complete! Resources: 3 destroyed.

<details><summary>🗑️ Destroy (3)</summary>

<details><summary><code>local_file.main</code> ✅ 0s</summary>

```diff
- content              = <<-EOT
      alpha phase 3
      replace=b68c2447-59b9-7c85-e6d0-3cb03ec9ea3c
  EOT -> null
- content_base64sha256 = "5Qkq+2EWdv6AajurSPm7FueFkQi1hvtIsUZc0OzySS4=" -> null
- content_base64sha512 = "41IiqViNFePS4OUX2ufnSH6hTpre75lMhpG0B7M34bxAEeUYW7Z4nZIdLb6fSzsm+lAiyx4qcS+4W2+CWVfF2w==" -> null
- content_md5          = "519a957099107eb0a2d1f3d76b936a4f" -> null
- content_sha1         = "36c5d1d5709fba69ab8cec48cb89b44be338e756" -> null
- content_sha256       = "e5092afb611676fe806a3bab48f9bb16e7859108b586fb48b1465cd0ecf2492e" -> null
- content_sha512       = "e35222a9588d15e3d2e0e517dae7e7487ea14e9adeef994c8691b407b337e1bc4011e5185bb6789d921d2dbe9f4b3b26fa5022cb1e2a712fb85b6f825957c5db" -> null
- directory_permission = "0777" -> null
- file_permission      = "0777" -> null
- filename             = "./.out/alpha.txt" -> null
- id                   = "36c5d1d5709fba69ab8cec48cb89b44be338e756" -> null
```

</details>

<details><summary><code>terraform_data.main</code> ✅ 0s</summary>

```diff
- id     = "9c9aaa79-f9d8-8d91-ac64-62a58b8f2279" -> null
- input  = "alpha" -> null
- output = "alpha" -> null
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
- id               = "b68c2447-59b9-7c85-e6d0-3cb03ec9ea3c" -> null
- triggers_replace = "phase-3" -> null
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
- content    = "alpha phase 4" -> null
- name       = "alpha" -> null
- replace_id = "b68c2447-59b9-7c85-e6d0-3cb03ec9ea3c" -> null
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

Destroy complete! Resources: 3 destroyed.

<details><summary>🗑️ Destroy (3)</summary>

<details><summary><code>local_file.main</code> ✅ 0s</summary>

```diff
- content              = <<-EOT
      beta after alpha, phase 3
      replace=fd98a5eb-06ae-4bbd-958b-0ee57ac1e3c5
  EOT -> null
- content_base64sha256 = "2fUtc/GMQSDqGw8bLJLpoi8jP0AzTRYImoUl9qZgeGM=" -> null
- content_base64sha512 = "vk4Cvv8E3mHPZcs6hBQHptU6KXMC4MQ49RzrvHZ0RUzD+YJ0FbMBnlp26bE/NK+R7idX2gkbaY3E1xdf6ILBuA==" -> null
- content_md5          = "6b9c6f77f365b6d5f20771af77c3d528" -> null
- content_sha1         = "8a6260d5d8cbfb2581b0daf86ca424ca1dcddd32" -> null
- content_sha256       = "d9f52d73f18c4120ea1b0f1b2c92e9a22f233f40334d16089a8525f6a6607863" -> null
- content_sha512       = "be4e02beff04de61cf65cb3a841407a6d53a297302e0c438f51cebbc7674454cc3f9827415b3019e5a76e9b13f34af91ee2757da091b698dc4d7175fe882c1b8" -> null
- directory_permission = "0777" -> null
- file_permission      = "0777" -> null
- filename             = "./.out/beta.txt" -> null
- id                   = "8a6260d5d8cbfb2581b0daf86ca424ca1dcddd32" -> null
```

</details>

<details><summary><code>terraform_data.main</code> ✅ 0s</summary>

```diff
- id     = "4dae435a-6318-d88e-7cd1-d1ef61229531" -> null
- input  = "beta" -> null
- output = "beta" -> null
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
- id               = "fd98a5eb-06ae-4bbd-958b-0ee57ac1e3c5" -> null
- triggers_replace = "static" -> null
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
- content    = "beta after alpha, phase 4" -> null
- name       = "beta" -> null
- replace_id = "fd98a5eb-06ae-4bbd-958b-0ee57ac1e3c5" -> null
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

Destroy complete! Resources: 4 destroyed.

<details><summary>🗑️ Destroy (4)</summary>

<details><summary><code>local_file.main</code> ✅ 0s</summary>

```diff
- content              = <<-EOT
      delta phase 3
      replace=3b06cc70-90e0-1315-cb65-6d655943a066
  EOT -> null
- content_base64sha256 = "KvMM5OdKBuAEMJW5ZHlZICxQut3IaRqUjzHboImeWE8=" -> null
- content_base64sha512 = "0nh7teGGm3wULsnlSWNXZr3guDcmW3gd950c/Z9sKoLr3tdvZMyn1kBVjWpmGAcHXB17SslBuMYxGt5TLB3lkA==" -> null
- content_md5          = "929a2fb223b6bfbc39bdc34883e9f582" -> null
- content_sha1         = "f02abb18409206252cbf943a113f9540900bec81" -> null
- content_sha256       = "2af30ce4e74a06e0043095b9647959202c50baddc8691a948f31dba0899e584f" -> null
- content_sha512       = "d2787bb5e1869b7c142ec9e549635766bde0b837265b781df79d1cfd9f6c2a82ebded76f64cca7d640558d6a661807075c1d7b4ac941b8c6311ade532c1de590" -> null
- directory_permission = "0777" -> null
- file_permission      = "0777" -> null
- filename             = "./.out/delta.txt" -> null
- id                   = "f02abb18409206252cbf943a113f9540900bec81" -> null
```

</details>

<details><summary><code>terraform_data.fail[0]</code> ✅ 0s</summary>

```diff
- id     = "49eaa866-edb6-ef4e-a596-f60df7ee79a8" -> null
- input  = "delta phase 3" -> null
- output = "delta phase 3" -> null
```

</details>

<details><summary><code>terraform_data.main</code> ✅ 0s</summary>

```diff
- id     = "05243a11-0ebe-cab9-df34-2dbe7be5b1ea" -> null
- input  = "delta" -> null
- output = "delta" -> null
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
- id               = "3b06cc70-90e0-1315-cb65-6d655943a066" -> null
- triggers_replace = "static" -> null
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
- content    = "delta phase 4" -> null
- name       = "delta" -> null
- replace_id = "3b06cc70-90e0-1315-cb65-6d655943a066" -> null
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

Destroy complete! Resources: 3 destroyed.

<details><summary>🗑️ Destroy (3)</summary>

<details><summary><code>local_file.main</code> ✅ 0s</summary>

```diff
- content              = <<-EOT
      epsilon after delta phase 2
      replace=40965365-3405-9aee-fa76-9cf8656a70a7
  EOT -> null
- content_base64sha256 = "Wi9K3f9ewdRODLav7ecgBJs4UwLmB3UgEigeESnjQNU=" -> null
- content_base64sha512 = "ZajgvyP33NL4h/uMDra9+eaitBjnQFqoMiHt+FexiCgGr09GcwdPwwlnWmOPM3YEvLZARJYEouiHSuNJ+2sK6A==" -> null
- content_md5          = "e7148d7a6f177aca18408063162be76e" -> null
- content_sha1         = "e74ad60d02d3d2c2ffd56efad4e0322d8e6ba063" -> null
- content_sha256       = "5a2f4addff5ec1d44e0cb6afede720049b385302e607752012281e1129e340d5" -> null
- content_sha512       = "65a8e0bf23f7dcd2f887fb8c0eb6bdf9e6a2b418e7405aa83221edf857b1882806af4f4673074fc309675a638f337604bcb640449604a2e8874ae349fb6b0ae8" -> null
- directory_permission = "0777" -> null
- file_permission      = "0777" -> null
- filename             = "./.out/epsilon.txt" -> null
- id                   = "e74ad60d02d3d2c2ffd56efad4e0322d8e6ba063" -> null
```

</details>

<details><summary><code>terraform_data.main</code> ✅ 0s</summary>

```diff
- id     = "40dcc44c-1831-8aea-7ccf-b6efb0b0f1ee" -> null
- input  = "epsilon" -> null
- output = "epsilon" -> null
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
- id               = "40965365-3405-9aee-fa76-9cf8656a70a7" -> null
- triggers_replace = "static" -> null
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
- content    = "epsilon after delta phase 3" -> null
- name       = "epsilon" -> null
- replace_id = "40965365-3405-9aee-fa76-9cf8656a70a7" -> null
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

Destroy complete! Resources: 3 destroyed.

<details><summary>🗑️ Destroy (3)</summary>

<details><summary><code>local_file.main</code> ✅ 0s</summary>

```diff
- content              = <<-EOT
      gamma never changes
      replace=18b20350-9159-2b97-ded8-57b84577f3f2
  EOT -> null
- content_base64sha256 = "LiRzbUWQl38eUd8FFviW9BeIJfxAwSEMUY5jKH9T8yE=" -> null
- content_base64sha512 = "vIU4mirbIeN6iug0rgFH2nBk4L9bh1M7bLCK6ymbF52Xu9xrzQKj2PDazIf6Fi2a8pabgA40PRKs1hyS1jYr5Q==" -> null
- content_md5          = "298727b69444d2f230c384cba67d71cd" -> null
- content_sha1         = "57d1406c28bdc836fa58afb84263ba98356fdd72" -> null
- content_sha256       = "2e24736d4590977f1e51df0516f896f4178825fc40c1210c518e63287f53f321" -> null
- content_sha512       = "bc85389a2adb21e37a8ae834ae0147da7064e0bf5b87533b6cb08aeb299b179d97bbdc6bcd02a3d8f0dacc87fa162d9af2969b800e343d12acd61c92d6362be5" -> null
- directory_permission = "0777" -> null
- file_permission      = "0777" -> null
- filename             = "./.out/gamma.txt" -> null
- id                   = "57d1406c28bdc836fa58afb84263ba98356fdd72" -> null
```

</details>

<details><summary><code>terraform_data.main</code> ✅ 0s</summary>

```diff
- id     = "ed9527cd-f658-835b-64b7-f7ddd87e8d7b" -> null
- input  = "gamma" -> null
- output = "gamma" -> null
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
- id               = "18b20350-9159-2b97-ded8-57b84577f3f2" -> null
- triggers_replace = "static" -> null
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
- content    = "gamma never changes" -> null
- name       = "gamma" -> null
- replace_id = "18b20350-9159-2b97-ded8-57b84577f3f2" -> null
```

</details>

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

Destroy complete! Resources: 3 destroyed.

<details><summary>🗑️ Destroy (3)</summary>

<details><summary><code>local_file.main</code> ✅ 0s</summary>

```diff
- content              = <<-EOT
      zeta phase 2
      replace=5517f486-d950-f570-4fe7-baf2e9d46234
  EOT -> null
- content_base64sha256 = "RSOG4UP26gkIoEaJr6WZDp817+wL/lucFydOwDmOmM0=" -> null
- content_base64sha512 = "EXs7QupP6N8ZgMwPOQBfkIUBRMmMcLFkh1uVItqqR4EwDRDB1oVBqgPyp3i77ifIv6UjF2GEUgHlDqOJEO92oA==" -> null
- content_md5          = "7a9cdee3dacd3635d6df6ae653340e2d" -> null
- content_sha1         = "95198e5fb6c7a6d29cec70f09c1c8828df325fe8" -> null
- content_sha256       = "452386e143f6ea0908a04689afa5990e9f35efec0bfe5b9c17274ec0398e98cd" -> null
- content_sha512       = "117b3b42ea4fe8df1980cc0f39005f90850144c98c70b164875b9522daaa4781300d10c1d68541aa03f2a778bbee27c8bfa5231761845201e50ea38910ef76a0" -> null
- directory_permission = "0777" -> null
- file_permission      = "0777" -> null
- filename             = "./.out/zeta.txt" -> null
- id                   = "95198e5fb6c7a6d29cec70f09c1c8828df325fe8" -> null
```

</details>

<details><summary><code>terraform_data.main</code> ✅ 0s</summary>

```diff
- id     = "c1857bf7-4480-e5b4-d627-33735976f0ac" -> null
- input  = "zeta" -> null
- output = "zeta" -> null
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
- id               = "5517f486-d950-f570-4fe7-baf2e9d46234" -> null
- triggers_replace = "static" -> null
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
- content    = "zeta phase 4" -> null
- name       = "zeta" -> null
- replace_id = "5517f486-d950-f570-4fe7-baf2e9d46234" -> null
```

</details>
