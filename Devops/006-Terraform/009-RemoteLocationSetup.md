
---


# 🟢 Step 1: Why Bootstrap?

Problem: To use remote state, you first need S3 + DynamoDB.  
But if you use Terraform backend directly without them existing, Terraform will fail.

👉 Solution:

- First run a **bootstrap Terraform project** with **local state**.
    
- It creates **S3 + DynamoDB**.
    
- Then migrate your main project to use that backend.
    

---

# 🟢 Step 2: Terraform Code to Create S3 + DynamoDB

Create a folder: `bootstrap/`  
Inside `main.tf`:

```hcl
provider "aws" {
  region = "ap-south-1"
}

# ------------------------
# S3 Bucket for State
# ------------------------
resource "aws_s3_bucket" "tf_state" {
  bucket = "terraform-state-siddhesh"  # must be globally unique
}

resource "aws_s3_bucket_versioning" "tf_state" {
  bucket = aws_s3_bucket.tf_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "tf_state" {
  bucket = aws_s3_bucket.tf_state.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# ------------------------
# DynamoDB Table for Locking
# ------------------------
resource "aws_dynamodb_table" "tf_locks" {
  name         = "terraform-locks"
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "LockID"
  attribute {
    name = "LockID"
    type = "S"
  }
}
```

---

# 🟢 Step 3: Apply Bootstrap Project

```bash
cd bootstrap
terraform init
terraform apply
```

✅ This creates:

- S3 bucket (`terraform-state-siddhesh`) with versioning + encryption.
    
- DynamoDB table (`terraform-locks`) for locking.
    

---

# 🟢 Step 4: Use It in Main Project

Now in your main project (e.g., EC2 project), configure backend:

`backend.tf`

```hcl
terraform {
  backend "s3" {
    bucket         = "terraform-state-siddhesh"
    key            = "dev/terraform.tfstate"
    region         = "ap-south-1"
    dynamodb_table = "terraform-locks"
    encrypt        = true
  }
}
```

Then run:

```bash
terraform init
```

Terraform will **migrate local state → remote state**.

---

# 🟢 Step 5: Best Practice

- Keep **bootstrap project separate** from main infra.
    
- Never delete bootstrap — it manages your state infra.
    
- You can later extend bootstrap to create **state buckets per environment** (`dev`, `stage`, `prod`).
    

---

# 🟢 Text Diagram

```
Terraform (bootstrap project)
       |
       |--> Creates S3 bucket (state storage)
       |--> Creates DynamoDB table (state locking)

Terraform (main project)
       |
       |--> Uses backend "s3" pointing to bucket + table
       |
       |--> Creates Infra (EC2, VPC, SG, etc.)
```

---
