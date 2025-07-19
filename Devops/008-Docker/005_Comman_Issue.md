

---

## Concepts of User: 
---

## 👤 What is a "user" in Linux?

A **user** is simply a person or service that logs into or uses the system.

Linux uses **user accounts** to control:

- Who can access the system
    
- What actions they can perform
    
- Which files they can access
    

---

## ✅ Types of Users in Linux

### 1. **Root User** (Admin 👑)

- Username: `root`
    
- Has **full access** to everything (like `Administrator` in Windows)
    
- Can install software, manage other users, access any file
    

### 2. **Normal Users**

- Example: `ubuntu`, `siddhesh`, `john`
    
- Can only access their **own files**
    
- Need `sudo` (superuser do) to perform admin actions
    

### 3. **System Users / Service Accounts**

- Created by the system automatically
    
- Used by services like `mysql`, `www-data`, `docker`
    
- They don’t log in like human users
    
- Help manage background processes and services
    

---

## 📦 Where are these users stored?

All user info is stored in the file:

```bash
/etc/passwd
```

You can view it by running:

```bash
cat /etc/passwd
```

Each line shows a user account, like:

```
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
ubuntu:x:1000:1000:Ubuntu:/home/ubuntu:/bin/bash
```

---

## 🧠 How many default users are there?

### On a fresh Ubuntu EC2 instance:

You'll typically see:

| Username                                       | Purpose                             |
| ---------------------------------------------- | ----------------------------------- |
| `root`                                         | Admin user                          |
| `ubuntu`                                       | Default login user (you use this)   |
| System users like `daemon`, `syslog`, `nobody` | Used internally by system processes |

So, **you’ll see 20–30 users**, but **only 1-2 are real human users**.

---

## 🔐 Important Commands

|Command|Purpose|
|---|---|
|`whoami`|Shows your current username|
|`id`|Shows your UID, GID, and groups|
|`cat /etc/passwd`|Shows all users|
|`sudo`|Run command as root|
|`adduser name`|Add a new user|

---

## ✅ Example

Run:

```bash
whoami
```

You’ll get:

```
ubuntu
```

This means: You’re logged in as the `ubuntu` user (a normal user, not root).

---

## When you launch an EC2 Ubuntu instance:

- AWS automatically creates a **default user**:
    
    - For Ubuntu: it’s `ubuntu`
        
- This user has **sudo privileges**, which means you can act like `root` using `sudo`
    

---

## ✅ So how do you do root-level tasks?

You simply use:

```bash
sudo <command>
```

For example:

```bash
sudo apt update
sudo docker ps
```

Or switch to root shell:

```bash
sudo -i
```

Now you’re **logged in as root**, and the prompt will change to:

```
root@ip-xxx-xxx-xxx-xxx:~#
```

To exit 
```
exit
```

---

## 🛡️ Why can't we log in as root directly?

This is done for **security reasons**:

- Prevents accidental system damage
    
- Reduces attack surface if someone gets into your server
    

---

## 🚪 Can you enable root login?

Yes, but **not recommended**.

To enable root SSH login:

1. Set a password for root:
    
    ```bash
    sudo passwd root
    ```
    
2. Edit SSH config:
    
    ```bash
    sudo nano /etc/ssh/sshd_config
    ```
    
3. Change:
    
    ```
    PermitRootLogin prohibit-password
    ```
    
    to:
    
    ```
    PermitRootLogin yes
    ```
    
4. Restart SSH:
    
    ```bash
    sudo systemctl restart ssh
    ```
    

🛑 **Warning:** This can be risky. Better to use `sudo` instead.

---

## 🧠 Two Ways to Use Root Power in Linux

|Method|Description|
|---|---|
|🔑 **Act like root (use `sudo`)**|You are still a **normal user**, but temporarily **borrow root's power** to run a command|
|👑 **Login as root (become root)**|You are **fully logged in as root user** — 100% access, 100% responsibility|

---

## 🔐 1. Acting like root (using `sudo`)

- You are logged in as `ubuntu` (or any normal user)
    
- When you run:
    

```bash
sudo apt update
```

It means:

> "Let me run this one command **as root**, but keep me as my normal user."

✅ This is **safer** because:

- You only use root power when needed
    
- You can’t accidentally break things by running other commands
    

💡 Tip: You can run a full root shell for multiple commands like this:

```bash
sudo -i
```

---

## 👑 2. Logging in as root

You are **fully logged in as the root user**, like this:

```bash
root@ip-172-xx-xx-xx:~#
```

- Every command you run has **full permissions**
    
- No need to type `sudo`
    
- High power = High risk ⚠️
    

---

## 📊 Key Differences

|Feature|`sudo` (Act like root)|`root` login|
|---|---|---|
|Who are you?|Normal user with root power|You _are_ root|
|Need to type `sudo`?|Yes|No|
|Safer?|✅ Yes|❌ Risky|
|Session limited?|Only root for that command|Full root access|
|Recommended?|✅ Best Practice|❌ Not recommended for everyday work|

---

## 🧪 Real-World Analogy

| Scenario     | Analogy                                                                                       |
| ------------ | --------------------------------------------------------------------------------------------- |
| `sudo`       | You’re a staff member using a master key **only when needed**                                 |
| `root` login | You are the **building owner** walking around with full access all the time — no restrictions |
    
--- 


