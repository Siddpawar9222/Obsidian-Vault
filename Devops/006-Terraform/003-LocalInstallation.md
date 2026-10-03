# Local Installation

---

## 🪟 Install Terraform on Windows (10 / 11)

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
   ```bash
   terraform -version
   ```
3. You should see output like:
   ```text
   Terraform v1.8.5
   on windows_amd64
   ```

✅ If you see that, Terraform is installed and ready to use.

---

## 🐧 Install Terraform on Linux (Ubuntu / Debian)

### Method 1: Using Official HashiCorp APT Repository (Recommended)

This method ensures you can easily update Terraform later using `sudo apt update && sudo apt upgrade`.

#### Step 1: Install Required Dependencies
Ensure your package list is up to date and install required tools:
```bash
sudo apt-get update && sudo apt-get install -y gnupg software-properties-common curl
```

#### Step 2: Add HashiCorp GPG Key
Download and install the official HashiCorp GPG key to verify package signatures:
```bash
wget -O- https://apt.releases.hashicorp.com/gpg | \
gpg --dearmor | \
sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg > /dev/null
```

#### Step 3: Add HashiCorp Repository
Add the official HashiCorp Linux repository to your APT sources:
```bash
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] \
https://apt.releases.hashicorp.com $(lsb_release -cs) main" | \
sudo tee /etc/apt/sources.list.d/hashicorp.list
```

#### Step 4: Install Terraform
Update package lists and install Terraform:
```bash
sudo apt-get update && sudo apt-get install -y terraform
```

#### Step 5: Verify Installation
Verify that Terraform was installed successfully:
```bash
terraform -version
```
Expected output:
```text
Terraform v1.8.5
on linux_amd64
```

---

### Method 2: Manual Binary Installation (Quick / Standalone)

If you prefer installing directly from the standalone binary without configuring APT repositories:

1. **Install `unzip` and `wget`** (if not already installed):
   ```bash
   sudo apt-get update && sudo apt-get install -y wget unzip
   ```

2. **Download the Linux binary**:
   Visit the [Terraform downloads page](https://developer.hashicorp.com/terraform/downloads) or download directly:
   ```bash
   wget https://releases.hashicorp.com/terraform/1.8.5/terraform_1.8.5_linux_amd64.zip
   ```

3. **Unzip and move to `/usr/local/bin/`** (which is already in your system PATH):
   ```bash
   unzip terraform_1.8.5_linux_amd64.zip
   sudo mv terraform /usr/local/bin/
   rm terraform_1.8.5_linux_amd64.zip
   ```

4. **Verify installation**:
   ```bash
   terraform -version
   ```

---

### 💡 Optional: Enable Tab Autocompletion (Bash / Zsh)

To enable command and resource tab-completion in your shell:

```bash
touch ~/.bashrc
terraform -install-autocomplete
```
Restart your terminal or run `source ~/.bashrc` to activate it.