
---

# 📒 Terraform Lifecycle & Meta-Arguments

Terraform gives us **extra options (meta-arguments)** inside resources to control **how & when resources are created**.

---

## 1️⃣ `depends_on`

- **What it does**: Forces Terraform to create one resource **after another**, even if Terraform could infer the dependency automatically.
    
- **Why needed**: Sometimes Terraform cannot detect the relationship.
    
- **Analogy**: You can’t move into a house before it’s built 🏠 → dependency.
    

### Example:

```hcl
resource "aws_security_group" "my_sg" {
  name = "terraform-sg"
}

resource "aws_instance" "my_ec2" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type

  vpc_security_group_ids = [aws_security_group.my_sg.id]

  # Explicit dependency
  depends_on = [aws_security_group.my_sg]

  tags = {
    Name = "Terraform-EC2"
  }
}
```

👉 Even though SG is already referenced, sometimes with complex resources, you **must** force Terraform with `depends_on`.

---

## 2️⃣ `count`

- **What it does**: Creates **multiple copies** of the same resource.
    
- **Why needed**: Instead of repeating code for 5 EC2s, just use `count`.
    
- **Analogy**: Order 3 pizzas 🍕 by changing the count instead of writing the recipe 3 times.
    

### Example:

```hcl
resource "aws_instance" "web" {
  count         = 2                     # create 2 EC2 instances
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  key_name      = var.key_pair_name
  vpc_security_group_ids = [aws_security_group.my_sg.id]

  tags = {
    Name = "Web-${count.index + 1}"     # gives Web-1, Web-2
  }
}
```

👉 `count.index` starts from `0`.

---

## 3️⃣ `for_each`

- **What it does**: Create multiple resources from a **map** or **set**.
    
- **Why needed**: When you want **named resources**, not just numbered.
    
- **Analogy**: Naming your kids instead of numbering them (Child-1, Child-2 vs Alice, Bob).
    

### Example (multiple EC2s with custom names):

```hcl
variable "instances" {
  default = {
    app1 = "t2.micro"
    app2 = "t2.small"
  }
}

resource "aws_instance" "servers" {
  for_each      = var.instances
  ami           = data.aws_ami.ubuntu.id
  instance_type = each.value
  key_name      = var.key_pair_name
  vpc_security_group_ids = [aws_security_group.my_sg.id]

  tags = {
    Name = each.key   # EC2 named app1, app2
  }
}
```

👉 `each.key` = map key (app1/app2)  
👉 `each.value` = value (instance type)

---

## 4️⃣ `lifecycle`

Controls how Terraform manages updates/deletes.

### a) `create_before_destroy`

- Ensures new resource is created **before** old one is destroyed.
    
- Useful for resources like **Load Balancers, EC2**, where downtime is not acceptable.
    

```hcl
resource "aws_instance" "my_ec2" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type

  lifecycle {
    create_before_destroy = true
  }
}
```

👉 Prevents downtime: launches new EC2 first, then removes old.

---

### b) `prevent_destroy`

- Protects critical resources from accidental deletion.
    

```hcl
resource "aws_s3_bucket" "logs" {
  bucket = "my-prod-logs"

  lifecycle {
    prevent_destroy = true
  }
}
```

👉 Even if you run `terraform destroy`, this bucket won’t be deleted unless you remove this rule.

---

# 🔥 Summary (Cheat-Sheet)

|Meta-Arg|Use Case|
|---|---|
|`depends_on`|Force order of creation|
|`count`|Create N identical resources (indexed)|
|`for_each`|Create multiple named resources from map/set|
|`lifecycle.create_before_destroy`|Avoid downtime (replace safely)|
|`lifecycle.prevent_destroy`|Protect critical resources|

---

## 🟢 1. Output with `count`

If you create resources using `count`, Terraform stores them in a **list**.

### Example:

```hcl
resource "aws_instance" "web" {
  count         = 2
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  key_name      = var.key_pair_name
  vpc_security_group_ids = [aws_security_group.my_sg.id]

  tags = {
    Name = "Web-${count.index + 1}"
  }
}

output "web_instance_ids" {
  value = aws_instance.web[*].id   # list of instance IDs
}

output "web_public_ips" {
  value = aws_instance.web[*].public_ip   # list of public IPs
}
```

👉 `[*]` means “give me all values” → You’ll get something like:

```hcl
web_instance_ids = [
  "i-0abc123456789def0",
  "i-0def456789abc1234"
]

web_public_ips = [
  "13.234.22.11",
  "15.206.88.42"
]
```

---

## 🟢 2. Output with `for_each`

If you create resources using `for_each`, Terraform stores them in a **map** (key → value).

### Example:

```hcl
variable "instances" {
  default = {
    app1 = "t2.micro"
    app2 = "t2.small"
  }
}

resource "aws_instance" "servers" {
  for_each      = var.instances
  ami           = data.aws_ami.ubuntu.id
  instance_type = each.value
  key_name      = var.key_pair_name
  vpc_security_group_ids = [aws_security_group.my_sg.id]

  tags = {
    Name = each.key
  }
}

output "server_instance_ids" {
  value = { for k, v in aws_instance.servers : k => v.id }
}

output "server_public_ips" {
  value = { for k, v in aws_instance.servers : k => v.public_ip }
}
```

👉 You’ll get output like:

```hcl
server_instance_ids = {
  "app1" = "i-0a1b2c3d4e5f6g7h8"
  "app2" = "i-09z8y7x6w5v4u3t2s"
}

server_public_ips = {
  "app1" = "18.212.55.23"
  "app2" = "3.110.99.45"
}
```

---

## 📌 Key Difference

- `count` → outputs as a **list** (`["ip1", "ip2"]`)
    
- `for_each` → outputs as a **map** (`{ "app1" = "ip1", "app2" = "ip2" }`)
    

---
