# Terraform Project Structure

## Standard Folder Layout

```
terraform-project/
│
├── main.tf           ← Main resources (EC2, S3, VPC, etc.)
├── variables.tf      ← All input variable definitions (type, default, description)
├── outputs.tf        ← Output values shown after apply (public IP, instance ID, etc.)
├── provider.tf       ← Provider config (AWS, region, credentials)
├── terraform.tfvars  ← Actual values for variables (DO NOT commit secrets to git)
├── versions.tf       ← Required provider & Terraform version constraints
│
├── scripts/          ← Shell scripts (user data, install scripts)
│   └── install_nginx.sh
│
├── modules/          ← (Optional) Reusable modules
│   └── ec2/
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
│
└── README.md         ← Documentation for the project
```

---

## What Goes Inside Each File

### `provider.tf` — Define which cloud and region to use

```hcl
provider "aws" {
  region = var.aws_region
}
```

---

### `variables.tf` — Declare input variables (the "slots")

```hcl
variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "AWS region to deploy resources"
}
```

---

### `terraform.tfvars` — Fill the variable slots with actual values

```hcl
aws_region    = "ap-south-1"
instance_type = "t2.micro"
```

> ⚠️ Never commit secrets (like AWS keys) in this file. Add `terraform.tfvars` to `.gitignore`.

---

### `outputs.tf` — Print useful values after `apply`

```hcl
output "ec2_public_ip" {
  value = aws_instance.my_ec2.public_ip
}
```

---

### `versions.tf` — Lock Terraform and provider versions (prevents surprises)

```hcl
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
```

---

### `scripts/` — External shell scripts

Instead of writing long bash commands inline inside `.tf` files, keep them in separate `.sh` files here. This keeps `main.tf` clean and readable.

---

## Why Separate Everything?

- `main.tf` stays clean and easy to read.
- Variables, outputs, and provider settings are modular — you can change one without touching the others.
- Scripts are separate — not hardcoded inside `.tf` files.
- Different environments (dev, prod) can use different `.tfvars` files.