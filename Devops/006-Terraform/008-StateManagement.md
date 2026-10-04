# State Management

## What is Terraform State?

Terraform needs to **remember what it has already created** so it knows:
- What resources exist in AWS (or any cloud)
- What changes need to be made (add, update, delete)
- How to avoid creating duplicate resources

This "memory" is stored in a file called:

```
terraform.tfstate
```

This file lives in your project folder by default.

---

## Why is State Important?

**Example:** You create an EC2 instance with Terraform.

- Terraform saves details like `instance_id`, `IP address`, `tags` into `terraform.tfstate`.
- Next time you run `terraform apply`, Terraform **compares** your `.tf` files with the state file (and with real AWS) to decide:
  - Should I create a new EC2?
  - Should I update something?
  - Should I delete anything?

Without the state file, Terraform would have no idea what's already running in your cloud.

---

## Where is State Stored?

| Mode                               | Description                                                                         |
| ---------------------------------- | ----------------------------------------------------------------------------------- |
| **Local (default)**                | Stored in your project folder — good for learning and solo work                     |
| **Remote (recommended for teams)** | Stored in AWS S3, Azure Blob, GCS, or Terraform Cloud — safe for team collaboration |

With remote state, multiple developers can work without overwriting each other's state, and the file is backed up securely.

---

## Terraform State Workflow

```
terraform apply    → Creates resources + saves info into terraform.tfstate
terraform plan     → Compares state file with actual AWS resources → shows changes
terraform refresh  → Updates state file with the latest info from AWS
terraform state    → Commands to inspect and manually manage the state
```

---

## Important State Commands

| Command | What it Does |
|---|---|
| `terraform show` | Shows details of all resources in the state |
| `terraform state list` | Lists all resources being tracked |
| `terraform state show aws_instance.my_ec2` | Shows details of one specific resource |
| `terraform state rm aws_instance.my_ec2` | Removes a resource from state (does NOT delete it from AWS) |
| `terraform import aws_instance.my_ec2 i-123456` | Imports an existing AWS resource into Terraform state |
| `terraform refresh` | Updates state file with current cloud info |

---

## Common State Issues

| Problem | Explanation |
|---|---|
| Manual edits to `.tfstate` | ❌ Never edit the state file by hand (unless emergency) — it can corrupt state |
| State drift | When someone changes an AWS resource manually outside Terraform — state and reality go out of sync |
| Lost state file | Terraform forgets about its resources — risk of creating duplicates |

---

## Summary

- `terraform.tfstate` = Terraform's memory.
- It maps your Terraform config → real cloud resources.
- Manage it carefully: back it up, use remote state in teams.
- Commands like `state list`, `state show`, and `import` help you manage it.

---

## Importing Existing AWS Resources into Terraform

If you created a resource manually in AWS (not through Terraform), you can **import** it into Terraform state so Terraform starts managing it.

### Example: Import an existing IAM User

#### Step 1 — Identify the resource in AWS

Suppose you already created an IAM user in the AWS Console:
- IAM User Name = `demo-user`

---

#### Step 2 — Write a matching Terraform resource block

Terraform **needs a block in your `.tf` file** before you can import.

```hcl
# main.tf
resource "aws_iam_user" "demo" {
  name = "demo-user"
}
```

---

#### Step 3 — Run `terraform import`

Tell Terraform: "This resource already exists in AWS — bring it into state."

```bash
terraform import aws_iam_user.demo demo-user
```

- First part → `aws_iam_user.demo` (must match your `.tf` block)
- Second part → `demo-user` (actual name in AWS)

This creates an entry in `terraform.tfstate`. The resource itself is **not modified**.

---

#### Step 4 — Run `terraform plan`

```bash
terraform plan
```

Terraform will compare your `.tf` file with AWS. If your `.tf` file only has `name`, Terraform may show a diff because AWS has default values (like `path = "/"`) that you haven't declared.

---

#### Step 5 — Inspect the full config with `terraform show`

```bash
terraform show
```

This shows the imported resource's full configuration, including all the AWS defaults. Update your `.tf` file with any attributes you want Terraform to explicitly manage.

---

#### Step 6 — Finalize

Now your `.tfstate`, `.tf` file, and the real AWS resource are all in sync. Terraform is now managing that resource.

---

### Full Example Flow

```hcl
# main.tf
resource "aws_iam_user" "demo" {
  name = "demo-user"
  path = "/"   # added after running terraform show
}
```

```bash
terraform import aws_iam_user.demo demo-user
terraform show
terraform plan
terraform apply
```

---

### Important Notes on Import

- `terraform import` **does not create or change** the resource — it only updates the state file.
- You must write a matching resource block in your `.tf` file first.
- After importing, always run `terraform show` and update your `.tf` file to match.
- Works for EC2, Security Groups, VPCs, IAM Users, S3 Buckets, and more.
