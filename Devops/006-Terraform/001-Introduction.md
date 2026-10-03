
# Introduction to Terraform

## What Problem Existed Before Terraform?

Before Terraform, setting up cloud infrastructure (like EC2, VPC, S3 on AWS) was done either **manually through the AWS Console** (click, click, click) or through **custom scripts** (bash, Python, AWS CLI).

### Problems with that approach

| Problem            | Explanation                                                             |
| ------------------ | ----------------------------------------------------------------------- |
| Manual errors      | One wrong click in AWS Console can break things                         |
| No repeatability   | You can't easily reuse your setup — you have to repeat steps every time |
| Hard to remember   | Complex configs are hard to remember or share with teammates            |
| No version control | You can't track changes like you do with code (`git diff`, `git log`)   |
| Hard to test       | You can't safely test infrastructure changes before applying them       |

---

## What is Terraform?

**Terraform** is an **Infrastructure as Code (IaC)** tool made by HashiCorp.

> It means: you write code in `.tf` files to define your cloud infrastructure.

Think of it as a **blueprint for the cloud — written in code**.

---

## What Problems Does Terraform Solve?

| Terraform Feature | What it Gives You                                                |
| ----------------- | ---------------------------------------------------------------- |
| Repeatability     | Recreate the same infrastructure 1000 times (dev, staging, prod) |
| Version Control   | Track and roll back changes using Git                            |
| Automation        | Just run `terraform apply` — everything gets created             |
| Consistency       | Same config always gives the same result — no manual mistakes    |
| Collaboration     | Teams can share and review infrastructure like they do for code  |

---

## Real-World Example: Without vs With Terraform

**Scenario:** An e-commerce company needs to host a web app on AWS.

### ❌ Without Terraform
1. DevOps engineer logs into AWS Console.
2. Manually creates an EC2 instance, opens port 80 in security group, installs Node.js via SSH.
3. Next month, another developer needs the same setup — the engineer has to do it all again manually.
4. Mistakes happen → app crashes in production.

### ✅ With Terraform
1. DevOps writes a `.tf` file:

```hcl
resource "aws_instance" "web" {
  ami           = "ami-0abcdef1234567890"
  instance_type = "t2.micro"
}
```

2. Pushes it to Git.
3. Any teammate can now run:

```bash
terraform init
terraform apply
```

4. The exact same server is created in minutes — every time.

---

## Real Companies Using Terraform

| Company | How They Use It |
|---|---|
| **Netflix** | Provisions thousands of EC2 instances for streaming |
| **Airbnb** | Manages dev/staging/prod environments easily |
| **Spotify** | Builds and destroys infra quickly for testing new features |

---

## Summary

| Question | Answer |
|---|---|
| What is Terraform? | A tool to define and manage cloud infrastructure using code |
| Why use it? | Automation, consistency, repeatability, error-free setups |
| What problem it solves? | Avoids manual setups and human errors, improves team collaboration |
| Real-world example? | Set up EC2, configure security — all from code |

---

## Terraform History (Timeline)

### 2014 — Launched
- Created by **HashiCorp** as an **open-source** IaC tool.
- HashiCorp is known for DevOps tools like Vagrant, Consul, Vault, Nomad, and Packer.

### 2014–2017 — Rapid Growth
- Terraform became very popular because it supported **multiple cloud providers** (AWS, Azure, GCP).
- Other tools like CloudFormation only worked with AWS — Terraform worked everywhere.
- Fully open-source, anyone could use it freely.

### 2017 — Terraform Enterprise
- HashiCorp launched a **paid enterprise version** for large companies needing team collaboration, governance, role-based access, audit logs, and private registries.
- The core Terraform stayed open-source.

### 2021–2023 — License Change (BSL)
- License changed from **MPL (Mozilla Public License)** to **BSL (Business Source License)**.
- You can still use Terraform freely for personal, learning, or internal company use.
- But you **cannot build a commercial product** that directly competes with Terraform.

### 2023 — IBM Acquires HashiCorp
- **IBM acquired HashiCorp** to strengthen its cloud and hybrid cloud DevOps toolset.
- This caused community concern about vendor lock-in.

### 2023 — OpenTofu Fork Created
- Due to the license change, the open-source community created **OpenTofu** under the Linux Foundation.
- OpenTofu = a fully open-source, free-forever alternative to Terraform.

**Today you have two choices:**
- **Terraform** (by HashiCorp/IBM) — BSL license
- **OpenTofu** (community-driven) — fully open-source

```
2014       Terraform launched by HashiCorp (Open Source)
2014–2017  Became popular (multi-cloud, free)
2017       Terraform Enterprise introduced (paid)
2021–2023  License changed to BSL (limited commercial use)
2023       IBM acquired HashiCorp
2023       OpenTofu fork created (Linux Foundation, fully open-source)
```

> **Note:** IBM now owns Ansible, Terraform, and Red Hat.