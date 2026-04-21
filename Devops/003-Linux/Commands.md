
----

### Read the **last 100 or 200 lines** of a log file, you can use the `tail` command

### ✅ Basic Command:

```bash
tail -n 100 /path/to/your/logfile.log
```

- `-n 100`: shows last 100 lines.
    
- Change `100` to `200` if you want last 200 lines.
    

### ✅ Example:

```bash
tail -n 200 /var/log/syslog
```

This will display the last 200 lines of the `syslog` file.

---

### 🔄 Real-time Log Monitoring:

If you want to **see new lines as they are added**, use:

```bash
tail -n 100 -f /path/to/your/logfile.log
```

- `-f` means “follow”—it keeps showing new lines as they are written.
    

---

## See  application running on 80 port

---

# 🧾 Command

```bash
sudo lsof -i :80
```


---

# 🧩 Breakdown of each part

## 1. `sudo`

👉 Run command as **admin (root)**

- Some processes are protected
    
- Without sudo → you may not see them
    

---

## 2. `lsof`

👉 lsof = **List Open Files**

👉 In Linux:

> Everything is treated like a file (even network connections)

So:

- Open ports = open files
    
- Running processes = using files
    

---

## 3. `-i`

👉 Means: **network connections**

So now:  
👉 “Show open network files (ports)”

---

## 4. `:80`

👉 Filter only **port 80**

---

# 📊 Example output

```bash
COMMAND   PID   USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
nginx    1234   root   6u   IPv4  12345      0t0  TCP *:80 (LISTEN)
```

---

# 🧾 How to read this

|Column|Meaning|
|---|---|
|COMMAND|Program name (nginx)|
|PID|Process ID (1234)|
|USER|Who started it|
|NAME|Port info|

👉 Important line:

```
nginx ... TCP *:80 (LISTEN)
```

👉 Means:

- Nginx is using port 80
    
- It is listening for requests
    

---

# 🎯 Why you used this command

Your error:

```
Port 80 already in use
```

👉 So you run:

```bash
sudo lsof -i :80
```

👉 To find:  
**Which process is blocking Certbot**

---

# ⚡ What to do after this

If output shows:

### 👉 nginx

```bash
sudo systemctl stop nginx
```

### 👉 apache

```bash
sudo systemctl stop apache2
```

---

# 🚀 Pro tip (very useful)

If you want to **kill process directly**:

```bash
sudo kill -9 <PID>
```

Example:

```bash
sudo kill -9 1234
```

⚠️ Be careful — don’t kill important processes blindly


---
