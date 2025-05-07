---

---

---

##  What is AWS CLI?

**AWS CLI (Command Line Interface)** is a tool that helps you **interact with AWS services** (like EC2, S3, Lambda, etc.) directly from your **terminal or command prompt**, instead of using the AWS web console.

 With AWS CLI, you can:

- Create and manage EC2 instances
    
- Upload/download files to/from S3
    
- Deploy applications
    
- Automate your AWS workflows
    

---

##  How to Install AWS CLI

###  For Windows

1. Download the AWS CLI installer from [official AWS link](https://aws.amazon.com/cli/).
    
2. Run the `.msi` file and follow the installation steps.
    
3. After installation, open **Command Prompt** and type:
    
    ```bash
    aws --version
    ```
    

###  For macOS (using Homebrew)

```bash
brew install awscli
aws --version
```

###  For Linux

1. Download the installer:
    
    ```bash
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    ```
    
2. Unzip the installer:
    
    ```bash
    unzip awscliv2.zip
    ```
    
3. Run the installer:
    
    ```bash
    sudo ./aws/install
    ```
    
4. Check version:
    
    ```bash
    aws --version
    ```
    

---

##  Set up AWS CLI with Your Credentials

After installing, you need to **configure it** with your AWS credentials.

```bash
aws configure
```

It will ask for:

```
AWS Access Key ID [None]: YOUR_ACCESS_KEY
AWS Secret Access Key [None]: YOUR_SECRET_KEY
Default region name [None]: us-east-1
Default output format [None]: json
```

---

##  Basic AWS CLI Commands (with real examples)

###  1. **S3 Commands**

- **List buckets**
    
    ```bash
    aws s3 ls
    ```
    
- **Create a new bucket**
    
    ```bash
    aws s3 mb s3://my-new-bucket-name
    ```
    
- **Upload a file to a bucket**
    
    ```bash
    aws s3 cp myfile.txt s3://my-bucket-name/
    ```
    
- **Download a file from a bucket**
    
    ```bash
    aws s3 cp s3://my-bucket-name/myfile.txt .
    ```
    
- **Delete a file**
    
    ```bash
    aws s3 rm s3://my-bucket-name/myfile.txt
    ```
    

---

###  2. **EC2 Commands**

- **List EC2 instances**
    
    ```bash
    aws ec2 describe-instances
    ```
    
- **Start an EC2 instance**
    
    ```bash
    aws ec2 start-instances --instance-ids i-1234567890abcdef0
    ```
    
- **Stop an EC2 instance**
    
    ```bash
    aws ec2 stop-instances --instance-ids i-1234567890abcdef0
    ```
    

---

### 3. **IAM Commands**

- **List users**
    
    ```bash
    aws iam list-users
    ```
    
- **Create a new user**
    
    ```bash
    aws iam create-user --user-name myNewUser
    ```
    

---

##  Tips

- Use `--help` with any command to get help:
    
    ```bash
    aws s3 --help
    ```
    
- Output formats: You can choose `json`, `text`, or `table`. Example:
    
    ```bash
    aws ec2 describe-instances --output table
    ```
    

---


