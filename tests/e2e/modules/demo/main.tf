terraform {
  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.5"
    }
  }
}

variable "name" {
  type = string
}

variable "content" {
  type = string
}

variable "replace_trigger" {
  type    = string
  default = "static"
}

variable "extra_file" {
  type    = bool
  default = false
}

variable "fail_plan" {
  type    = bool
  default = false
}

variable "fail_apply" {
  type    = bool
  default = false
}

resource "terraform_data" "main" {
  input = var.name

  lifecycle {
    ignore_changes = [id]

    precondition {
      condition     = !var.fail_plan
      error_message = "The unit ${var.name} is configured to fail at plan time."
    }
  }
}

resource "terraform_data" "replace" {
  triggers_replace = var.replace_trigger

  lifecycle {
    ignore_changes = [id]
  }
}

resource "local_file" "main" {
  filename = "${path.module}/.out/${var.name}.txt"
  content  = "${var.content}\nreplace=${terraform_data.replace.id}\n"
}

resource "local_file" "extra" {
  count    = var.extra_file ? 1 : 0
  filename = "${path.module}/.out/${var.name}-extra.txt"
  content  = "extra file of ${var.name}\n"
}

resource "terraform_data" "fail" {
  count = var.fail_apply ? 1 : 0
  input = var.content

  provisioner "local-exec" {
    command = "echo 'simulated failure in ${var.name}' >&2; exit 1"
  }

  lifecycle {
    ignore_changes = [id]
  }
}

output "name" {
  value = var.name
}

output "content" {
  value = var.content
}

output "replace_id" {
  value = terraform_data.replace.id
}
