

---

# 📒 Terraform Terminologies

## 1. Provider

- **Definition**: Plugin that tells Terraform how to interact with a specific cloud/service (AWS, Azure, GCP, GitHub, etc.).
    
- **Example**: `provider "aws" { region = "us-east-1" }`
    
- **Analogy**: Like a driver for your printer — without it, the computer can’t talk to the printer.
    

---

## 2. Resource

- **Definition**: The main block that creates/manages infrastructure (VM, EC2, VPC, S3, etc.).
    
- **Example**:
    
    ```hcl
    resource "aws_instance" "my_ec2" {
      ami           = "ami-xxxx"
      instance_type = "t2.micro"
    }
    ```
    
- **Analogy**: A “thing” you actually want to build — like a house, car, or EC2 instance.
    

---

## 3. Data Source (`data`)

- **Definition**: Fetches already existing information/resources from the provider without creating new ones.
    
- **Example**:
    
    ```hcl
    data "aws_vpc" "default" {
      default = true
    }
    ```
    
- **Analogy**: Like reading Google Maps to see existing roads instead of building a new road.
    

---

## 4. Variables (`variable`)

- **Definition**: Inputs you can parameterize instead of hardcoding values.
    
- **Example**:
    
    ```hcl
    variable "instance_type" { default = "t2.micro" }
    ```
    
- **Analogy**: Ingredients list for a recipe — you can swap “sugar = 1 spoon” with “sugar = 2 spoons”.
    

---

## 5. Outputs (`output`)

- **Definition**: Show useful values after applying (e.g., public IP, instance ID).
    
- **Example**:
    
    ```hcl
    output "public_ip" {
      value = aws_instance.my_ec2.public_ip
    }
    ```
    
- **Analogy**: Like a receipt after shopping — shows what you bought.
    

---

## 6. State

- **Definition**: Terraform keeps track of resources in a `terraform.tfstate` file.
    
- **Purpose**: Knows what is already created → avoids creating duplicates.
    
- **Analogy**: Like a to-do checklist — marks what is already done.
    

---

## 7. Plan

- **Command**: `terraform plan`
    
- **Definition**: Shows what Terraform will do before actually doing it.
    
- **Analogy**: Like a blueprint before constructing a house.
    

---

## 8. Apply

- **Command**: `terraform apply`
    
- **Definition**: Actually provisions/creates infrastructure as per the plan.
    
- **Analogy**: Construction workers actually building from the blueprint.
    

---

## 9. Destroy

- **Command**: `terraform destroy`
    
- **Definition**: Deletes the resources Terraform created.
    
- **Analogy**: Bulldozers removing the house you built.
    

---

## 10. Modules

- **Definition**: Reusable group of resources (like functions in programming).
    
- **Analogy**: Instead of writing a cake recipe every time, you reuse a cookbook recipe.
    

---

## 11. Interpolation

- **Definition**: Using values of one resource inside another (`${}` syntax, or newer direct reference).
    
- **Example**:
    
    ```hcl
    vpc_id = data.aws_vpc.default.id
    ```
    
- **Analogy**: Like saying “use the address from Google Maps” instead of typing the address manually.
    

---

## 12. Backend

- **Definition**: Where the state file is stored (local, S3, remote, etc.).
    
- **Analogy**: Like storing your receipts in a safe box instead of keeping them in your pocket.
    

---

## 13. Provisioner

- **Definition**: Run scripts/commands on resources after creation.
    
- **Example**: Install Nginx via `remote-exec`.
    
- **Analogy**: Like moving into a new house and arranging furniture.
    

---

## 14. Workspace

- **Definition**: Isolated state environments (e.g., dev, test, prod).
    
- **Analogy**: Separate apartments in the same building.
    

---

✅ **Most Frequently Used in AWS Projects**:  
`provider`, `resource`, `data`, `variable`, `output`, `state`, `plan`, `apply`.

---

