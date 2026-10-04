#  Terraform Syntax & Referencing

## 1. Basic Block Structure

Every block in Terraform follows this general pattern:

```hcl
<block_type> "<provider_resource_type>" "<name>" {
  # arguments = values
}
```

- **`block_type`** — what kind of block it is (`resource`, `data`, `variable`, etc.)
- **`provider_resource_type`** — the cloud resource type (e.g., `aws_instance`, `aws_s3_bucket`)
- **`name`** — your local name for this block (used to reference it elsewhere)

**Example:**
```hcl
resource "aws_instance" "my_ec2" {
  ami           = "ami-xxxx"
  instance_type = "t2.micro"
}
```

---

## 2. Common Block Types

| Block Type | How to Reference It | Purpose |
|---|---|---|
| `resource` | `aws_instance.my_ec2` | Create/manage infrastructure |
| `data` | `data.aws_vpc.default` | Fetch existing info from cloud |
| `variable` | `var.instance_type` | Input values for flexibility |
| `output` | `output.public_ip` | Show values after apply |
| `locals` | `local.project_name` | Store calculated/reused values |
| `module` | `module.vpc` | Reusable group of resources |
| `provider` | N/A (not referenced) | Defines which cloud/service to use |

---

## 3. Referencing Rules

### Resource Reference

For resources that **Terraform creates**, just use: `<resource_type>.<name>.<attribute>`

```hcl
vpc_security_group_ids = [aws_security_group.my_sg.id]
```

No prefix needed — Terraform knows you created this.

---

### Data Source Reference

For resources that **already exist** in the cloud, you must use the `data.` prefix:

```hcl
data "aws_vpc" "default" {
  default = true
}

vpc_id = data.aws_vpc.default.id
```

> Without `data.`, Terraform would think you want to *create* a new VPC instead of fetching the existing one.

---

### Variable Reference

```hcl
variable "instance_type" {
  default = "t2.micro"
}

instance_type = var.instance_type
```

---

### Locals Reference

```hcl
locals {
  project_name = "my-terraform-app"
}

tags = {
  Name = local.project_name
}
```

---

### Module Reference

```hcl
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  name   = "my-vpc"
}

vpc_id = module.vpc.vpc_id
```

---

## 4. Why Does `data.` Matter?

| Scenario                      | What Terraform Does                                             |
| ----------------------------- | --------------------------------------------------------------- |
| `aws_security_group.my_sg.id` | Refers to a resource **Terraform owns and created**             |
| `data.aws_vpc.default.id`     | Refers to a resource **already in AWS, just read by Terraform** |

> **Analogy:** `resource` = your own car. `data` = borrowing a friend's car. Both are cars, but *ownership* matters.

---

## 5. Core Commands (Quick Reference)

| Command             | What it Does                                          |
| ------------------- | ----------------------------------------------------- |
| `terraform init`    | Downloads provider plugins, sets up working directory |
| `terraform plan`    | Shows what will be created, changed, or destroyed     |
| `terraform apply`   | Creates or updates the actual infrastructure          |
| `terraform destroy` | Deletes all Terraform-managed resources               |
