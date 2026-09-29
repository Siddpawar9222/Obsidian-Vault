# 010 — Variables in Depth

Variables in Terraform let you avoid hardcoding values. The workflow is:
1. **Declare** variables in `variables.tf` (define the "slots")
2. **Use** variables in `main.tf` with `var.<name>`
3. **Assign values** in `terraform.tfvars` (fill in the slots)

---

## Step 1: Declare Variables (`variables.tf`)

This file tells Terraform what inputs your project expects.

```hcl
variable "project_name" {
  description = "Name of the project"
  type        = string
  # No default = required. Terraform will ask for it if not provided.
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"   # optional default value
}
```

- `project_name` → **required** (no default given)
- `instance_type` → **optional** (falls back to `t2.micro` if not provided)

---

## Step 2: Use Variables in Resources (`main.tf`)

```hcl
resource "aws_instance" "app" {
  ami           = "ami-0a12345abcd67890"
  instance_type = var.instance_type      # uses the variable
  tags = {
    Name = var.project_name              # uses the variable
  }
}
```

---

## Step 3: Assign Values (`terraform.tfvars`)

This file gives actual values to your declared variables.

```hcl
project_name  = "geekysiddhesh"
instance_type = "t3.micro"
```

When you run `terraform plan` or `terraform apply`, Terraform **automatically loads** this file if it exists in the same folder.

- `project_name` → gets `"geekysiddhesh"`
- `instance_type` → gets `"t3.micro"` (overrides the default `"t2.micro"`)

---

## What Happens When a Required Variable Has No Value?

If you declare a variable **without a default** and don't provide a value in `terraform.tfvars` or CLI, Terraform stops and asks you:

```
var.project_name
  Name of the project

  Enter a value: geekysiddhesh
```

You must type a value to continue.

---

## Other Ways to Assign Variable Values

### 1. Pass directly via CLI flag

```bash
terraform apply -var="project_name=myapp" -var="instance_type=t3.small"
```

### 2. Use environment-specific `.tfvars` files

Create separate files per environment:
- `dev.tfvars`
- `prod.tfvars`

Then run:
```bash
terraform apply -var-file="prod.tfvars"
```

---

## Variable Precedence (What Wins?)

If the same variable is set in multiple places, Terraform uses this priority order (highest wins):

```
1. CLI -var flag         (highest priority)
2. -var-file flag
3. terraform.tfvars
4. Default value in variables.tf  (lowest priority)
```

---

## Quick Summary

| File | Role |
|---|---|
| `variables.tf` | Define the input slots (name, type, description, default) |
| `main.tf` | Use variables with `var.<name>` |
| `terraform.tfvars` | Fill in the actual values |
| CLI `-var` flag | Override values at runtime |
