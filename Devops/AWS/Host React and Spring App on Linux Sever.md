
Use putty , sometimes connecting with cmd or linux machine gives access denied error while connecting with server

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

#### Option 2: Using `tmux`
If you want more control over your terminal sessions, you can use `tmux`:

1. Install `tmux` if it’s not already installed:
   ```bash
   sudo apt install tmux
   ```

2. Start a new `tmux` session:
   ```bash
   tmux new -s springboot_app
   ```

3. Run your Spring Boot JAR inside the `tmux` session:
   ```bash
   java -jar your_springboot_app.jar
   ```

4. Detach from the `tmux` session (this will keep the app running in the background):
   ```bash
   Ctrl + B, then press D
   ```

5. To reattach to the session later, run:
   ```bash
   tmux attach -t springboot_app
   ```

---

### 3. **Ensure Both React and Spring Boot are Working**

- Your React app should now be accessible via the server’s IP or domain name (e.g., `http://your_server_ip`).
- Your Spring Boot app will be running on its default port (usually `8080`). You can access it via `http://your_server_ip:8080`.

Both applications will continue running even if you close PuTTY.

Let me know if you need any further clarifications!



ps -ef | grep your_springboot_app.jar
