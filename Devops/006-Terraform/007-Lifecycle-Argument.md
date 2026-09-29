# 007 — Lifecycle & Meta-Arguments

Terraform gives you **meta-arguments** — special options inside resource blocks — to control *how* and *when* resources are created, updated, or destroyed.

---

## 1. `depends_on` — Force Creation Order

By default, Terraform automatically figures out the order to create resources. But sometimes it can't detect the relationship. `depends_on` lets you **explicitly tell Terraform**: create this resource only after that one.

> **Analogy:** You can't move into a house before it's built. The move depends on the build.

```hcl
resource "aws_security_group" "my_sg" {
  name = "terraform-sg"
}

resource "aws_instance" "my_ec2" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type

  vpc_security_group_ids = [aws_security_group.my_sg.id]

  # Force Terraform to create the SG first
  depends_on = [aws_security_group.my_sg]

  tags = {
    Name = "Terraform-EC2"
  }
}
```

Even though the SG is already referenced in `vpc_security_group_ids`, complex setups sometimes still need `depends_on` to be safe.

---

## 2. `count` — Create Multiple Identical Resources

Instead of copying the same resource block 5 times, just use `count`.

> **Analogy:** Order 3 pizzas by changing the count — not by writing the order 3 separate times.

```hcl
resource "aws_instance" "web" {
  count         = 2                       # Creates 2 EC2 instances
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  key_name      = var.key_pair_name
  vpc_security_group_ids = [aws_security_group.my_sg.id]

  tags = {
    Name = "Web-${count.index + 1}"       # Gives Web-1, Web-2
  }
}
```

- `count.index` starts from `0`.
- The resources are stored in a **list**: `aws_instance.web[0]`, `aws_instance.web[1]`.

---

## 3. `for_each` — Create Multiple Named Resources

Use `for_each` when you want resources with **distinct names** (not just numbers), using a map or set.

> **Analogy:** Naming your kids Alice and Bob — instead of calling them Child-1 and Child-2.

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
  instance_type = each.value              # t2.micro or t2.small
  key_name      = var.key_pair_name
  vpc_security_group_ids = [aws_security_group.my_sg.id]

  tags = {
    Name = each.key                       # EC2 named app1, app2
  }
}
```

- `each.key` = the map key (e.g., `app1`, `app2`)
- `each.value` = the map value (e.g., `t2.micro`, `t2.small`)
- Resources are stored in a **map**: `aws_instance.servers["app1"]`, `aws_instance.servers["app2"]`.

---

## 4. `lifecycle` — Control Updates and Deletions

The `lifecycle` block gives you fine-grained control over how Terraform handles resource replacements and deletions.

### a) `create_before_destroy` — Zero-Downtime Replacement

Normally, when a resource needs to be replaced (e.g., you changed the AMI), Terraform destroys the old one first, then creates the new one. This causes downtime.

With `create_before_destroy = true`, Terraform creates the new resource **first**, then destroys the old one.

```hcl
resource "aws_instance" "my_ec2" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type

  lifecycle {
    create_before_destroy = true
  }
}
```

> Useful for: EC2 instances, Load Balancers — anything where downtime is not acceptable.

---

### b) `prevent_destroy` — Protect Critical Resources

Prevents a resource from being accidentally deleted, even if you run `terraform destroy`.

```hcl
resource "aws_s3_bucket" "logs" {
  bucket = "my-prod-logs"

  lifecycle {
    prevent_destroy = true
  }
}
```

> Even `terraform destroy` won't delete this bucket — you'd have to remove `prevent_destroy = true` first.

> Useful for: Production databases, S3 buckets with important data.

---

## Summary Cheat Sheet

| Meta-Argument | Use Case |
|---|---|
| `depends_on` | Force a specific creation order |
| `count` | Create N identical resources (accessed by index) |
| `for_each` | Create multiple named resources from a map/set |
| `lifecycle.create_before_destroy` | Replace resources without downtime |
| `lifecycle.prevent_destroy` | Protect critical resources from accidental deletion |

---

## Outputs with `count` and `for_each`

The way you access outputs differs depending on whether you used `count` or `for_each`.

### Outputs with `count` (returns a list)

```hcl
resource "aws_instance" "web" {
  count         = 2
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type
  # ...

  tags = {
    Name = "Web-${count.index + 1}"
  }
}

output "web_instance_ids" {
  value = aws_instance.web[*].id         # list of all instance IDs
}

output "web_public_ips" {
  value = aws_instance.web[*].public_ip  # list of all public IPs
}
```

`[*]` means "give me this attribute from all items". Output looks like:

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

### Outputs with `for_each` (returns a map)

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
  # ...

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

Output looks like:

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

## Key Difference: `count` vs `for_each`

| | `count` | `for_each` |
|---|---|---|
| **Output type** | List `["ip1", "ip2"]` | Map `{ "app1" = "ip1", "app2" = "ip2" }` |
| **Access style** | `resource[0]`, `resource[1]` | `resource["app1"]`, `resource["app2"]` |
| **Best for** | Identical resources you number | Named resources with different configs |
