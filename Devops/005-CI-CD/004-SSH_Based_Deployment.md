
---

💡 **In normal SSH usage:**

- **You keep the private key (`id_rsa`) on your local machine**.
- **The public key (`id_rsa.pub`) is stored on the remote server (`authorized_keys`)**.

💡 **In GitHub Actions deployment:**

- **GitHub Actions is acting as "your local machine"**, so it **needs access to the private key**.
- The **remote server still needs the public key** (just like in normal SSH usage).

🔹 **GitHub → Needs the private key** (to authenticate).  
🔹 **Remote Server → Has the public key** (to verify the connection).

---

## **Step-by-Step: SSH Deployment in GitHub Actions**

### **Step 1: Generate an SSH Key (If You Haven’t)**

If you don't already have an SSH key pair, generate one:

```bash
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
```

Press **Enter** to accept the default location (`~/.ssh/id_rsa`).

Now, you have:

- `id_rsa` (Private Key)
- `id_rsa.pub` (Public Key)

---

### **Step 2: Add the Public Key to Your Server**

1. Copy your public key:
    
    ```bash
    cat ~/.ssh/id_rsa.pub
    ```
    
2. Connect to your remote server:
    
    ```bash
    ssh username@your-server-ip
    ```
    
3. Add the key to the server:
    
    ```bash
    mkdir -p ~/.ssh
    echo "your-public-key-content" >> ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys
    ```
    

Now, your server **trusts** this SSH key.

---

### **Step 3: Add the Private Key to GitHub Secrets**

1. Copy your **private key** (`id_rsa`):
    
    ```bash
    cat ~/.ssh/id_rsa
    ```
    
2. Go to your **GitHub repository → Settings → Secrets and Variables → Actions**.
3. Click **"New repository secret"**.
4. Name it **`SSH_PRIVATE_KEY`**.
5. Paste the **private key** and save it.

---

### **Step 4: Create GitHub Actions Workflow**

Now, create a **`.github/workflows/deploy.yml`** file in your repository:

```yaml
name: Deploy techeazy-gateway app to server

on:
  push:
    branches:
      - master

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      # Step 1: Checkout Repository
      - name: Checkout Repository
        uses: actions/checkout@v4

      # Step 2: Set up Java and Maven
      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: 21
          distribution: temurin
          cache: maven

      # Step 3: Configure Maven with GitHub Packages
      - name: Configure Maven Settings
        run: |
          mkdir -p ~/.m2
          echo "<settings>
            <servers>
              <server>
                <id>github</id>
                <username>${{ secrets.TECHEAZY_GITHUB_USERNAME }}</username>
                <password>${{ secrets.TECHEAZY_GITHUB_TOKEN }}</password>
              </server>
            </servers>
          </settings>" > ~/.m2/settings.xml

      # Step 4: Build with Maven
      - name: Build with Maven
        run: mvn clean package -DskipTests

      # Step 5: Configure SSH Key
      - name: Configure SSH Key
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.PROD_SERVER_SSH_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa

      # Step 6: Copy JAR to server
      - name: Copy JAR to Server
        run: |
          scp -o StrictHostKeyChecking=no target/*.jar root@${{ secrets.PROD_SERVER_PUBLIC_KEY }}:/root/techeazy-gateway/


      # Step 7: Deploy on server
      - name: Deploy on Server
        run: |
          ssh -o StrictHostKeyChecking=no root@${{ secrets.PROD_SERVER_PUBLIC_KEY }} << 'EOF'
          sudo kill -9 $(sudo lsof -t -i:443) || true
          cd /root/techeazy-gateway/
          nohup java -jar -Dspring.profiles.active=prod *.jar > app.log 2>&1 &
          EOF
```

---

### **Step 5: How This Works?**

1. **GitHub Actions pulls your repository code** (`checkout`).
2. **It creates an SSH key (`id_rsa`) from GitHub secrets**.
3. **It connects to your server using SSH**.
4. **It pulls the latest code from GitHub to your server**.
5. **It restarts your application (`restart-server.sh`)**.

---