
---

## 🎯 Install and Set Up Grafana on Windows:

- Install Grafana on Windows
    
- Connect Grafana to Prometheus
    
- Create a dashboard to view Spring Boot metrics
    

---

## Step 1: Download and Install Grafana on Windows

1. Go to the Grafana official download page:  
    👉 [https://grafana.com/grafana/download](https://grafana.com/grafana/download)
    
2. Choose **Windows**, click **Download**.
    
3. After download, extract the `.zip` file to a folder like:  
    `C:\Tools\grafana`
    
4. To run Grafana, open a terminal or command prompt and run:
    
    ```bash
    cd C:\Tools\grafana\bin
    grafana-server.exe
    ```
    
5. Keep this terminal open. It means Grafana is running.
    

---

## Step 2: Open Grafana in Browser

Open your browser and go to:  
👉 `http://localhost:3000`

- **Username**: `admin`
    
- **Password**: `admin`
    

Grafana will ask you to **change your password** — set a new one and continue.

---

## Step 3: Add Prometheus as a Data Source

1. In Grafana, click the **gear icon (⚙️)** on the left sidebar → Click **"Data Sources"**.
    
2. Click the blue **[Add data source]** button.
    
3. Choose **Prometheus**.
    
4. In the URL field, enter:
    
    ```
    http://localhost:9090
    ```
    
5. Click **[Save & Test]**.  
    You should see **"Data source is working"** ✅
    

---

##  Step 4: Import a Spring Boot Dashboard

Instead of creating one from scratch, let's import a ready-made dashboard:

1. In left sidebar, click the **plus (+)** icon → Click **"Import"**.
    
2. In the Import screen, paste this dashboard ID:
    
    ```
    4701
    ```
    
    (This is a popular Spring Boot + Micrometer dashboard)
    
3. Click **[Load]**.
    
4. Choose your Prometheus data source and click **[Import]**.
    

You’ll now see a **dashboard** with charts like:

- JVM memory usage
    
- HTTP request stats
    
- CPU usage
    
- Thread count
    
- GC stats
    

---
