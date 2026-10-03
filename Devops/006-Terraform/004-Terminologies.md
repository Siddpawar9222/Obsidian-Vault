# Terraform Terminologies

## 1. Provider

A **provider** is a plugin that tells Terraform how to talk to a specific cloud or service (AWS, Azure, GCP, GitHub, etc.).

```hcl
provider "aws" {
  region = "us-east-1"
}
```


---

## 2. Resource

A **resource** is the main building block — it creates or manages a piece of infrastructure (EC2 instance, S3 bucket, VPC, etc.).

```hcl
resource "aws_instance" "my_ec2" {
  ami           = "ami-xxxx"
  instance_type = "t2.micro"
}
```


---

## 3. Data Source (`data`)

A **data source** fetches information about resources that *already exist* in your cloud, without creating anything new.

```hcl
data "aws_vpc" "default" {
  default = true
}
```

---

## 4. Variable (`variable`)

**Variables** are input parameters. Instead of hardcoding values, you define variables so the same config can work for different environments.

```hcl
variable "instance_type" {
  default = "t2.micro"
}
```

---

## 5. Output (`output`)

**Outputs** display useful values after Terraform finishes applying — like the public IP or instance ID of a resource you just created.

```hcl
output "public_ip" {
  value = aws_instance.my_ec2.public_ip
}
```

---

## 6. State

Terraform keeps track of all the resources it has created in a file called `terraform.tfstate`.

- **Purpose:** Knows what already exists → avoids creating duplicates.
- Without it, Terraform would have no memory of what it created.

---

## 7. Plan

`terraform plan` shows you **what Terraform will do** before it actually does anything. No changes are made.

---

## 8. Apply

`terraform apply` actually **provisions (creates) the infrastructure** as defined in your `.tf` files.

---

## 9. Destroy

`terraform destroy` **deletes all the resources** that Terraform created.

---

## 10. Module

A **module** is a reusable group of resources — like a function in programming. Instead of writing the same resource blocks over and over, you package them into a module and call it wherever needed.

---

## 11. Interpolation

**Interpolation** means using the value of one resource inside another resource's configuration.

```hcl
vpc_id = data.aws_vpc.default.id
```

---

## 12. Backend

A **backend** defines *where* the state file is stored — locally on your machine, or remotely in S3, Azure Blob, GCS, Terraform Cloud, etc.

---

## 13. Provisioner

A **provisioner** runs scripts or commands on a resource *after* it is created.

Example: Use `remote-exec` to install Nginx on a newly created EC2.

---

## 14. Workspace

A **workspace** is an isolated state environment. You can have separate workspaces for `dev`, `test`, and `prod` — each with its own state.

---

## Quick Reference: Most Used in AWS Projects

`provider` → `resource` → `data` → `variable` → `output` → `state` → `plan` → `apply`

---
