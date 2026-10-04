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
      replace=66b0658a-d59f-91a6-061a-a7dbc04ebf66
  EOT -> (known after apply) # forces replacement
! content_base64sha256 = "6ugIOzJhm/U2QPplw7Qs2qfRlqSAMbkIDoqzFFPWjME=" -> (known after apply)
! content_base64sha512 = "H9FJSS7qIPXe+wFmu+PVENjOwSAVDxctU8C9gLdyATsc6qDEUEReh02fGuELAyNKmyD/tESByzwk6+Omd8rDIw==" -> (known after apply)
! content_md5          = "4f11fd894d8a7486435da454fb5a8bb9" -> (known after apply)
! content_sha1         = "d164f8e7d2df1797a8daaf97c528cc47193f75a7" -> (known after apply)
! content_sha256       = "eae8083b32619bf53640fa65c3b42cdaa7d196a48031b9080e8ab31453d68cc1" -> (known after apply)
! content_sha512       = "1fd149492eea20f5defb0166bbe3d510d8cec120150f172d53c0bd80b772013b1ceaa0c450445e874d9f1ae10b03234a9b20ffb44481cb3c24ebe3a677cac323" -> (known after apply)
! id                   = "d164f8e7d2df1797a8daaf97c528cc47193f75a7" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

<details><summary><code>terraform_data.replace</code> ✅ 0s</summary>

```diff
! id               = "66b0658a-d59f-91a6-061a-a7dbc04ebf66" -> (known after apply)
! triggers_replace = "phase-1" -> "phase-2"
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
! content    = "alpha phase 1" -> "alpha phase 2"
! replace_id = "66b0658a-d59f-91a6-061a-a7dbc04ebf66" -> (known after apply)
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
      replace=cf9913bd-f4ea-b114-d981-134a726b7324
  EOT
! content_base64sha256 = "Gx+d9YLTdOn2L4b0lVOerci1Axx+DNnftdeGVcKxCYc=" -> (known after apply)
! content_base64sha512 = "Z78SDUNFpoQ+YinTVA+RyX/g/FszbyZFdZvhhIF8ceOyWUwKWiCFIxvoIUg62CBbGj3eWqlUfaLyCC846cLBeA==" -> (known after apply)
! content_md5          = "7392e827f948ebed0a058e0306e6f746" -> (known after apply)
! content_sha1         = "b22466702dd61b56783771ab74f3e126745fda69" -> (known after apply)
! content_sha256       = "1b1f9df582d374e9f62f86f495539eadc8b5031c7e0cd9dfb5d78655c2b10987" -> (known after apply)
! content_sha512       = "67bf120d4345a6843e6229d3540f91c97fe0fc5b336f2645759be184817c71e3b2594c0a5a2085231be821483ad8205b1a3dde5aa9547da2f2082f38e9c2c178" -> (known after apply)
! id                   = "b22466702dd61b56783771ab74f3e126745fda69" -> (known after apply)
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
      replace=f9371617-775d-ad7e-d166-004f689977c6
  EOT
! content_base64sha256 = "IGhBbYWPyes89h0EDxnE3GhaXsIMMhJP2j07RDg/VoQ=" -> (known after apply)
! content_base64sha512 = "7aF+VOav1EP/jp7UX6EZntNOntj0+OOVseh+9aU//8rVPkhZKWByLHRMyb4XvhnOTQBr4hSkEHgTMwHwghK5ag==" -> (known after apply)
! content_md5          = "d0c9fe83dd48844d770feb70cc487781" -> (known after apply)
! content_sha1         = "b592e76cea7d5d066517730b426d5c016ac99754" -> (known after apply)
! content_sha256       = "2068416d858fc9eb3cf61d040f19c4dc685a5ec20c32124fda3d3b44383f5684" -> (known after apply)
! content_sha512       = "eda17e54e6afd443ff8e9ed45fa1199ed34e9ed8f4f8e395b1e87ef5a53fffcad53e48592960722c744cc9be17be19ce4d006be214a41078133301f08212b96a" -> (known after apply)
! id                   = "b592e76cea7d5d066517730b426d5c016ac99754" -> (known after apply)
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
      replace=9843b763-70c3-d2c2-64f8-21ce73a20a3b
  EOT
! content_base64sha256 = "vMWm0IfnrhQcXviSEHvZ5HZCJlVeqD3EaoU0NC/vEd8=" -> (known after apply)
! content_base64sha512 = "IqFPlrib3piqg7slcWw8+UJFwsLoRZSm0BEOUFLe38yr8DpjxvF6kiJN3D990ycAu6QtYaPCJ+OsR7BFCSN9rw==" -> (known after apply)
! content_md5          = "16e4174443ac2a140375081ef68b4c26" -> (known after apply)
! content_sha1         = "7aacb0eb36dab731077c996476f01044420ed48c" -> (known after apply)
! content_sha256       = "bcc5a6d087e7ae141c5ef892107bd9e4764226555ea83dc46a8534342fef11df" -> (known after apply)
! content_sha512       = "22a14f96b89bde98aa83bb25716c3cf94245c2c2e84594a6d0110e5052dedfccabf03a63c6f17a92224ddc3f7dd32700bba42d61a3c227e3ac47b04509237daf" -> (known after apply)
! id                   = "7aacb0eb36dab731077c996476f01044420ed48c" -> (known after apply)
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
      replace=fbcfedcf-9542-8716-4328-4176f474036b
  EOT
! content_base64sha256 = "uLApcdCsBvJ+LSwv9HSr1dFJIqjNkPsShr1+bnLyhmA=" -> (known after apply)
! content_base64sha512 = "hOH1t9NJVgSnWfEnV8No/kPNrdcE2Yw3n7PfFMVHdBBOvD01R4LIpbeQAXufOgc7d4Qof8VTPHgVXKN43X4gEA==" -> (known after apply)
! content_md5          = "d64e46024cb24b7241f6f372813d9fe1" -> (known after apply)
! content_sha1         = "ba579f7010de33409334f1362eb89348fd764c59" -> (known after apply)
! content_sha256       = "b8b02971d0ac06f27e2d2c2ff474abd5d14922a8cd90fb1286bd7e6e72f28660" -> (known after apply)
! content_sha512       = "84e1f5b7d3495604a759f12757c368fe43cdadd704d98c379fb3df14c54774104ebc3d354782c8a5b790017b9f3a073b7784287fc5533c78155ca378dd7e2010" -> (known after apply)
! id                   = "ba579f7010de33409334f1362eb89348fd764c59" -> (known after apply)
  # (3 unchanged attributes hidden)
```

</details>

</details>

<details><summary>Changes to Outputs</summary>

```diff
! content    = "zeta phase 1" -> "zeta phase 2"
```

</details>
