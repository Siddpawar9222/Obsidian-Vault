1# 004 — Terraform Terminologies

These are the core building blocks you'll see in every Terraform project. Learn these and the rest becomes easy.

---

## 1. Provider

A **provider** is a plugin that tells Terraform how to talk to a specific cloud or service (AWS, Azure, GCP, GitHub, etc.).

```hcl
provider "aws" {
  region = "us-east-1"
}
```

> **Analogy:** Like a printer driver — without it, your computer can't talk to the printer.

---

## 2. Resource

A **resource** is the main building block — it creates or manages a piece of infrastructure (EC2 instance, S3 bucket, VPC, etc.).

```hcl
resource "aws_instance" "my_ec2" {
  ami           = "ami-xxxx"
  instance_type = "t2.micro"
}
```

> **Analogy:** The actual "thing" you want to build — like a house, a car, or an EC2 instance.

---

## 3. Data Source (`data`)

A **data source** fetches information about resources that *already exist* in your cloud, without creating anything new.

```hcl
data "aws_vpc" "default" {
  default = true
}
```

> **Analogy:** Like reading Google Maps to find existing roads — you're not building a new road, just looking at what's already there.

---

## 4. Variable (`variable`)

**Variables** are input parameters. Instead of hardcoding values, you define variables so the same config can work for different environments.

```hcl
variable "instance_type" {
  default = "t2.micro"
}
```

> **Analogy:** Ingredients in a recipe — you can swap "1 spoon of sugar" with "2 spoons" without rewriting the whole recipe.

---

## 5. Output (`output`)

**Outputs** display useful values after Terraform finishes applying — like the public IP or instance ID of a resource you just created.

```hcl
output "public_ip" {
  value = aws_instance.my_ec2.public_ip
}
```

> **Analogy:** Like a receipt after shopping — it shows what you got.

---

## 6. State

Terraform keeps track of all the resources it has created in a file called `terraform.tfstate`.

- **Purpose:** Knows what already exists → avoids creating duplicates.
- Without it, Terraform would have no memory of what it created.

> **Analogy:** A to-do checklist that marks what's already done.

---

## 7. Plan

`terraform plan` shows you **what Terraform will do** before it actually does anything. No changes are made.

> **Analogy:** A blueprint review before construction starts.

---

## 8. Apply

`terraform apply` actually **provisions (creates) the infrastructure** as defined in your `.tf` files.

> **Analogy:** Construction workers building from the approved blueprint.

---

## 9. Destroy

`terraform destroy` **deletes all the resources** that Terraform created.

> **Analogy:** Bulldozers demolishing the building you constructed.

---

## 10. Module

A **module** is a reusable group of resources — like a function in programming. Instead of writing the same resource blocks over and over, you package them into a module and call it wherever needed.

> **Analogy:** Instead of writing a cake recipe from scratch every time, you reuse the same cookbook recipe.

---

## 11. Interpolation

**Interpolation** means using the value of one resource inside another resource's configuration.

```hcl
vpc_id = data.aws_vpc.default.id
```

> **Analogy:** Like saying "use the address from Google Maps" instead of typing it manually.

---

## 12. Backend

A **backend** defines *where* the state file is stored — locally on your machine, or remotely in S3, Azure Blob, GCS, Terraform Cloud, etc.

> **Analogy:** Storing your receipts in a safe deposit box instead of carrying them in your pocket.

---

## 13. Provisioner

A **provisioner** runs scripts or commands on a resource *after* it is created.

Example: Use `remote-exec` to install Nginx on a newly created EC2.

> **Analogy:** Moving into a new house and arranging the furniture.

---

## 14. Workspace

A **workspace** is an isolated state environment. You can have separate workspaces for `dev`, `test`, and `prod` — each with its own state.

> **Analogy:** Separate apartments in the same building — same structure, different occupants.

---

## Quick Reference: Most Used in AWS Projects

`provider` → `resource` → `data` → `variable` → `output` → `state` → `plan` → `apply`
