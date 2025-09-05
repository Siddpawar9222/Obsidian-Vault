

---

# 📒 Terraform Syntax & Referencing Notes

## 1. Basic Block Structure

Every Terraform block has the same general format:

```hcl
<block_type> "<provider>_<resource_type>" "<name>" {
  # arguments = values
}
```

- **`block_type`** → what kind of thing (resource, data, variable, etc.)
    
- **`provider_resource_type`** → AWS, Azure, GCP, etc. resource type
    
- **`name`** → your local name (used for referencing)
    

✅ Example:

```hcl
resource "aws_instance" "my_ec2" {
  ami           = "ami-xxxx"
  instance_type = "t2.micro"
}
```

---

## 2. Common Block Types

|Block Type|Prefix when referencing|Purpose|
|---|---|---|
|`resource`|`aws_instance.my_ec2`|Create/manage infrastructure|
|`data`|`data.aws_vpc.default`|Fetch existing info from cloud|
|`variable`|`var.instance_type`|Input values for flexibility|
|`output`|`output.public_ip`|Show values after apply|
|`locals`|`local.project_name`|Store calculated values|
|`module`|`module.vpc`|Reusable group of resources|
|`provider`|N/A|Defines which cloud/service to use|

---

## 3. Key Referencing Rules

### 🔹 Resource Reference

- For resources Terraform creates:
    

```hcl
vpc_security_group_ids = [aws_security_group.my_sg.id]
```

👉 No prefix needed, just provider + resource type + name.

---

### 🔹 Data Source Reference

- For resources that already exist (fetched from provider):
    

```hcl
data "aws_vpc" "default" {
  default = true
}

vpc_id = data.aws_vpc.default.id
```

👉 Must use `data.` prefix, otherwise Terraform thinks you want to create a new one.

---

### 🔹 Variables

```hcl
variable "instance_type" { default = "t2.micro" }

instance_type = var.instance_type
```

---

### 🔹 Locals

```hcl
locals {
  project_name = "my-terraform-app"
}

tags = {
  Name = local.project_name
}
```

---

### 🔹 Modules

```hcl
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  name   = "my-vpc"
}

vpc_id = module.vpc.vpc_id
```

---

## 4. Why `data.` is Needed?

- **`resource`** = You own it, Terraform creates it → `aws_security_group.my_sg.id`
    
- **`data`** = You only read it, AWS already created it → `data.aws_vpc.default.id`
    

👉 Without `data.`, Terraform can’t know if you mean “create new” or “fetch existing.”

---

## 5. Real-World Analogy

- **Resource** → Buying a new car → “my car id”
    
- **Data** → Borrowing a friend’s car → “data from friend’s car id”
    

Both are cars, but **ownership matters**.

---

## 6. Useful Commands in Syntax Flow

- `terraform init` → Download provider plugins
    
- `terraform plan` → See what will be created/changed
    
- `terraform apply` → Actually create infra
    
- `terraform destroy` → Delete infra
    

---

✅ **Pro Tip**: Always structure your project cleanly → `main.tf`, `variables.tf`, `outputs.tf`, `provider.tf`, and a `scripts/` folder for any shell scripts.

---
