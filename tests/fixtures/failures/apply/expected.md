<!-- terragrunt-run-report: Terragrunt run report -->
## Terragrunt run report

**Apply: 6 units, 2 with changes, 1 unchanged, 2 failed, 1 early exit.** 4 added, 0 changed, 5 destroyed.

| Unit | Result | Add | Change | Destroy |
| --- | --- | ---: | ---: | ---: |
| `.terragrunt-stack/alpha` | ✅ succeeded | 2 | 0 | 3 |
| `.terragrunt-stack/beta` | ✅ succeeded | 1 | 0 | 1 |
| `.terragrunt-stack/delta` | ❌ failed (run error) | 1 of 2 | 0 | 1 |
| `.terragrunt-stack/epsilon` | ⏭️ early exit (ancestor error: delta) |  |  |  |
| `.terragrunt-stack/gamma` | ✅ no changes | 0 | 0 | 0 |
| `.terragrunt-stack/zeta` | ❌ failed (run error) | 0 of 1 | 0 | 0 of 1 |

### `.terragrunt-stack/alpha`

Apply complete! Resources: 2 added, 0 changed, 3 destroyed.

<details><summary>⚙️ Replace (2)</summary>

<details><summary><code>local_file.main</code> ✅ 0s</summary>

```diff
! content              = <<-EOT # forces replacement
      alpha phase 2
      replace=c907a00a-7d8c-d530-cc83-1f337f26f4f1
  EOT -> (known after apply) # forces replacement
! content_base64sha256 = "dEA3O9kksby5s+bFWwmDAGA6eW5JzEequfJ91Ge/VPw=" -> (known after apply)
! content_base64sha512 = "GCUIvnG0GQwYMsAzMAr5sgVtWN4Spi5W11xWsdCpM9bJHZr0qtu1mE4q3GqvKWJFrXVDgm1hjQDa6Kv95XN2ug==" -> (known after apply)
! content_md5          = "ce7ab6950aed6ff77c55792098642492" -> (known after apply)
! content_sha1         = "5b6abecd7c33f993100c5a3ee3921b2e3ac626c4" -> (known after apply)
! content_sha256       = "7440373bd924b1bcb9b3e6c55b098300603a796e49cc47aab9f27dd467bf54fc" -> (known after apply)
! content_sha512       = "182508be71b4190c1832c033300af9b2056d58de12a62e56d75c56b1d0a933d6c91d9af4aadbb5984e2adc6aaf296245ad7543826d618d00dae8abfde57376ba" -> (known after apply)
! id                   = "5b6abecd7c33f993100c5a3ee3921b2e3ac626c4" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
! id               = "c907a00a-7d8c-d530-cc83-1f337f26f4f1" -> (known after apply)
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
! replace_id = "c907a00a-7d8c-d530-cc83-1f337f26f4f1" -> (known after apply)
```

</details>

### `.terragrunt-stack/beta`

Apply complete! Resources: 1 added, 0 changed, 1 destroyed.

<details><summary>⚙️ Replace (1)</summary>

<details><summary><code>local_file.main</code> ✅ 0s</summary>

```diff
! content              = <<-EOT # forces replacement
-     beta after alpha, phase 2
+     beta after alpha, phase 3
      replace=cf9913bd-f4ea-b114-d981-134a726b7324
  EOT
! content_base64sha256 = "OSIht/d83KflokSK2hW7HTvfYqqUTMXYjt6QSNTywYg=" -> (known after apply)
! content_base64sha512 = "Wvbg++Mdc6YB7yvPVx8SziuBj3Dt87kPWPuANHADuKriA2taGKwJSbXmSBn1GCbBYs2AJxBErQk8WYl5iw0TmQ==" -> (known after apply)
! content_md5          = "fdffeaa9c9589770f326c66b970dee90" -> (known after apply)
! content_sha1         = "ab55dc35c03f714812c8e09fa7021d50351d5b73" -> (known after apply)
! content_sha256       = "392221b7f77cdca7e5a2448ada15bb1d3bdf62aa944cc5d88ede9048d4f2c188" -> (known after apply)
! content_sha512       = "5af6e0fbe31d73a601ef2bcf571f12ce2b818f70edf3b90f58fb80347003b8aae2036b5a18ac0949b5e64819f51826c162cd80271044ad093c5989798b0d1399" -> (known after apply)
! id                   = "ab55dc35c03f714812c8e09fa7021d50351d5b73" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
! content    = "beta after alpha, phase 2" -> "beta after alpha, phase 3"
```

</details>

### `.terragrunt-stack/delta`

❌ failed (run error)

```
Error: local-exec provisioner error
  with terraform_data.fail[0],
  on main.tf line 68, in resource "terraform_data" "fail":
  68:   provisioner "local-exec" {
Error running command 'echo 'simulated failure in delta' >&2; exit 1': exit
status 1. Output: simulated failure in delta
```

Plan: 2 to add, 0 to change, 1 to destroy.

<details><summary>✨ Create (1)</summary>

<details><summary><code>terraform_data.fail[0]</code> ❌ failed</summary>

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
      replace=f9371617-775d-ad7e-d166-004f689977c6
  EOT
! content_base64sha256 = "0H61GaOKrZ3FlDlUHPdCKEm9Qz5uxXE4BVUc+LAp6e0=" -> (known after apply)
! content_base64sha512 = "D/RAVpTzDo5eCM8Jw5SBuf8710wdJnxBEZhUwQqd5YGVH66gRnbyqK4KNTXTzVxnTU3V1wWMBMh6mnP/DwARvw==" -> (known after apply)
! content_md5          = "2346192c950ac812631b731256518f7e" -> (known after apply)
! content_sha1         = "9f1b742c26c738c26734d5f892afb57cd623b018" -> (known after apply)
! content_sha256       = "d07eb519a38aad9dc59439541cf7422849bd433e6ec5713805551cf8b029e9ed" -> (known after apply)
! content_sha512       = "0ff4405694f30e8e5e08cf09c39481b9ff3bd74c1d267c41119854c10a9de581951faea04676f2a8ae0a3535d3cd5c674d4dd5d7058c04c87a9a73ff0f0011bf" -> (known after apply)
! id                   = "9f1b742c26c738c26734d5f892afb57cd623b018" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
! content    = "delta phase 2" -> "delta phase 3"
```

</details>

### `.terragrunt-stack/zeta`

❌ failed (run error)

```
Error: Resource precondition failed
  on main.tf line 43, in resource "terraform_data" "main":
  43:       condition     = !var.fail_plan
    ├────────────────
    │ var.fail_plan is true
The unit zeta is configured to fail at plan time.
```

Plan: 1 to add, 0 to change, 1 to destroy.

<details><summary>⚙️ Replace (1)</summary>

<details><summary><code>local_file.main</code> ⏳ not applied</summary>

```diff
! content              = <<-EOT # forces replacement
-     zeta phase 2
+     zeta phase 3
      replace=fbcfedcf-9542-8716-4328-4176f474036b
  EOT
! content_base64sha256 = "+haNN2bDAB30z9ubT+uoMwoU3WOVpL6C1cxmKAFiYOc=" -> (known after apply)
! content_base64sha512 = "maewp4osmKzwaPxM7CO/dXd9OH1b7D/lgxRW+DTo+WNH5xqU6JkF3Z1w794bmQeRBDyS0veIH1pCP8wOpHW7CA==" -> (known after apply)
! content_md5          = "c28bb4aefbd1f039020fb513c82707a1" -> (known after apply)
! content_sha1         = "3311c6679c26fc422037017e1d63b5283bd81bfe" -> (known after apply)
! content_sha256       = "fa168d3766c3001df4cfdb9b4feba8330a14dd6395a4be82d5cc6628016260e7" -> (known after apply)
! content_sha512       = "99a7b0a78a2c98acf068fc4cec23bf75777d387d5bec3fe5831456f834e8f96347e71a94e89905dd9d70efde1b990791043c92d2f7881f5a423fcc0ea475bb08" -> (known after apply)
! id                   = "3311c6679c26fc422037017e1d63b5283bd81bfe" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
! content    = "zeta phase 2" -> "zeta phase 3"
```

</details>
