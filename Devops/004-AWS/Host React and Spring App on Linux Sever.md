

---

# Deployment Guide: Hosting React and Spring Boot Applications on a Linux Server

**Prerequisites:**  
Ensure you have installed NGINX, Java, and PostgreSQL on your Linux server. Use tools like PuTTY or MobaXterm to avoid access denied errors when connecting to the server.

### Uploading Projects to the Server

Upload both the React and Spring Boot projects to the `/opt` directory using the following command:
```bash
scp -r techeazy-gateway-0.0.6.jar root@193.37.212.121:/opt/techeazy/rms/
```

### 1. **Host the React Project**

Since you’ve already uploaded the React build folder to the server, you can use **NGINX** to serve it.

#### Install NGINX
```bash
sudo apt update
sudo apt install nginx
```

#### Configure NGINX
1. Open the NGINX default configuration file:
   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```

2. Modify the configuration to point to your React build folder. Replace the existing content inside the `server` block with the following:

   ```nginx
   server {
       listen 80;

       server_name your_server_ip_or_domain; # Replace with your server IP or domain

       root /path_to_your_build_folder; # Replace with the path to your React build folder

       index index.html index.htm;

       location / {
           try_files $uri /index.html;
       }
   }
   ```

   - `your_server_ip_or_domain`: Replace this with your server IP or domain.
   - `path_to_your_build_folder`: This should be the path to the build folder of your React project.

3. Test the NGINX configuration:
   ```bash
   sudo nginx -t
   ```

4. Restart NGINX to apply the changes:
   ```bash
   sudo systemctl restart nginx
   ```

Your React app should now be accessible through your server’s IP or domain name on port 80 (HTTP).

### 2. **Run the Spring Boot Application**

To ensure your Spring Boot app remains active even after closing PuTTY, use either **`nohup`** or **`tmux`**. Below is how to do it with `nohup`:

#### Run Spring Boot App with `nohup`
1. Navigate to the directory where your Spring Boot JAR file is located:
   ```bash
   cd /path_to_your_jar_file
   ```

2. Run the Spring Boot application using `nohup`:
   ```bash
   nohup java -jar your_springboot_app.jar > log.txt 2>&1 &
   ```

   - `your_springboot_app.jar`: Replace this with the actual JAR file name.
   - `log.txt`: This file will store logs. You can check it for any errors or output from your app.
   
1. Run the Spring Boot application using `nohup`:
   ```bash
   nohup java -jar -Dspring.profiles.active=stage techeazy-gateway-0.0.6.jar > log.txt 2>&1 &
   ```


3. Check if the app is running:
   ```bash
   ps -ef | grep java
   ```

### 3. **Ensure Both React and Spring Boot are Working**

- Your React app should now be accessible via the server’s IP or domain name (e.g., `http://your_server_ip`).
- Your Spring Boot app will run on its default port (usually `8080`). You can access it via `http://your_server_ip:8080`.

Both applications will continue running even if you close PuTTY.

### Stopping the Spring Boot Application

To stop the Spring Boot application running in the background using the `nohup` command, follow these steps:

1. **Find the Process ID (PID)**:
   Run the following command to find the PID of your running Spring Boot application:
   ```bash
   ps -ef | grep your_springboot_app.jar
   ```
   This will list processes related to your Spring Boot JAR file. Note the PID (the number in the second column).

2. **Kill the Process**:
   Once you have the PID, use the `kill` command to stop the process:
   ```bash
   kill <PID>
   ```
   Replace `<PID>` with the actual PID you found in the previous step.

3. **Force Kill (if needed)**:
   If the process doesn’t stop with the `kill` command, you can force it by using the `-9` flag:
   ```bash
   kill -9 <PID>
   ```

After completing these steps, your Spring Boot application will stop running.

---


The basic command to delete files and directories in Linux is:

1. **Delete a File:**
   ```bash
   rm filename
   ```
   Replace `filename` with the actual name of the file you want to delete.

2. **Delete a Directory:**
   ```bash
   rm -r directory_name
   ```
   Use the `-r` (recursive) option to delete the directory and all its contents. Replace `directory_name` with the actual name of the directory.

3. **Force Delete Without Confirmation:**
   ```bash
   rm -rf directory_name_or_file
   ```
   The `-f` (force) option will delete files or directories without prompting for confirmation, so use this with caution.
---

The command to move files or directories in Ubuntu (or any Linux system) is `mv`. Here’s how to use it:

1. **Move a File:**
   ```bash
   mv source_file destination_directory
   ```
   Replace `source_file` with the name of the file you want to move, and `destination_directory` with the path to the directory where you want to move it.

2. **Rename a File or Directory:**
   ```bash
   mv old_name new_name
   ```
   This will rename `old_name` to `new_name`. You can use this for both files and directories.

3. **Move a Directory:**
   ```bash
   mv source_directory destination_directory
   ```
   Replace `source_directory` with the directory you want to move, and `destination_directory` with the target directory path. 

> **Example:** To move `file.txt` to the `/opt/techeazy/rms/` directory:
   ```bash
   mv file.txt /opt/techeazy/rms/
   ```