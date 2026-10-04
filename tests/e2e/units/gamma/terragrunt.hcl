include "root" {
  path   = find_in_parent_folders("root.hcl")
  expose = true
}

inputs = {
  name    = "gamma"
  content = "gamma never changes"
}
