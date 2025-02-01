
---

An **Elastic IP** in AWS is a **static, public IPv4 address** that remains fixed and does not change when you stop or restart your EC2 instance. It's designed to make it easier to connect to your EC2 instance without worrying about the public IP changing.

---

### **Why Elastic IP is Useful**

1. **Fixed Address**:
    
    - When you stop and restart an EC2 instance, its default public IP address changes. If you're using tools like [[SSH]], MobaXterm, or hosting a website, you'll need to update the new IP address each time.
    - Elastic IP solves this problem by giving your instance a permanent public IP.
    
2. **Flexible**:
    
    - You can detach an Elastic IP from one instance and attach it to another. This is helpful for replacing or scaling your instance while keeping the same IP address.

---

### **How Elastic IP Works**

1. **Allocation**:
    
    - AWS gives you an Elastic IP from their pool of public IP addresses.
    - You can allocate one Elastic IP for free (as long as it's associated with a running instance).
    
2. **Association**:
    
    - You associate the Elastic IP with your EC2 instance. This replaces the default public IP.
    - Once associated, the Elastic IP becomes the instance's public IP.
    
3. **Static Behavior**:
    
    - The Elastic IP stays the same until you manually release it or associate it with a different instance.

---

### **Key Features**

1. **Static Public IP**:
    
    - Elastic IP is static, meaning it won't change even if you stop/start the instance.
    - Example: `54.210.45.123`.
    
2. **DNS Compatibility**:
    
    - After associating an Elastic IP, AWS provides a **Public IPv4 DNS** that resolves to this IP:
        
        ```
        ec2-54-210-45-123.compute-1.amazonaws.com
        ```
        
3. **Free if Used**:
    
    - If an Elastic IP is **associated with a running instance**, it is free.
    - AWS charges you for unused Elastic IPs to encourage efficient resource usage.

---

### **When Should You Use Elastic IP?**

- **Long-Term Access**:
    - For consistent access to your EC2 instance, such as [[SSH]], hosting websites, or connecting via MobaXterm.
- **Custom Domains**:
    - When you want to associate a custom domain name (like `myapp.com`) to your instance.

---

### **How to Allocate and Associate Elastic IP**

1. **Allocate an Elastic IP**:
    
    - Go to the AWS **EC2 Dashboard**.
    - Click **Elastic IPs** in the left-hand menu.
    - Click **Allocate Elastic IP Address** and confirm.
    
2. **Associate the Elastic IP**:
    
    - Select the Elastic IP in the dashboard.
    - Click **Actions → Associate Elastic IP Address**.
    - Choose the EC2 instance and click **Associate**.
    
3. **Access Your Instance**:
    
    - Use the Elastic IP to connect to your instance in tools like MobaXterm or [[SSH]].

---

### **Benefits of Elastic IP**

1. **Avoid IP Changes**: No need to update tools or configurations after restarting your instance.
2. **Flexibility**: Move the IP between instances easily.
3. **Reliability**: Ensures your services (e.g., web servers) remain accessible without downtime.