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
      replace=25a01274-b69f-8c77-2317-e00989022bbe
  EOT -> null
- content_base64sha256 = "kvl3a+LohB6RA6Ru8bHJ0JDS3LTgp8YxxlnKcmzQqQU=" -> null
- content_base64sha512 = "+6zxhOoPNjhrwuy0b8EFcBf78hu6jpPwJqRd22dWVSVm35Dx8WaxBvn6CxKQaou/zEXzL77EJyH3yXgpmzJ37A==" -> null
- content_md5          = "91b7d8022c9d1a3ce6004c6acc1b739a" -> null
- content_sha1         = "f9fd85fb1ba3351796f5d2dda850ee4d0ab51710" -> null
- content_sha256       = "92f9776be2e8841e9103a46ef1b1c9d090d2dcb4e0a7c631c659ca726cd0a905" -> null
- content_sha512       = "fbacf184ea0f36386bc2ecb46fc1057017fbf21bba8e93f026a45ddb6756552566df90f1f166b106f9fa0b12906a8bbfcc45f32fbec42721f7c978299b3277ec" -> null
- directory_permission = "0777" -> null
- file_permission      = "0777" -> null
- filename             = "./.out/alpha.txt" -> null
- id                   = "f9fd85fb1ba3351796f5d2dda850ee4d0ab51710" -> null
```

</details>

<details><summary><code>terraform_data.main</code> ✅ 0s</summary>

```diff
- id     = "b72d7d05-b103-2a4d-752f-5f59e71912fb" -> null
- input  = "alpha" -> null
- output = "alpha" -> null
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
- id               = "25a01274-b69f-8c77-2317-e00989022bbe" -> null
- triggers_replace = "phase-3" -> null
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
- content    = "alpha phase 4" -> null
- name       = "alpha" -> null
- replace_id = "25a01274-b69f-8c77-2317-e00989022bbe" -> null
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
      replace=6e9cb995-1623-16cd-b6e5-00d1988e8976
  EOT -> null
- content_base64sha256 = "Vx5kvniVNcKuizDM/gG1mO9Z4aWUQjOhQsqwiewvns8=" -> null
- content_base64sha512 = "Ajqwj11tmpTjhBLvV9nf2Q3+fBzsfAlZOMoFVrH67ON4lIx2DcsVX0tqHQLdT7v2on8fA5r4k+YV3+Bpd/byCg==" -> null
- content_md5          = "afcd9a806a37518f6d84f5984b047973" -> null
- content_sha1         = "50d458b4b112a8df9a884e6c4f5a7dab91cb11c9" -> null
- content_sha256       = "571e64be789535c2ae8b30ccfe01b598ef59e1a5944233a142cab089ec2f9ecf" -> null
- content_sha512       = "023ab08f5d6d9a94e38412ef57d9dfd90dfe7c1cec7c095938ca0556b1faece378948c760dcb155f4b6a1d02dd4fbbf6a27f1f039af893e615dfe06977f6f20a" -> null
- directory_permission = "0777" -> null
- file_permission      = "0777" -> null
- filename             = "./.out/beta.txt" -> null
- id                   = "50d458b4b112a8df9a884e6c4f5a7dab91cb11c9" -> null
```

</details>

<details><summary><code>terraform_data.main</code> ✅ 0s</summary>

```diff
- id     = "e5faf3ee-0f07-827a-e68d-06e6d71c599b" -> null
- input  = "beta" -> null
- output = "beta" -> null
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
- id               = "6e9cb995-1623-16cd-b6e5-00d1988e8976" -> null
- triggers_replace = "static" -> null
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
- content    = "beta after alpha, phase 4" -> null
- name       = "beta" -> null
- replace_id = "6e9cb995-1623-16cd-b6e5-00d1988e8976" -> null
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
      replace=ccd28744-083a-c82c-3da0-710f1799fd0c
  EOT -> null
- content_base64sha256 = "tW/cC7jkamKSdWMFW0Q/cvmrOba3DSV2erhub0c6z+k=" -> null
- content_base64sha512 = "tq29utIGjeRlqiI0qbEuPXBYm+IgLt3MLU946XMmUQJ9KnFe+enCwzCghNW0jTONxNgR7sIBBZqc5i+XQ6xvoQ==" -> null
- content_md5          = "1560850170397ddc72ac86536d547188" -> null
- content_sha1         = "e2ab98bc04a9ad7a47c52aa22222c740aa8bedc7" -> null
- content_sha256       = "b56fdc0bb8e46a62927563055b443f72f9ab39b6b70d25767ab86e6f473acfe9" -> null
- content_sha512       = "b6adbdbad2068de465aa2234a9b12e3d70589be2202eddcc2d4f78e9732651027d2a715ef9e9c2c330a084d5b48d338dc4d811eec201059a9ce62f9743ac6fa1" -> null
- directory_permission = "0777" -> null
- file_permission      = "0777" -> null
- filename             = "./.out/delta.txt" -> null
- id                   = "e2ab98bc04a9ad7a47c52aa22222c740aa8bedc7" -> null
```

</details>

<details><summary><code>terraform_data.fail[0]</code> ✅ 0s</summary>

```diff
- id     = "42a83dd8-020d-8885-7196-67b0409d4e31" -> null
- input  = "delta phase 3" -> null
- output = "delta phase 3" -> null
```

</details>

<details><summary><code>terraform_data.main</code> ✅ 0s</summary>

```diff
- id     = "51c07b72-cefd-5648-38fe-cb6f6bded715" -> null
- input  = "delta" -> null
- output = "delta" -> null
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
- id               = "ccd28744-083a-c82c-3da0-710f1799fd0c" -> null
- triggers_replace = "static" -> null
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
- content    = "delta phase 4" -> null
- name       = "delta" -> null
- replace_id = "ccd28744-083a-c82c-3da0-710f1799fd0c" -> null
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
      replace=4cc555be-3cc4-3127-6c4b-2054ec282bc2
  EOT -> null
- content_base64sha256 = "vpGwOriTF3DBLce0Z0d4eFlgUPgupo2m326oh5djrIs=" -> null
- content_base64sha512 = "kjUJylOTFO/mT2bWlIWg3dng7JCD3PbdAPBz/2yJFcBWWMt1hG6quSRdv2KHjv+LenMUChxpboaT23REPbAaZg==" -> null
- content_md5          = "e374cba1e0cfa61caa37f6058d58d21f" -> null
- content_sha1         = "c3babbd9b9111b2baf6d499f769ce6a09acfe379" -> null
- content_sha256       = "be91b03ab8931770c12dc7b467477878596050f82ea68da6df6ea8879763ac8b" -> null
- content_sha512       = "923509ca539314efe64f66d69485a0ddd9e0ec9083dcf6dd00f073ff6c8915c05658cb75846eaab9245dbf62878eff8b7a73140a1c696e8693db74443db01a66" -> null
- directory_permission = "0777" -> null
- file_permission      = "0777" -> null
- filename             = "./.out/epsilon.txt" -> null
- id                   = "c3babbd9b9111b2baf6d499f769ce6a09acfe379" -> null
```

</details>

<details><summary><code>terraform_data.main</code> ✅ 0s</summary>

```diff
- id     = "ad009131-e3c6-e09d-af34-6e7882494f26" -> null
- input  = "epsilon" -> null
- output = "epsilon" -> null
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
- id               = "4cc555be-3cc4-3127-6c4b-2054ec282bc2" -> null
- triggers_replace = "static" -> null
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
- content    = "epsilon after delta phase 3" -> null
- name       = "epsilon" -> null
- replace_id = "4cc555be-3cc4-3127-6c4b-2054ec282bc2" -> null
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
      replace=7addef60-f44d-84d7-40c4-acb2abc85e2b
  EOT -> null
- content_base64sha256 = "jlMqobkrAZIuZkkHkcRQo4dZnLHreWkSd2W6ELJY6Jc=" -> null
- content_base64sha512 = "wxCGMP4wXNFzPO6mmHM8HsZx7/eUeJob6w9Htrg1VtDIqkDmlHve1aS4yqacmFR976fGCG/+662I90wmH4Wbrg==" -> null
- content_md5          = "6126c982322dc765a1360ac743e95f70" -> null
- content_sha1         = "fbf5fcbcda15d8b957762036c6c13bc7ad44df50" -> null
- content_sha256       = "8e532aa1b92b01922e66490791c450a387599cb1eb7969127765ba10b258e897" -> null
- content_sha512       = "c3108630fe305cd1733ceea698733c1ec671eff794789a1beb0f47b6b83556d0c8aa40e6947bded5a4b8caa69c98547defa7c6086ffeebad88f74c261f859bae" -> null
- directory_permission = "0777" -> null
- file_permission      = "0777" -> null
- filename             = "./.out/gamma.txt" -> null
- id                   = "fbf5fcbcda15d8b957762036c6c13bc7ad44df50" -> null
```

</details>

<details><summary><code>terraform_data.main</code> ✅ 0s</summary>

```diff
- id     = "1795d75d-9183-072d-341e-b59618477661" -> null
- input  = "gamma" -> null
- output = "gamma" -> null
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
- id               = "7addef60-f44d-84d7-40c4-acb2abc85e2b" -> null
- triggers_replace = "static" -> null
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
- content    = "gamma never changes" -> null
- name       = "gamma" -> null
- replace_id = "7addef60-f44d-84d7-40c4-acb2abc85e2b" -> null
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
      replace=2b99c17b-4ce0-effd-d4d1-13fcbb5dd989
  EOT -> null
- content_base64sha256 = "gTZJCGiDKxNiCrSUJqJYzYB2ICb3IyfMWIaWqVN9Wsk=" -> null
- content_base64sha512 = "DkVC60IA79dMbHFR7DgHNA8dhFygQ/XrkLb9CR7YGVKmC6gKWy+hR1dMI02Q4M2MO3ins7wtm4Jl25WCKIghZw==" -> null
- content_md5          = "1ee3abb56d8324038e8f329e8705f865" -> null
- content_sha1         = "d7139e64879a1d465ba5e02e500dac0b4dc480a5" -> null
- content_sha256       = "8136490868832b13620ab49426a258cd80762026f72327cc588696a9537d5ac9" -> null
- content_sha512       = "0e4542eb4200efd74c6c7151ec3807340f1d845ca043f5eb90b6fd091ed81952a60ba80a5b2fa147574c234d90e0cd8c3b78a7b3bc2d9b8265db958228882167" -> null
- directory_permission = "0777" -> null
- file_permission      = "0777" -> null
- filename             = "./.out/zeta.txt" -> null
- id                   = "d7139e64879a1d465ba5e02e500dac0b4dc480a5" -> null
```

</details>

<details><summary><code>terraform_data.main</code> ✅ 0s</summary>

```diff
- id     = "8cc817c3-e103-a3b4-d7a7-a40528504761" -> null
- input  = "zeta" -> null
- output = "zeta" -> null
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
- id               = "2b99c17b-4ce0-effd-d4d1-13fcbb5dd989" -> null
- triggers_replace = "static" -> null
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
- content    = "zeta phase 4" -> null
- name       = "zeta" -> null
- replace_id = "2b99c17b-4ce0-effd-d4d1-13fcbb5dd989" -> null
```

</details>
