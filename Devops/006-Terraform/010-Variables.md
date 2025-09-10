
--- 

## 1. Declare variables (`variables.tf`)

This file tells Terraform what inputs your project expects:

```hcl
variable "project_name" {
  description = "Name of the project"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"   # optional default
}
```

👉 Here, you said:

- `project_name` is **required** (no default given).
    
- `instance_type` is **optional** (default = t2.micro).
    

---

## 2. Use variables (`main.tf`)

Now you use them in your resources:

```hcl
resource "aws_instance" "app" {
  ami           = "ami-0a12345abcd67890" # just an example
  instance_type = var.instance_type      # using variable
  tags = {
    Name = var.project_name              # using variable
  }
}
```

---

## 3. Assign values (`terraform.tfvars`)

This is the file where you **give values** to those variables:

```hcl
project_name   = "geekysiddhesh"
instance_type  = "t3.micro"
```

---

## 4. Run Terraform

Now when you run:

```bash
terraform plan
```

Terraform automatically loads values from `terraform.tfvars` (if the file exists in the same folder).

- For `project_name` → it takes `"geekysiddhesh"`
    
- For `instance_type` → it takes `"t3.micro"` (if you didn’t give here, fallback = `"t2.micro"` from default)
    

---

## ✅ Other ways to assign values

Besides `terraform.tfvars`, you can also:

1. Pass values directly in CLI:
    
    ```bash
    terraform apply -var="project_name=myapp" -var="instance_type=t3.small"
    ```
    
2. Create environment-specific files:
    
    - `dev.tfvars`
        
    - `prod.tfvars`  
        Then run:
        
    
    ```bash
    terraform apply -var-file="prod.tfvars"
    ```
    

---

### 📌 In short

- `variables.tf` → define the "input slots"
    
- `main.tf` → plug variables into resources
    
- `terraform.tfvars` → actually fill those slots with values
    

---

Yes ✅ exactly!

When you declare a variable **without a default** (like your `project_name`), Terraform treats it as **required**.

So if you run:

```bash
terraform plan
```

Terraform will stop and ask you:

```
var.project_name
  Name of the project

  Enter a value:
```

👉 At that prompt, you must type something (like `geekysiddhesh`).

---

### Example flow

```bash
terraform plan
```

Output:

```
var.project_name
  Name of the project

  Enter a value: geekysiddhesh
```

Then Terraform uses `"geekysiddhesh"` wherever you used `var.project_name` in your `.tf` files.

---

✅ If you don’t want Terraform to keep asking every time, you can:

1. Put the value in `terraform.tfvars`
    
2. Or use CLI `-var` flag
    

---

Do you want me to show you **all three ways of assigning this variable** (interactive prompt, tfvars file, CLI var) with example commands?