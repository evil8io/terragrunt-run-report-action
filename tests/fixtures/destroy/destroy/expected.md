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

Destroy complete! Resources: 3 destroyed.

<details><summary>🗑️ Destroy (3)</summary>

<details><summary><code>local_file.main</code> ✅ 0s</summary>

```diff
- content              = <<-EOT
      alpha phase 3
      replace=d2495e4d-6395-48d8-7c9c-b2ad217fdef8
  EOT -> null
- content_base64sha256 = "Gpbiuq6qCFHvUvzhbwOSmHRIQcTHXH9Oyk7dljygycY=" -> null
- content_base64sha512 = "9nemUJtnBf55JpLpOlaLQ5azZ3RZFGijJOZEVLkbHoSquOEUluToh6+FcNhb02O6+UldzHN9rzFl76G+NRQukA==" -> null
- content_md5          = "73b777f9de105608ff0a59f5a29be416" -> null
- content_sha1         = "ce53976c7e47c09d64799fe7d8e7fcb73740c977" -> null
- content_sha256       = "1a96e2baaeaa0851ef52fce16f039298744841c4c75c7f4eca4edd963ca0c9c6" -> null
- content_sha512       = "f677a6509b6705fe792692e93a568b4396b36774591468a324e64454b91b1e84aab8e11496e4e887af8570d85bd363baf9495dcc737daf3165efa1be35142e90" -> null
- directory_permission = "0777" -> null
- file_permission      = "0777" -> null
- filename             = "./.out/alpha.txt" -> null
- id                   = "ce53976c7e47c09d64799fe7d8e7fcb73740c977" -> null
```

</details>

<details><summary><code>terraform_data.main</code> ✅ 0s</summary>

```diff
- id     = "9694eb37-d060-7f99-3613-dc921fdef9ef" -> null
- input  = "alpha" -> null
- output = "alpha" -> null
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
- id               = "d2495e4d-6395-48d8-7c9c-b2ad217fdef8" -> null
- triggers_replace = "phase-3" -> null
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
- content    = "alpha phase 4" -> null
- name       = "alpha" -> null
- replace_id = "d2495e4d-6395-48d8-7c9c-b2ad217fdef8" -> null
```

</details>

### <a id="trr-terragrunt-run-report-terragrunt-stack-beta"></a>`.terragrunt-stack/beta`

Destroy complete! Resources: 3 destroyed.

<details><summary>🗑️ Destroy (3)</summary>

<details><summary><code>local_file.main</code> ✅ 0s</summary>

```diff
- content              = <<-EOT
      beta after alpha, phase 3
      replace=cf9913bd-f4ea-b114-d981-134a726b7324
  EOT -> null
- content_base64sha256 = "4pqOPpalpEmJc9+Uaor75EbJxwTO+JmF/oBF1hnOE98=" -> null
- content_base64sha512 = "ai5QIsLuZtLUwG+0FwJuVlUKyx2BCg8EkzvidcSrSrPUZukxZQlZRb/XA7OGomC9YlBzv0yvtMZGjp2L1Gfg/g==" -> null
- content_md5          = "9074212c5ca190e17da11ca50a7bd5b0" -> null
- content_sha1         = "e5630073bfa1690ed4bc8c881851d5e95936ebc8" -> null
- content_sha256       = "e29a8e3e96a5a4498973df946a8afbe446c9c704cef89985fe8045d619ce13df" -> null
- content_sha512       = "6a2e5022c2ee66d2d4c06fb417026e56550acb1d810a0f04933be275c4ab4ab3d466e93165095945bfd703b386a260bd625073bf4cafb4c6468e9d8bd467e0fe" -> null
- directory_permission = "0777" -> null
- file_permission      = "0777" -> null
- filename             = "./.out/beta.txt" -> null
- id                   = "e5630073bfa1690ed4bc8c881851d5e95936ebc8" -> null
```

</details>

<details><summary><code>terraform_data.main</code> ✅ 0s</summary>

```diff
- id     = "0c11cbf8-d923-8083-8037-c21cb0f392c4" -> null
- input  = "beta" -> null
- output = "beta" -> null
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
- id               = "cf9913bd-f4ea-b114-d981-134a726b7324" -> null
- triggers_replace = "static" -> null
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
- content    = "beta after alpha, phase 4" -> null
- name       = "beta" -> null
- replace_id = "cf9913bd-f4ea-b114-d981-134a726b7324" -> null
```

</details>

### <a id="trr-terragrunt-run-report-terragrunt-stack-delta"></a>`.terragrunt-stack/delta`

Destroy complete! Resources: 4 destroyed.

<details><summary>🗑️ Destroy (4)</summary>

<details><summary><code>local_file.main</code> ✅ 0s</summary>

```diff
- content              = <<-EOT
      delta phase 3
      replace=f9371617-775d-ad7e-d166-004f689977c6
  EOT -> null
- content_base64sha256 = "1WEaNAHpLnJ70SkFDQQ9aYVDk0JbMxbaL3cnJosG32Y=" -> null
- content_base64sha512 = "uzHN56s16/yfZJ/5d809AhUm17Or/2AtnW2I5JEiPsr5Qu5lUf49+j7GrnrCj3vETtIqwYMkvSNoSq8xoJ1sPA==" -> null
- content_md5          = "6e49b61dde845fb363ddd1250d97a0e4" -> null
- content_sha1         = "94e104ccf8b322161875e0924f9db64ed0b10e71" -> null
- content_sha256       = "d5611a3401e92e727bd129050d043d69854393425b3316da2f7727268b06df66" -> null
- content_sha512       = "bb31cde7ab35ebfc9f649ff977cd3d021526d7b3abff602d9d6d88e491223ecaf942ee6551fe3dfa3ec6ae7ac28f7bc44ed22ac18324bd23684aaf31a09d6c3c" -> null
- directory_permission = "0777" -> null
- file_permission      = "0777" -> null
- filename             = "./.out/delta.txt" -> null
- id                   = "94e104ccf8b322161875e0924f9db64ed0b10e71" -> null
```

</details>

<details><summary><code>terraform_data.fail[0]</code> ✅ 0s</summary>

```diff
- id     = "7694f194-bc54-2882-a7cc-13915bbbd6eb" -> null
- input  = "delta phase 3" -> null
- output = "delta phase 3" -> null
```

</details>

<details><summary><code>terraform_data.main</code> ✅ 0s</summary>

```diff
- id     = "39c9d2e9-7962-032e-70c6-cbf5b27498b0" -> null
- input  = "delta" -> null
- output = "delta" -> null
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
- id               = "f9371617-775d-ad7e-d166-004f689977c6" -> null
- triggers_replace = "static" -> null
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
- content    = "delta phase 4" -> null
- name       = "delta" -> null
- replace_id = "f9371617-775d-ad7e-d166-004f689977c6" -> null
```

</details>

### <a id="trr-terragrunt-run-report-terragrunt-stack-epsilon"></a>`.terragrunt-stack/epsilon`

Destroy complete! Resources: 3 destroyed.

<details><summary>🗑️ Destroy (3)</summary>

<details><summary><code>local_file.main</code> ✅ 0s</summary>

```diff
- content              = <<-EOT
      epsilon after delta phase 2
      replace=9843b763-70c3-d2c2-64f8-21ce73a20a3b
  EOT -> null
- content_base64sha256 = "ux9XXV7JHWs2nAtM70AjIz7vSpt/ANbjVhOfS3bu1y0=" -> null
- content_base64sha512 = "rfNoZatLGFRy6rQJzQAQv8+EmKngtrHuvuVXtDDgNq0T6J/G7uU9SHAICEWmnWm8Uj+mkAubLt7vPjz1bzH4iQ==" -> null
- content_md5          = "5c7695467665e6ca3674a3daf4865fff" -> null
- content_sha1         = "9b0f4c6176a09b8ad0b8605dbf0e65c9eae9487a" -> null
- content_sha256       = "bb1f575d5ec91d6b369c0b4cef4023233eef4a9b7f00d6e356139f4b76eed72d" -> null
- content_sha512       = "adf36865ab4b185472eab409cd0010bfcf8498a9e0b6b1eebee557b430e036ad13e89fc6eee53d4870080845a69d69bc523fa6900b9b2edeef3e3cf56f31f889" -> null
- directory_permission = "0777" -> null
- file_permission      = "0777" -> null
- filename             = "./.out/epsilon.txt" -> null
- id                   = "9b0f4c6176a09b8ad0b8605dbf0e65c9eae9487a" -> null
```

</details>

<details><summary><code>terraform_data.main</code> ✅ 0s</summary>

```diff
- id     = "82d99f5e-1a90-08ee-beac-34bba052dd71" -> null
- input  = "epsilon" -> null
- output = "epsilon" -> null
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
- id               = "9843b763-70c3-d2c2-64f8-21ce73a20a3b" -> null
- triggers_replace = "static" -> null
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
- content    = "epsilon after delta phase 3" -> null
- name       = "epsilon" -> null
- replace_id = "9843b763-70c3-d2c2-64f8-21ce73a20a3b" -> null
```

</details>

### <a id="trr-terragrunt-run-report-terragrunt-stack-gamma"></a>`.terragrunt-stack/gamma`

Destroy complete! Resources: 3 destroyed.

<details><summary>🗑️ Destroy (3)</summary>

<details><summary><code>local_file.main</code> ✅ 0s</summary>

```diff
- content              = <<-EOT
      gamma never changes
      replace=bb3af989-83b3-06c5-a037-f4a716fc34bc
  EOT -> null
- content_base64sha256 = "FdlBnySXuidDSClEZiRoZOR8FsBZtWOa27vii3ytBFI=" -> null
- content_base64sha512 = "W72ZmKrSVhGqkiisYGN6OAXw/x5AJ0GBtky+LphpwcGcmBycrmLSLKCe/nBfpGWKDeIvqqPGmh5pzLZ5HR+ozA==" -> null
- content_md5          = "4659e1a3a7f9de280ee0081f2027c60d" -> null
- content_sha1         = "2ab88277d43fbaf5e5d67caddc4681676b9adca7" -> null
- content_sha256       = "15d9419f2497ba274348294466246864e47c16c059b5639adbbbe28b7cad0452" -> null
- content_sha512       = "5bbd9998aad25611aa9228ac60637a3805f0ff1e40274181b64cbe2e9869c1c19c981c9cae62d22ca09efe705fa4658a0de22faaa3c69a1e69ccb6791d1fa8cc" -> null
- directory_permission = "0777" -> null
- file_permission      = "0777" -> null
- filename             = "./.out/gamma.txt" -> null
- id                   = "2ab88277d43fbaf5e5d67caddc4681676b9adca7" -> null
```

</details>

<details><summary><code>terraform_data.main</code> ✅ 0s</summary>

```diff
- id     = "fae6a4d3-bfbc-1d38-ff6c-981d73f5f4bf" -> null
- input  = "gamma" -> null
- output = "gamma" -> null
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
- id               = "bb3af989-83b3-06c5-a037-f4a716fc34bc" -> null
- triggers_replace = "static" -> null
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
- content    = "gamma never changes" -> null
- name       = "gamma" -> null
- replace_id = "bb3af989-83b3-06c5-a037-f4a716fc34bc" -> null
```

</details>

### <a id="trr-terragrunt-run-report-terragrunt-stack-zeta"></a>`.terragrunt-stack/zeta`

Destroy complete! Resources: 3 destroyed.

<details><summary>🗑️ Destroy (3)</summary>

<details><summary><code>local_file.main</code> ✅ 0s</summary>

```diff
- content              = <<-EOT
      zeta phase 2
      replace=fbcfedcf-9542-8716-4328-4176f474036b
  EOT -> null
- content_base64sha256 = "+haNN2bDAB30z9ubT+uoMwoU3WOVpL6C1cxmKAFiYOc=" -> null
- content_base64sha512 = "maewp4osmKzwaPxM7CO/dXd9OH1b7D/lgxRW+DTo+WNH5xqU6JkF3Z1w794bmQeRBDyS0veIH1pCP8wOpHW7CA==" -> null
- content_md5          = "c28bb4aefbd1f039020fb513c82707a1" -> null
- content_sha1         = "3311c6679c26fc422037017e1d63b5283bd81bfe" -> null
- content_sha256       = "fa168d3766c3001df4cfdb9b4feba8330a14dd6395a4be82d5cc6628016260e7" -> null
- content_sha512       = "99a7b0a78a2c98acf068fc4cec23bf75777d387d5bec3fe5831456f834e8f96347e71a94e89905dd9d70efde1b990791043c92d2f7881f5a423fcc0ea475bb08" -> null
- directory_permission = "0777" -> null
- file_permission      = "0777" -> null
- filename             = "./.out/zeta.txt" -> null
- id                   = "3311c6679c26fc422037017e1d63b5283bd81bfe" -> null
```

</details>

<details><summary><code>terraform_data.main</code> ✅ 0s</summary>

```diff
- id     = "66d53f43-fbb6-ad72-43dc-b74eedb527dd" -> null
- input  = "zeta" -> null
- output = "zeta" -> null
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
- id               = "fbcfedcf-9542-8716-4328-4176f474036b" -> null
- triggers_replace = "static" -> null
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
- content    = "zeta phase 4" -> null
- name       = "zeta" -> null
- replace_id = "fbcfedcf-9542-8716-4328-4176f474036b" -> null
```

</details>
