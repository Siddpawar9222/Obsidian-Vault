
--- 

### **Steps to Set Up CI/CD Pipeline**

#### **1. Go to Self-Hosted Runner on GitHub**

- Navigate to your GitHub repository.
- Go to **Settings > Actions > Runners**.
- Click on **New Self-Hosted Runner**.

#### **2. Copy Commands and Execute on EC2**

- Copy the commands one by one from the GitHub page.
- SSH into your EC2 instance and execute the commands.
    - These commands download the runner software.
    - Configure the runner to connect with your GitHub repository.

#### **3. Start the Runner**

- Run the provided command to start the runner on the EC2 instance.

#### **4. Go to Actions Tab and Create Workflow**

- In your GitHub repository, go to the **Actions** tab.
- Choose the **Java with Maven** template.
- Create a new workflow file named `maven.yaml`.

#### **5. <span style="background:#ff4d4f">Solve 403 Error</span>**

If you encounter a 403 error, follow these steps:

**Update Repository Settings:**

- Go to **Settings > Actions > General** in your repository.
- Under **Workflow permissions**:
    - Select **Read and write permissions**.
    - Enable **Allow GitHub Actions to create and approve pull requests**, if applicable.

**Update `GITHUB_TOKEN` Permissions in Workflow:**

- Add the following configuration under `jobs` in your `.github/workflows/maven.yaml` file:

```yaml
jobs:
  build:
    runs-on: self-hosted
    permissions:
      contents: write
      dependency-graph: write
```

**Submit Maven Dependencies (if applicable):**

- Ensure the Maven dependency submission action is properly configured:

```yaml
- name: Submit Maven dependencies
  uses: advanced-security/maven-dependency-submission-action@v1
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
```

#### **6. Push Changes to Trigger Workflow**

- Push your changes to the `master` branch.
- The workflow will be triggered automatically.

#### **7. Verify Build and Deployment**

- Once the workflow runs successfully, it will build the project and create a new JAR file in the target directory on the EC2 instance.

#### **8. Write Script to Execute Application**

- Copy the path of the JAR file from the EC2 instance.
- Update your `maven.yaml` file to include the execution script:

```yaml
- name: Execute Latest WAR file
  run: |
    sudo kill -9 $(sudo lsof -t -i:8080) || true
    latest_war=$(ls -1t /home/ubuntu/devops/ci-cd/actions-runner/_work/devops-CI-CD/devops-CI-CD/target/*.war | head -n 1)
    echo "Running WAR file: $latest_war"
    sudo java -jar "$latest_war" > log.txt 2>&1 &
```

#### **9. Final `maven.yaml` File**

Here is the complete workflow file:

```yaml
name: Java CI with Maven

on:
  push:
    branches: [ "master" ]

jobs:
  build:
    runs-on: self-hosted

    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: maven

      - name: Build with Maven
        run: mvn -B package --file pom.xml

      - name: Execute Latest WAR file
        run: |
          sudo kill -9 $(sudo lsof -t -i:8080) || true
          latest_war=$(ls -1t /home/ubuntu/devops/ci-cd/actions-runner/_work/devops-CI-CD/devops-CI-CD/target/*.war | head -n 1)
          echo "Running WAR file: $latest_war"
          sudo java -jar "$latest_war" > log.txt 2>&1 &

      - name: Update dependency graph
        uses: advanced-security/maven-dependency-submission-action@571e99aab1055c2e71a1e2309b9691de18d6b7d6
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

    permissions:
      contents: write
      security-events: write
```

#### **10. Push Changes Again and Verify**

- Push the updated workflow file to the repository.
- Verify that the application runs and is accessible via the public IP or domain of the EC2 instance on port 8080.

---
[GitHub-Repository](https://github.com/Siddpawar9222/devops-CI-CD)
[Reference](https://youtu.be/1-CKqngg6GY?si=8t9IeDnGOysczQmv)