
---

# 📂 Terraform Project Structure (Text Diagram)

```
terraform-project/
│
├── main.tf           # Main resources (EC2, S3, VPC, etc.)
├── variables.tf      # All input variables (type, default, description)
├── outputs.tf        # Output values (public IP, instance ID, etc.)
├── provider.tf       # Provider config (AWS, region, credentials)
├── terraform.tfvars  # Actual values for variables (ignored in git)
├── versions.tf       # Required provider & Terraform version constraints
│
├── scripts/          # User data / shell scripts
│   └── install_nginx.sh
│
├── modules/          # (Optional) Reusable modules
│   └── ec2/
│       ├── main.tf
│       ├── variables.tf
│       ├── outputs.tf
│
└── README.md         # Documentation of project
```

---

## 🔹 What goes inside each file?

- **`provider.tf`** → define which provider & region
    
    ```hcl
    provider "aws" {
      region = var.aws_region
    }
    ```
    
- **`variables.tf`** → define input values
    
    ```hcl
    variable "aws_region" {
      type        = string
      default     = "us-east-1"
      description = "AWS region to deploy resources"
    }
    ```
    
- **`terraform.tfvars`** → give actual values (never commit secrets!)
    
    ```hcl
    aws_region = "ap-south-1"
    instance_type = "t2.micro"
    ```
    
- **`outputs.tf`** → print useful values after `apply`
    
    ```hcl
    output "ec2_public_ip" {
      value = aws_instance.my_ec2.public_ip
    }
    ```
    
- **`versions.tf`** → lock Terraform & provider versions
    
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
    
- **`scripts/`** → bash scripts like `install_nginx.sh`
    

---

✅ This way:

- `main.tf` stays clean.
    
- Variables/outputs/providers are modular.
    
- Scripts are separate (not hardcoded inside `.tf`).
    

---