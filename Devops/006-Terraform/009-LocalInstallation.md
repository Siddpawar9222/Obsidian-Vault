
---

## ⚡ Install Terraform on Windows 10

### **Step 1: Download Terraform**

1. Go to the official Terraform download page:  
    👉 [https://developer.hashicorp.com/terraform/downloads](https://developer.hashicorp.com/terraform/downloads)
    
2. Select **Windows (AMD64)** for 64-bit Windows.  
    (Most modern systems are 64-bit. If not sure → press `Win + Pause/Break` to check system type).
    

---

### **Step 2: Extract the ZIP file**

1. The download gives you a `.zip` file (e.g., `terraform_1.8.5_windows_amd64.zip`).
    
2. Extract it → inside you will see **terraform.exe**.
    
3. Move `terraform.exe` to a safe folder, e.g.:  
    `C:\terraform\`
    

---

### **Step 3: Add Terraform to PATH**

1. Press `Win + R`, type `sysdm.cpl` → Enter.
    
2. Go to **Advanced** → **Environment Variables**.
    
3. Under **System Variables**, find and select `Path` → click **Edit**.
    
4. Click **New** → add the path where `terraform.exe` is located, e.g.:
    
    ```
    C:\terraform\
    ```
    
5. Click OK on all windows.
    

---

### **Step 4: Verify Installation**

1. Open **Command Prompt (cmd)** or **PowerShell**.
    
2. Run:
    
    ```
    terraform -version
    ```
    
3. You should see something like:
    
    ```
    Terraform v1.8.5
    on windows_amd64
    ```
    

✅ That means Terraform is installed successfully!

---