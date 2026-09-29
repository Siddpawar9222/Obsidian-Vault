# 003 — Local Installation (Windows)

## Install Terraform on Windows 10

### Step 1: Download Terraform

1. Go to the official Terraform download page:
   👉 [https://developer.hashicorp.com/terraform/downloads](https://developer.hashicorp.com/terraform/downloads)
2. Select **Windows (AMD64)** for 64-bit systems.
   - Not sure if your system is 64-bit? Press `Win + Pause/Break` and check "System type".

---

### Step 2: Extract the ZIP File

1. The download is a `.zip` file (e.g., `terraform_1.8.5_windows_amd64.zip`).
2. Extract it — inside you'll find **terraform.exe**.
3. Move `terraform.exe` to a safe folder, for example:
   ```
   C:\terraform\
   ```

---

### Step 3: Add Terraform to PATH

This step lets you run `terraform` from any terminal window.

1. Press `Win + R`, type `sysdm.cpl`, press Enter.
2. Go to **Advanced** → **Environment Variables**.
3. Under **System Variables**, find `Path` → click **Edit**.
4. Click **New** → enter the folder path where `terraform.exe` is located:
   ```
   C:\terraform\
   ```
5. Click OK on all windows to save.

---

### Step 4: Verify Installation

1. Open **Command Prompt (cmd)** or **PowerShell**.
2. Run:
   ```
   terraform -version
   ```
3. You should see output like:
   ```
   Terraform v1.8.5
   on windows_amd64
   ```

✅ If you see that, Terraform is installed and ready to use.