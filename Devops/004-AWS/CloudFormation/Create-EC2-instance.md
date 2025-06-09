
---

```
# This tells AWS what version of CloudFormation template format you're using.

AWSTemplateFormatVersion: "2010-09-09"

  

# A short description of what this template does

Description: "Create Free-Tier EC2 instance using CloudFormation with explanations"

  

# 🔶 PARAMETERS: Allow user to input values (like instance type)

Parameters:

  InstanceType:

    Type: String                # Expecting a string value (like "t2.micro")

    Default: t2.micro           # Default value (free-tier eligible)

    AllowedValues:              # Allowed EC2 types (free-tier & light usage types)

      - t2.micro

      - t3.micro

    Description: "Choose a free-tier eligible EC2 instance type"

  

# 🔷 RESOURCES: The actual AWS services you want to create

Resources:

  MyEC2Instance:

    Type: AWS::EC2::Instance    # Tells CloudFormation to create an EC2 instance

    Properties:

      InstanceType: !Ref InstanceType   # Use the value from Parameters section

      ImageId: ami-03bb6d83c60fc5f7c    # Amazon Linux 2 AMI for ap-south-1 (Mumbai)

      KeyName: devops-key-pair          # Replace this with your actual EC2 key pair name!

      Tags:

        - Key: devops

          Value: my-cloudformation-learning           # Tag for easier identification in AWS console

  

# OUTPUTS: Display useful information after stack is created

Outputs:

  InstanceId:

    Description: "EC2 Instance ID"

    Value: !Ref MyEC2Instance          # Returns the instance ID of created EC2

  

  PublicIP:

    Description: "Public IP Address"

    Value: !GetAtt MyEC2Instance.PublicIp   # Returns the Public IP address of the EC2 instance
```