<!-- terragrunt-run-report: Terragrunt run report -->
## Terragrunt run report

**Apply: 6 units, 5 with changes, 1 unchanged.** 7 added, 0 changed, 7 destroyed.

| Unit | Result | Add | Change | Destroy |
| --- | --- | ---: | ---: | ---: |
| `.terragrunt-stack/alpha` | ✅ succeeded | 3 | 0 | 2 |
| `.terragrunt-stack/beta` | ✅ succeeded | 1 | 0 | 2 |
| `.terragrunt-stack/delta` | ✅ succeeded | 1 | 0 | 1 |
| `.terragrunt-stack/epsilon` | ✅ succeeded | 1 | 0 | 1 |
| `.terragrunt-stack/gamma` | ✅ no changes | 0 | 0 | 0 |
| `.terragrunt-stack/zeta` | ✅ succeeded | 1 | 0 | 1 |

### `.terragrunt-stack/alpha`

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
      replace=25bebadf-87d5-5ca0-4682-b2264c71b4b1
  EOT -> (known after apply) # forces replacement
! content_base64sha256 = "0SrcZhSDocEOUfHesnituFiDIdTIdF58025EgTGmZ3E=" -> (known after apply)
! content_base64sha512 = "U6UDwzI3G1xeW+bf3XHX9oWaDjkaaIGqAVgY4EkF6Ts0cutJcNPD2fNcDEjRQ+RhmtRdMZrHjhttFfkfjJe5kQ==" -> (known after apply)
! content_md5          = "102469622445f1694fa91ed2ddb0d014" -> (known after apply)
! content_sha1         = "19158362e52924954ca4dcbef63d6ac29fb1b99d" -> (known after apply)
! content_sha256       = "d12adc661483a1c10e51f1deb278adb8588321d4c8745e7cd36e448131a66771" -> (known after apply)
! content_sha512       = "53a503c332371b5c5e5be6dfdd71d7f6859a0e391a6881aa015818e04905e93b3472eb4970d3c3d9f35c0c48d143e4619ad45d319ac78e1b6d15f91f8c97b991" -> (known after apply)
! id                   = "19158362e52924954ca4dcbef63d6ac29fb1b99d" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
! id               = "25bebadf-87d5-5ca0-4682-b2264c71b4b1" -> (known after apply)
! triggers_replace = "phase-1" -> "phase-2"
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
! content    = "alpha phase 1" -> "alpha phase 2"
! replace_id = "25bebadf-87d5-5ca0-4682-b2264c71b4b1" -> (known after apply)
```

</details>

### `.terragrunt-stack/beta`

Apply complete! Resources: 1 added, 0 changed, 2 destroyed.

<details><summary>⚙️ Replace (1)</summary>

<details><summary><code>local_file.main</code> ✅ 0s</summary>

```diff
! content              = <<-EOT # forces replacement
-     beta after alpha, phase 1
+     beta after alpha, phase 2
      replace=5e83c6c9-38ce-04d5-252d-34c6d2e67038
  EOT
! content_base64sha256 = "x/oUqykfvJazG7sBsM7IgVd6Mx0cNV0Jx1iXxF6j55U=" -> (known after apply)
! content_base64sha512 = "w858421AMNNvELnOwDER0YZ4P7XTAVmA4tRiYnrgYbwy7fX9KW5W22YS66xH+/ELSUbk0l3yoGcT251lm0AOpw==" -> (known after apply)
! content_md5          = "d5ccec3c6c10e273caad93253387bba1" -> (known after apply)
! content_sha1         = "5e6e38c5fc2388f59254b25091ea36c959d18fe1" -> (known after apply)
! content_sha256       = "c7fa14ab291fbc96b31bbb01b0cec881577a331d1c355d09c75897c45ea3e795" -> (known after apply)
! content_sha512       = "c3ce7ce36d4030d36f10b9cec03111d186783fb5d3015980e2d462627ae061bc32edf5fd296e56db6612ebac47fbf10b4946e4d25df2a06713db9d659b400ea7" -> (known after apply)
! id                   = "5e6e38c5fc2388f59254b25091ea36c959d18fe1" -> (known after apply)
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

### `.terragrunt-stack/delta`

Apply complete! Resources: 1 added, 0 changed, 1 destroyed.

<details><summary>⚙️ Replace (1)</summary>

<details><summary><code>local_file.main</code> ✅ 0s</summary>

```diff
! content              = <<-EOT # forces replacement
-     delta phase 1
+     delta phase 2
      replace=650b754c-2e08-8e9f-c911-55279363ab36
  EOT
! content_base64sha256 = "qCyxy+dto04ERaS/r2SJpDf5ZbI107oJc3swVAJ7UJw=" -> (known after apply)
! content_base64sha512 = "nO95eYbi/ftgC9eKOZcGjHHTCuWLy3vt7GqYaMlEHWg5B0NFJeUzND4Sp/DAd8gE6peusLV5wGnZmANg9/oI1Q==" -> (known after apply)
! content_md5          = "13a49a2df4562a98156728eb1c18a8e1" -> (known after apply)
! content_sha1         = "7c63740e1ca63c4cf0ababe04e3f8856d336d759" -> (known after apply)
! content_sha256       = "a82cb1cbe76da34e0445a4bfaf6489a437f965b235d3ba09737b3054027b509c" -> (known after apply)
! content_sha512       = "9cef797986e2fdfb600bd78a3997068c71d30ae58bcb7bedec6a9868c9441d683907434525e533343e12a7f0c077c804ea97aeb0b579c069d9980360f7fa08d5" -> (known after apply)
! id                   = "7c63740e1ca63c4cf0ababe04e3f8856d336d759" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
! content    = "delta phase 1" -> "delta phase 2"
```

</details>

### `.terragrunt-stack/epsilon`

Apply complete! Resources: 1 added, 0 changed, 1 destroyed.

<details><summary>⚙️ Replace (1)</summary>

<details><summary><code>local_file.main</code> ✅ 0s</summary>

```diff
! content              = <<-EOT # forces replacement
-     epsilon after delta phase 1
+     epsilon after delta phase 2
      replace=d270995a-6881-29d4-1cb3-9a815d02f236
  EOT
! content_base64sha256 = "C/mVny+3UuzBllUtkaL9Krg1p9xwMJXJ42RJXRDPaYk=" -> (known after apply)
! content_base64sha512 = "pEptuXzaWtQAIaTeGKUAlvqSMb0PSJ9OgOmFFJrZvOMcwCa71WxFMN+HZRqmYjD5uuun6uOqiJq1sTitFIKBDA==" -> (known after apply)
! content_md5          = "707f7087cf026c9d96d32c1ed3027f8f" -> (known after apply)
! content_sha1         = "5f4250f73ab48d71b8067259a11c5f539001e4d3" -> (known after apply)
! content_sha256       = "0bf9959f2fb752ecc196552d91a2fd2ab835a7dc703095c9e364495d10cf6989" -> (known after apply)
! content_sha512       = "a44a6db97cda5ad40021a4de18a50096fa9231bd0f489f4e80e985149ad9bce31cc026bbd56c4530df87651aa66230f9baeba7eae3aa889ab5b138ad1482810c" -> (known after apply)
! id                   = "5f4250f73ab48d71b8067259a11c5f539001e4d3" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
! content    = "epsilon after delta phase 1" -> "epsilon after delta phase 2"
```

</details>

### `.terragrunt-stack/zeta`

Apply complete! Resources: 1 added, 0 changed, 1 destroyed.

<details><summary>⚙️ Replace (1)</summary>

<details><summary><code>local_file.main</code> ✅ 0s</summary>

```diff
! content              = <<-EOT # forces replacement
-     zeta phase 1
+     zeta phase 2
      replace=1e85d1df-8d55-30a4-2787-21e01b8f02f2
  EOT
! content_base64sha256 = "D/WBk5+wCsSydb/le2CCXHSSNJPozhweU/awZprLgaM=" -> (known after apply)
! content_base64sha512 = "TxgsDuQ/tGCAn/uAb1Fwe6hs4ZPIvk9chbYlJ+Na3OC4jkKA01xgBgoAse8G/s1LSaKz6Gh4DdocvlWXPC1irQ==" -> (known after apply)
! content_md5          = "09e21772b00ade50335e5c210b4f1791" -> (known after apply)
! content_sha1         = "13521d60df6c571ae33642641b3108c148a329ef" -> (known after apply)
! content_sha256       = "0ff581939fb00ac4b275bfe57b60825c74923493e8ce1c1e53f6b0669acb81a3" -> (known after apply)
! content_sha512       = "4f182c0ee43fb460809ffb806f51707ba86ce193c8be4f5c85b62527e35adce0b88e4280d35c60060a00b1ef06fecd4b49a2b3e868780dda1cbe55973c2d62ad" -> (known after apply)
! id                   = "13521d60df6c571ae33642641b3108c148a329ef" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
! content    = "zeta phase 1" -> "zeta phase 2"
```

</details>
