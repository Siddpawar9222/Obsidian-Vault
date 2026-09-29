# 002 — Terraform vs Ansible

## The Core Difference in One Line

- **Terraform** = **Build** the infrastructure (create servers, networks, databases)
- **Ansible** = **Configure** the infrastructure (install software, set up the server)

---

## Terraform — Infrastructure as Code (IaC)

- **Purpose:** Provisioning infrastructure — creating EC2 instances, VPCs, S3 buckets, load balancers, etc.
- **Approach:** **Declarative** — you tell Terraform *what you want*, and it figures out *how to get there*.
- **Example:** "I want 2 EC2 instances." → Terraform checks the current state and creates them if they don't exist.

> Think of Terraform like an **Architect** 🏗️ — it designs and builds the house (infrastructure).

---

## Ansible — Configuration Management (CFM)

- **Purpose:** Configure and manage *already existing* infrastructure.
- **Approach:** **Procedural** — you write step-by-step instructions.
- **Example:** "On this EC2, install Nginx, set Java to version 17, update system packages." → Ansible runs those steps one by one.

> Think of Ansible like an **Interior Designer** 🛋️ — it decorates and sets up the house (server config).

---

## Key Differences

| Feature | Terraform 🏗️ | Ansible ⚙️ |
|---|---|---|
| **Main Use** | Create infrastructure (VMs, networks) | Configure infrastructure (software, patches) |
| **Approach** | Declarative — define final state | Procedural — step-by-step tasks |
| **State Tracking** | Yes — keeps a `terraform.tfstate` file | No — just executes tasks each time |
| **Example** | Create 3 EC2s with a load balancer | Install Nginx on those EC2s |
| **Best For** | Infrastructure provisioning | Configuration + app deployment |

---

## Using Them Together (Best Practice)

The most common real-world workflow:

1. **Terraform** → creates 2 AWS EC2 servers
2. **Ansible** → installs Docker + deploys your Spring Boot app inside those servers

This way, infrastructure and configuration are cleanly separated.

---

## Can Terraform Do Configuration Too?

Yes, Terraform has **provisioners** (`remote-exec`, `file`) that can run scripts after a resource is created.

```hcl
resource "aws_instance" "web" {
  ami           = "ami-xyz"
  instance_type = "t2.micro"

  provisioner "remote-exec" {
    inline = [
      "sudo apt update -y",
      "sudo apt install -y nginx"
    ]
  }
}
```

> ⚠️ Using provisioners in Terraform is **not recommended** for large setups. Terraform's main job is infrastructure, not software installation. Use Ansible for that.

---

## When to Use What

| Scenario | Tool |
|---|---|
| Small demo / POC | Terraform alone (create EC2 + install Nginx) |
| Production setup | Terraform for infra + Ansible (or Chef/Puppet) for config |
