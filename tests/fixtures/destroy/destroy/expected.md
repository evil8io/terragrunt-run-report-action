<!-- terragrunt-run-report: Terragrunt run report -->
## Terragrunt run report

**Destroy: 6 units, 6 with changes.** 19 destroyed. ⚠️ 18 warnings in 6 units.

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
      replace=994c2683-35e7-a6b2-7d77-e0a4b7f6d0a8
  EOT -> null
- content_base64sha256 = "U0FoZMqEzezkAlr/ySGT66DPctEVJP4rZXw5r40t2fU=" -> null
- content_base64sha512 = "3rz3UHU3f79gpSOXUDirzu2ACg0UDFwL2R++8ojC4/qdVdx0JlpHLTHddLkvWq7uFvBfMiBWzeVhHkqrmRsYcw==" -> null
- content_md5          = "170b37a13dd4f96106cae89117ffd5d4" -> null
- content_sha1         = "f11bd3aae07383ccab6460659463001b0cdd409f" -> null
- content_sha256       = "53416864ca84cdece4025affc92193eba0cf72d11524fe2b657c39af8d2dd9f5" -> null
- content_sha512       = "debcf75075377fbf60a523975038abceed800a0d140c5c0bd91fbef288c2e3fa9d55dc74265a472d31dd74b92f5aaeee16f05f322056cde5611e4aab991b1873" -> null
- directory_permission = "0777" -> null
- file_permission      = "0777" -> null
- filename             = "./.out/alpha.txt" -> null
- id                   = "f11bd3aae07383ccab6460659463001b0cdd409f" -> null
```

</details>

<details><summary><code>terraform_data.main</code> ✅ 0s</summary>

```diff
- id     = "bc404fdd-637f-485e-5631-825a86e813f0" -> null
- input  = "alpha" -> null
- output = "alpha" -> null
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
- id               = "994c2683-35e7-a6b2-7d77-e0a4b7f6d0a8" -> null
- triggers_replace = "phase-3" -> null
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
- content    = "alpha phase 4" -> null
- name       = "alpha" -> null
- replace_id = "994c2683-35e7-a6b2-7d77-e0a4b7f6d0a8" -> null
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
      replace=222bc366-78c8-8d40-e1fc-9d75149fdda4
  EOT -> null
- content_base64sha256 = "IYUTQ+19ztbrcqQyL0HecaUGjToizmmWIjimDzMHS8Q=" -> null
- content_base64sha512 = "fm8gspID8PghqUuIqySBq5ZkGkMrX1edLfqzw8Yef23xK/IZ03BSc90bbuUMZB0Af/6Qq84r9AR/aF1YMjGxjA==" -> null
- content_md5          = "fd17af647840f6a5ed1c6a552951324c" -> null
- content_sha1         = "3549e8ec79d2756890b833c344558f5902c746ef" -> null
- content_sha256       = "21851343ed7dced6eb72a4322f41de71a5068d3a22ce69962238a60f33074bc4" -> null
- content_sha512       = "7e6f20b29203f0f821a94b88ab2481ab96641a432b5f579d2dfab3c3c61e7f6df12bf219d3705273dd1b6ee50c641d007ffe90abce2bf4047f685d583231b18c" -> null
- directory_permission = "0777" -> null
- file_permission      = "0777" -> null
- filename             = "./.out/beta.txt" -> null
- id                   = "3549e8ec79d2756890b833c344558f5902c746ef" -> null
```

</details>

<details><summary><code>terraform_data.main</code> ✅ 0s</summary>

```diff
- id     = "eef04383-c85d-da03-5021-29fc6e6e7eee" -> null
- input  = "beta" -> null
- output = "beta" -> null
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
- id               = "222bc366-78c8-8d40-e1fc-9d75149fdda4" -> null
- triggers_replace = "static" -> null
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
- content    = "beta after alpha, phase 4" -> null
- name       = "beta" -> null
- replace_id = "222bc366-78c8-8d40-e1fc-9d75149fdda4" -> null
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
      replace=cc2139ed-cbb2-43ec-70a3-cc4e7818d531
  EOT -> null
- content_base64sha256 = "J9/YcIzH9uXE9qq3v1wfRfzH1s7WmKGuN3ZdvH23y4U=" -> null
- content_base64sha512 = "cVnuNhs2eHcXdAaTQtprRFqUtzASksFmcSIAsufydqDKYGY5bd02irDO2GUSyLkdCr73dbXuL8n9SXrLXvncgg==" -> null
- content_md5          = "e58b0b963390e8d9741ee2f94825336d" -> null
- content_sha1         = "a509092112fc041e0f5d96fcdea682b7424a4654" -> null
- content_sha256       = "27dfd8708cc7f6e5c4f6aab7bf5c1f45fcc7d6ced698a1ae37765dbc7db7cb85" -> null
- content_sha512       = "7159ee361b3678771774069342da6b445a94b7301292c166712200b2e7f276a0ca6066396ddd368ab0ced86512c8b91d0abef775b5ee2fc9fd497acb5ef9dc82" -> null
- directory_permission = "0777" -> null
- file_permission      = "0777" -> null
- filename             = "./.out/delta.txt" -> null
- id                   = "a509092112fc041e0f5d96fcdea682b7424a4654" -> null
```

</details>

<details><summary><code>terraform_data.fail[0]</code> ✅ 0s</summary>

```diff
- id     = "1823b392-c700-4ee7-9832-94932ac352e2" -> null
- input  = "delta phase 3" -> null
- output = "delta phase 3" -> null
```

</details>

<details><summary><code>terraform_data.main</code> ✅ 0s</summary>

```diff
- id     = "74a321ec-e82d-67f5-0e93-a56b0679f599" -> null
- input  = "delta" -> null
- output = "delta" -> null
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
- id               = "cc2139ed-cbb2-43ec-70a3-cc4e7818d531" -> null
- triggers_replace = "static" -> null
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
- content    = "delta phase 4" -> null
- name       = "delta" -> null
- replace_id = "cc2139ed-cbb2-43ec-70a3-cc4e7818d531" -> null
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
      replace=f7304e6c-b6a5-e318-a0aa-0758ad265d6f
  EOT -> null
- content_base64sha256 = "WGrCzKZpn/wtvXJVML103gBFhJ1b2Zn9q/sqeRDizFM=" -> null
- content_base64sha512 = "VfjhGPxRVeZje2GFfN2nT/Q3fcQfUUZAK5NbuajzYeFArTbJT4dQmGOlcOlHwpZtwmMOhUyP4V8rDoNf9sPdKQ==" -> null
- content_md5          = "abc6ccd7d6062e4e2f306c2dfbd662f7" -> null
- content_sha1         = "42a4fbf3d368a485a209899086c4c176c6def202" -> null
- content_sha256       = "586ac2cca6699ffc2dbd725530bd74de0045849d5bd999fdabfb2a7910e2cc53" -> null
- content_sha512       = "55f8e118fc5155e6637b61857cdda74ff4377dc41f5146402b935bb9a8f361e140ad36c94f87509863a570e947c2966dc2630e854c8fe15f2b0e835ff6c3dd29" -> null
- directory_permission = "0777" -> null
- file_permission      = "0777" -> null
- filename             = "./.out/epsilon.txt" -> null
- id                   = "42a4fbf3d368a485a209899086c4c176c6def202" -> null
```

</details>

<details><summary><code>terraform_data.main</code> ✅ 0s</summary>

```diff
- id     = "42b9555a-909b-efc7-29aa-5fe311dadd51" -> null
- input  = "epsilon" -> null
- output = "epsilon" -> null
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
- id               = "f7304e6c-b6a5-e318-a0aa-0758ad265d6f" -> null
- triggers_replace = "static" -> null
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
- content    = "epsilon after delta phase 3" -> null
- name       = "epsilon" -> null
- replace_id = "f7304e6c-b6a5-e318-a0aa-0758ad265d6f" -> null
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
      replace=f01a5c41-bec6-b0e2-8359-1577883f9dc6
  EOT -> null
- content_base64sha256 = "fnrbCJvmW+EknrJM3ajmk3o+QrGSn/XrwZWHeDCp5ms=" -> null
- content_base64sha512 = "z7I+YjvQds6xsRyNU0cxEv2yTmuTuZ4eDRHWqoIaKVpWD7lpmFul9hDJ3Fob2DVY7yiYYs4ydkJBl9GTptL20Q==" -> null
- content_md5          = "f1f43f19d859b88eb3a5c52511e24044" -> null
- content_sha1         = "94b1860d48d140c25387a58f431874eed2d648bd" -> null
- content_sha256       = "7e7adb089be65be1249eb24cdda8e6937a3e42b1929ff5ebc195877830a9e66b" -> null
- content_sha512       = "cfb23e623bd076ceb1b11c8d53473112fdb24e6b93b99e1e0d11d6aa821a295a560fb969985ba5f610c9dc5a1bd83558ef289862ce3276424197d193a6d2f6d1" -> null
- directory_permission = "0777" -> null
- file_permission      = "0777" -> null
- filename             = "./.out/gamma.txt" -> null
- id                   = "94b1860d48d140c25387a58f431874eed2d648bd" -> null
```

</details>

<details><summary><code>terraform_data.main</code> ✅ 0s</summary>

```diff
- id     = "43d388c4-73e0-c26e-df96-e8dc2cb6163d" -> null
- input  = "gamma" -> null
- output = "gamma" -> null
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
- id               = "f01a5c41-bec6-b0e2-8359-1577883f9dc6" -> null
- triggers_replace = "static" -> null
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
- content    = "gamma never changes" -> null
- name       = "gamma" -> null
- replace_id = "f01a5c41-bec6-b0e2-8359-1577883f9dc6" -> null
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
      replace=b6792be6-cb6c-02f5-97fc-fafee462bd4e
  EOT -> null
- content_base64sha256 = "X0P4Rd40glmQ89+t7Rsqfe2bXD7Sf9+Bd04krqat9Xg=" -> null
- content_base64sha512 = "JGtYy5fw5Awtqt00TLxHNZ12y8oYhKywZpNGZnk5WeSuv2EtrB6a0oFEuve0D+K5VcU0qu/3vJ/Y9z6+dVmXVA==" -> null
- content_md5          = "1a9de9f413b0c0aa7fc8fe60ff373676" -> null
- content_sha1         = "49a320281df1a3d89830fa4a50f776c15103cf39" -> null
- content_sha256       = "5f43f845de34825990f3dfaded1b2a7ded9b5c3ed27fdf81774e24aea6adf578" -> null
- content_sha512       = "246b58cb97f0e40c2daadd344cbc47359d76cbca1884acb066934666793959e4aebf612dac1e9ad28144baf7b40fe2b955c534aaeff7bc9fd8f73ebe75599754" -> null
- directory_permission = "0777" -> null
- file_permission      = "0777" -> null
- filename             = "./.out/zeta.txt" -> null
- id                   = "49a320281df1a3d89830fa4a50f776c15103cf39" -> null
```

</details>

<details><summary><code>terraform_data.main</code> ✅ 0s</summary>

```diff
- id     = "6a3c53ee-8bba-9b57-eab6-06aa806e3a6b" -> null
- input  = "zeta" -> null
- output = "zeta" -> null
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
- id               = "b6792be6-cb6c-02f5-97fc-fafee462bd4e" -> null
- triggers_replace = "static" -> null
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
- content    = "zeta phase 4" -> null
- name       = "zeta" -> null
- replace_id = "b6792be6-cb6c-02f5-97fc-fafee462bd4e" -> null
```

</details>
