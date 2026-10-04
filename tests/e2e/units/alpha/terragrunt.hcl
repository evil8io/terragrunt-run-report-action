include "root" {
  path   = find_in_parent_folders("root.hcl")
  expose = true
}

inputs = {
  name            = "alpha"
  content         = "alpha phase ${include.root.locals.phase}"
  replace_trigger = "phase-${include.root.locals.phase}"
  extra_file      = include.root.locals.phase == 2
}
