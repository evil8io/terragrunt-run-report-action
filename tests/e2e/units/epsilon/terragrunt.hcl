include "root" {
  path   = find_in_parent_folders("root.hcl")
  expose = true
}

dependency "delta" {
  config_path = "../delta"

  mock_outputs = {
    content = "delta-mock"
  }
}

inputs = {
  name    = "epsilon"
  content = "epsilon after ${dependency.delta.outputs.content}"
}
