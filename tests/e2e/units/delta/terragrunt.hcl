include "root" {
  path   = find_in_parent_folders("root.hcl")
  expose = true
}

inputs = {
  name       = "delta"
  content    = "delta phase ${include.root.locals.phase}"
  fail_apply = include.root.locals.phase == 3
}
