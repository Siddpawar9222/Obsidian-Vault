
Use putty or MobaXterm , sometimes connecting with cmd or linux machine gives access denied error while connecting with server

Build both project 

Upload both project to /opt directory using command 
scp -r build username@server-ip-address:/opt/techeazy/rms/


To host your React project and Spring Boot application on a Linux server, you'll need to serve the React build files and run your Spring Boot app in a way that they stay active even after you close PuTTY. Here’s a step-by-step guide:


### 1. **Host the React Project**

Since you've already uploaded the React build folder to the Linux server, you can use **Nginx** to serve it.

#### Install Nginx:
```bash
sudo apt update
sudo apt install nginx
```

#### Configure Nginx:
1. Open the Nginx default configuration file:
   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```

2. Modify the configuration to point to your React build folder. Replace the existing content inside the `server` block with the following:

   ```nginx
   server {
       listen 80;

       server_name your_server_ip_or_domain;

       root /path_to_your_build_folder; # Replace with the path to your React build folder

       index index.html index.htm;

       location / {
           try_files $uri /index.html;
       }
   }
   ```

   - `your_server_ip_or_domain`: Replace this with your server IP or domain.
   - `path_to_your_build_folder`: This should be the path to the build folder of your React project.

3. Test the Nginx configuration:
   ```bash
   sudo nginx -t
   ```

4. Restart Nginx to apply the changes:
   ```bash
   sudo systemctl restart nginx
   ```

Now, your React app should be accessible through your server’s IP or domain name on port 80 (HTTP).

[Error_Link](https://stackoverflow.com/questions/55760655/reactjs-deploy-app-error-cannot-copy-to-clipboard-command-failed-xsel-clipbo)

---
### 2. **Run Spring Boot App**

You can run your Spring Boot app using the JAR file, but to ensure it continues running even after you close PuTTY, you should use **`nohup`** or **`tmux`**. Here’s how you can do it:

#### Option 1: Using `nohup`
1. Go to the directory where your Spring Boot JAR file is located:
   ```bash
   cd /path_to_your_jar_file
   ```

2. Run the Spring Boot app using `nohup`:
   ```bash
   nohup java -jar your_springboot_app.jar > log.txt 2>&1 &
   ```

   - `your_springboot_app.jar`: Replace this with the actual JAR file name.
   - `log.txt`: This file will store logs. You can check it for any errors or output from your app.

3. Check if the app is running:
   ```bash
   ps -ef | grep java
   ```

### 3. **Ensure Both React and Spring Boot are Working**

- Your React app should now be accessible via the server’s IP or domain name (e.g., `http://your_server_ip`).
- Your Spring Boot app will be running on its default port (usually `8080`). You can access it via `http://your_server_ip:8080`.

Both applications will continue running even if you close PuTTY.



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
   If the process doesn't stop with the `kill` command, you can force it by using the `-9` flag:
   ```bash
   kill -9 <PID>
   ```

After doing this, your Spring Boot application will stop running.
