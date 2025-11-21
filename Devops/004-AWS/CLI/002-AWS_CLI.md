
 List of **AWS CLI commands** presented in an easy-to-read, **tabular format** 

---

### **List of All EC2 Instances**

This command lists all EC2 instances with their **Instance ID**, **Name**, and **State** (running, stopped, etc.):

```bash
aws ec2 describe-instances --query "Reservations[*].Instances[*].{ID:InstanceId,Name:Tags[?Key=='Name']|[0].Value,State:State.Name}" --output table
```

---

### **Stop a Specific Instance**

Stop an EC2 instance by specifying its **Instance ID**:

```bash
aws ec2 stop-instances --instance-ids <InstanceID>
```


---

### **Start a Specific Instance**

Start an EC2 instance by specifying its **Instance ID**:

```bash
aws ec2 start-instances --instance-ids <InstanceID>
```


---

### **Stop All Running Instances**

Stop all instances that are currently running:

```bash
aws ec2 stop-instances --instance-ids $(aws ec2 describe-instances --filters Name=instance-state-name,Values=running --query "Reservations[*].Instances[*].InstanceId" --output text)
```

---

### **Restart (Reboot) an Instance**

Reboot a specific instance by providing the **Instance ID**:

```bash
aws ec2 reboot-instances --instance-ids <InstanceID>
```

---

### **Commonly Used AWS CLI Commands**

#### **Describe Instances**

List details of all instances, including IDs, states, and public IPs:

```bash
aws ec2 describe-instances --query "Reservations[*].Instances[*].{ID:InstanceId,State:State.Name,IP:PublicIpAddress}" --output table
```

#### **Check Status of a Specific Instance**

Get the current status of an instance by its **Instance ID**:

```bash
aws ec2 describe-instances --instance-ids <InstanceID> --query "Reservations[*].Instances[*].State.Name" --output text
```

#### **Terminate an Instance**

Permanently delete a specific instance by its **Instance ID**:

```bash
aws ec2 terminate-instances --instance-ids <InstanceID>
```

---

### **Additional Commands for EC2**

#### **List Instances by State (e.g., Running)**

List only instances in a specific state, like `running`:

```bash
aws ec2 describe-instances --filters Name=instance-state-name,Values=running --query "Reservations[*].Instances[*].{ID:InstanceId,Name:Tags[?Key=='Name']|[0].Value,State:State.Name}" --output table
```

#### **List Available Regions**

Get all available AWS regions:

```bash
aws ec2 describe-regions --query "Regions[*].RegionName" --output table
```

---

## Set AWS CLI Default user 

When you run

```bash
aws configure
```

it sets up credentials under the **default profile** in  
`~/.aws/credentials` and `~/.aws/config`.

If you want to add another AWS user, you can create a **named profile** like this:

```bash
aws configure --profile user2
```

Now you will have two profiles:

- `default` (first one)
    
- `user2` (second one)

To list AWS CLI profile 

```bash
aws configure list-profiles
```
    

👉 To use a specific user, you can either:

1. Pass `--profile` in commands:
    
    ```bash
    aws s3 ls --profile user2
    ```
    
2. Or set the environment variable (for current session):
    
    ```bash
    export AWS_PROFILE=user2
    aws s3 ls
    ```
    

That way you can easily switch between users without overwriting credentials.

---
