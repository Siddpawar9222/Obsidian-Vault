
---

- Go to Self_Hosted_Runner_GitHub and click on it 
- copy command one by one and execute on ec2 instance 
- then went to action , choose java with maven option and create script file(maven.yaml file)
- After that got  403 error , solved it by 

   - Go to **Settings > Actions > General**  in your repository.

  - Under **Workflow permissions** , select **Read and write permissions** .

  - Ensure that **Allow GitHub Actions to create and approve pull requests**  is enabled if applicable.

and  

2. **Update `GITHUB_TOKEN` Permissions in Workflow:**

Explicitly define permissions for the `GITHUB_TOKEN` in your GitHub Actions workflow. Add this under `jobs` in your `.github/workflows/<workflow-file>.yml`:

  

```yaml

jobs:

  build:

    runs-on: ubuntu-latest

    permissions:

      contents: write

      dependency-graph: write

```

3. **Ensure the Dependency Submission Action is Properly Configured:**

If you are using a Maven dependency submission action, ensure it is correctly set up. Example configuration:

  

```yaml

- name: Submit Maven dependencies

  uses: advanced-security/maven-dependency-submission-action@v1

  with:

    token: ${{ secrets.GITHUB_TOKEN }}
```


- Pushed changes in master branch  and build is completed, same repo structure is created in ec2 with new jar file 
- Till  app didnt work , beacuse we didnt write secript to execute it
- Copy path from ec2 instance of jar file and added in script file 

-  final maven.yaml file  
 ``` 
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

      # Optional: Uploads the full dependency graph to GitHub to improve the quality of Dependabot alerts this repository can receive

      - name: Update dependency graph

        uses: advanced-security/maven-dependency-submission-action@571e99aab1055c2e71a1e2309b9691de18d6b7d6

        with:

          token: ${{ secrets.GITHUB_TOKEN }}

  

    # Add permission configuration for the GITHUB_TOKEN

    permissions:

      contents: write

      security-events: write
```

- Again pushed changes and app run and deployed with run successfully

[YouTube Video Reference](https://youtu.be/1-CKqngg6GY?si=8t9IeDnGOysczQmv)