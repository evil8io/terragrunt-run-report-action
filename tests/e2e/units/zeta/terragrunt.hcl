include "root" {
  path   = find_in_parent_folders("root.hcl")
  expose = true
}

inputs = {
  name      = "zeta"
  content   = "zeta phase ${include.root.locals.phase}"
  fail_plan = include.root.locals.phase == 3
}
