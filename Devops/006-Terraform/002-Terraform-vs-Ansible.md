

--- 



## ⚔️ Terraform vs Ansible

### 🔹 Terraform (IaC → Infrastructure as Code)

- Purpose → **Provisioning Infrastructure** (create servers, databases, networks, load balancers, etc.).
    
- Works in a **declarative way** → you tell Terraform _what you want_ (final state), and Terraform figures out _how to get there_.
    
- Example:
    
    - You say → "I want 2 EC2 instances with Nginx installed."
        
    - Terraform checks the current state and makes changes only if needed.
        

➡️ **Think of Terraform like an Architect** 🏗️ → it designs and builds the house (infrastructure).

---

### 🔹 Ansible (CFM → Configuration Management)

- Purpose → **Configure and Manage** already existing infrastructure.
    
- Works in a **procedural way** (though it supports declarative too) → you write step-by-step instructions for configuration.
    
- Example:
    
    - You say → "On this EC2, install Nginx, set Java version to 17, update system packages."
        
    - Ansible executes each step on the server.
        

➡️ **Think of Ansible like an Interior Designer** 🛋️ → it decorates and configures the house (server setup).

---

### 🔑 Key Differences

|Feature|Terraform 🏗️ (IaC)|Ansible ⚙️ (CFM)|
|---|---|---|
|**Main Use**|Create infrastructure (VMs, networks)|Configure infrastructure (software, patches)|
|**Approach**|Declarative → define final state|Procedural (step-by-step tasks)|
|**State Management**|Keeps track of state (terraform.tfstate)|No state file, just executes tasks|
|**Example**|Create 3 EC2s with load balancer|Install Nginx on those EC2s|
|**Best For**|Infrastructure provisioning|Configuration + app deployment|

---

✅ **Together**:

- Use **Terraform** to create servers.
    
- Use **Ansible** to install software and configure them.
    

👉 Example:

1. Terraform → creates 2 AWS EC2 servers.
    
2. Ansible → installs Docker + deploys your Spring Boot app inside the servers.
    

---


### 🔹 1. Using **Terraform only**

- Terraform has something called **provisioners** (like `remote-exec`, `file`).
    
- You can write a script to install Nginx when the EC2 instance is created.
    

Example (simple idea, not full code):

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

⚠️ But: using provisioners in Terraform is not recommended for big setups, because Terraform’s main job is **infrastructure**, not software installation.

---

### 🔹 2. Using **Terraform + Ansible (better way)**

- Terraform → creates the EC2 instances.
    
- Ansible → connects to those EC2s and installs Nginx, sets Java version, configures apps, etc.
    
- This way → you separate **infra** and **configuration** cleanly.
    

---

👉 **Real-world practice**:

- Small demo / POC → You can use Terraform alone to create EC2 + install Nginx.
    
- Production → Use Terraform for infra + Ansible (or Chef/Puppet) for configuration.
    

---
