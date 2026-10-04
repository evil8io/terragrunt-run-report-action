include "root" {
  path   = find_in_parent_folders("root.hcl")
  expose = true
}

dependency "alpha" {
  config_path = "../alpha"

  mock_outputs = {
    name = "alpha-mock"
  }
}

inputs = {
  name       = "beta"
  content    = "beta after ${dependency.alpha.outputs.name}, phase ${include.root.locals.phase}"
  extra_file = include.root.locals.phase == 1
}
