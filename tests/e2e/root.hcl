locals {
  phase = tonumber(get_env("E2E_PHASE", "1"))
}

remote_state {
  backend = "local"
  generate = {
    path      = "backend.tf"
    if_exists = "overwrite"
  }
  config = {
    path = "${get_repo_root()}/tests/e2e/.state/${path_relative_to_include()}/terraform.tfstate"
  }
}

terraform {
  source = "${get_repo_root()}/tests/e2e/modules/demo"
}
