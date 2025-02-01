
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