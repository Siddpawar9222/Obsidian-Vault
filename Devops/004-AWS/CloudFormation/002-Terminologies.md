
---

## 🔑 Common AWS CloudFormation Terminologies

---

### 1. ✅ **Template**

**What it is:**  
A **YAML or JSON** file that contains **instructions** about what AWS resources to create.

**Example:**  
Like a **recipe** for AWS infrastructure. You write what you want (EC2, S3, RDS) and AWS builds it.

```yaml
Resources:
  MyBucket:
    Type: AWS::S3::Bucket
```

This will create an S3 bucket.

---

### 2. ✅ **Stack**

**What it is:**  
A **collection of AWS resources** created from a CloudFormation **template**.

**Example:**  
You deploy a `template.yaml` → CloudFormation creates a **stack**.  
The stack contains all the AWS services mentioned in the template.

> 🎯 Think of Stack like a **project environment** (like Dev, QA, Prod)

---

### 3. ✅ **Resources**

**What it is:**  
The **actual AWS services** you want to create, like EC2, S3, Lambda, etc.

**Example:**

```yaml
Resources:
  MyEC2:
    Type: AWS::EC2::Instance
```

This creates an EC2 instance.

---

### 4. ✅ **Parameters**

**What it is:**  
Inputs you can **pass into the template** to make it reusable and flexible.

**Example:**  
Instead of hardcoding instance type, you can use a parameter.

```yaml
Parameters:
  InstanceType:
    Type: String
    Default: t2.micro
```

> 🎯 Like asking the user: “Which instance type do you want?”

---

### 5. ✅ **Mappings**

**What it is:**  
**Static values** that you can define and refer to later — like a lookup table.

**Example:**  
Choose AMI based on region:

```yaml
Mappings:
  RegionMap:
    us-east-1:
      AMI: ami-1234abcd
    us-west-1:
      AMI: ami-5678efgh
```

---

### 6. ✅ **Conditions**

**What it is:**  
Create resources **only if certain conditions** are true.

**Example:**  
Only create EC2 if a parameter `CreateInstance` is set to true.

```yaml
Conditions:
  CreateEC2Condition: !Equals [ !Ref CreateInstance, "true" ]
```

---

### 7. ✅ **Outputs**

**What it is:**  
Use **Outputs to display values** after the stack is created.

**Example:**  
You want to print the EC2 instance's public IP.

```yaml
Outputs:
  InstancePublicIP:
    Value: !GetAtt MyEC2.PublicIp
```

> 🎯 Helps you share info between stacks or see important values after creation.

---

### 8. ✅ **Transform**

**What it is:**  
Used when you are working with **AWS Serverless Application Model (SAM)** or **Macros**.

**Example:**

```yaml
Transform: AWS::Serverless-2016-10-31
```

> Only needed in special cases like building Lambda serverless apps.

---

### 9. ✅ **Change Set**

**What it is:**  
A **preview** of what CloudFormation will do before it does it.

**Example:**  
"Hey, you are updating the template — here’s what will change (add, delete, update resources). Are you sure?"

> 🎯 Helps avoid accidents in production.

---

### 10. ✅ **Drift Detection**

**What it is:**  
It checks if your **actual AWS resources** are different from your **CloudFormation template**.

**Example:**  
Someone manually deleted an S3 bucket created by CloudFormation.  
Drift detection will catch that and say, "Your infra has **drifted**."

---

## 🔚 Summary Table

|Term|Meaning (Simple)|Real-World Analogy|
|---|---|---|
|Template|YAML/JSON file with resource info|Recipe for making a dish|
|Stack|Group of AWS resources from the template|A full project setup (Dev, Prod)|
|Resources|Actual AWS services like EC2, S3|Ingredients listed in the recipe|
|Parameters|Input values for flexibility|Ask "how spicy should the dish be?"|
|Mappings|Lookup table for values|Like choosing ingredient by region|
|Conditions|Add resources only if some logic is true|"Add sugar only if sweet dish"|
|Outputs|Display results from created resources|Print final taste or dish details|
|Transform|Use advanced features like serverless|Special tools for complex recipes|
|Change Set|Preview changes before applying|Test the new recipe before cooking|
|Drift Detection|Detect changes made outside template|Chef forgot to add salt manually|

---

