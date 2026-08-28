
---

## 1. What is a Shell?

A **shell** is a program that takes commands from the user and gives them to the **Linux kernel** to execute.

Think like this:

> **You (user) → Shell → Kernel → Hardware (CPU, Disk, RAM)**

### Real-world example

You tell a waiter (shell): "Bring me tea"  
Waiter tells kitchen (kernel)  
Kitchen uses tools (hardware) and serves tea

---

## 2. Types of Shells in Linux

Different shells exist in Linux:

| Shell              | Command     |
| ------------------ | ----------- |
| Bash (most common) | `/bin/bash` |
| Bourne Shell       | `/bin/sh`   |
| C Shell            | `/bin/csh`  |
| Korn Shell         | `/bin/ksh`  |
| Z Shell            | `/bin/zsh`  |

### Check your current shell

```bash
echo $SHELL
```

---

## 3. What is a Terminal?

A **terminal** is the window where you type commands.

Terminal = UI (screen)  
Shell = brain behind it

---

## 4. Basic Linux Commands

### 4.1 `pwd` – Present Working Directory

Shows your current location.

```bash
pwd
```

---

### 4.2 `ls` – List files

```bash
ls
ls -l
ls -a
```

|Option|Meaning|
|---|---|
|`-l`|long format|
|`-a`|show hidden files|

---

### 4.3 `cd` – Change directory

```bash
cd folderName
cd ..
cd ~
```

|Command|Meaning|
|---|---|
|`cd ..`|go back|
|`cd ~`|go home|

---

## 5. File Commands

### Create file

```bash
touch file.txt
```

### View file

```bash
cat file.txt
less file.txt
more file.txt
```

### Delete

```bash
rm file.txt
rm -r folder
```

---

## 6. grep – Search inside files

`grep` is used to search text.

```bash
grep "error" log.txt
```

Real example: Find error in server logs.

---

## 7. Pipes (`|`)

Used to pass output of one command to another.

```bash
ps -ef | grep java
```

Meaning:  
Get all processes → filter only java

---

## 8. Redirection

### Output to file

```bash
ls > files.txt
```

### Append

```bash
echo "hello" >> files.txt
```

---

## 9. Process Commands

### ps

```bash
ps
ps -ef
```

### kill

```bash
kill 1234
kill -9 1234
```

---

## 10. Top Command

```bash
top
```

Shows:

- CPU usage
    
- Memory
    
- Running processes
    

---

## 11. Permissions

```bash
ls -l
```

Output:

```
-rwxr-xr--
```

|Symbol|Meaning|
|---|---|
|r|read|
|w|write|
|x|execute|

Change permission:

```bash
chmod 755 script.sh
```

---

## 12. sudo

Run command as admin.

```bash
sudo apt update
```

---

## 13. Environment Variables

```bash
echo $PATH
```

Set:

```bash
export JAVA_HOME=/usr/lib/jvm/java-17
```

---

## 14. History

```bash
history
```

Run previous:

```bash
!5
```

---

# Shell Scripting

## 15. What is Shell Script?

A shell script is a file with multiple Linux commands.

File name example:

```bash
test.sh
```

---

## 16. Shebang

First line:

```bash
#!/bin/bash
```

Tells system which shell to use.

---

## 17. Make script executable

```bash
chmod +x test.sh
./test.sh
```

---

## 18. Variables

```bash
name="Siddhesh"
echo $name
```

---

## 19. Input from user

```bash
read name
echo "Hello $name"
```

---

## 20. If condition

```bash
if [ $age -gt 18 ]; then
  echo "Adult"
else
  echo "Minor"
fi
```

---

## 21. Loops

### for loop

```bash
for i in 1 2 3
do
  echo $i
done
```

---

## 22. Real DevOps Example Script

```bash
#!/bin/bash

DATE=$(date)
BACKUP_DIR="/backup"

mkdir -p $BACKUP_DIR
cp -r /home/user/data $BACKUP_DIR

echo "Backup done at $DATE"
```

Used in:

- Server backup
    
- Log rotation
    
- Monitoring
    

---

# Why Shell is Important for Developers

For you as Java / backend engineer:

You will use shell for:

- Docker
    
- Kubernetes
    
- AWS EC2
    
- Jenkins
    
- Logs debugging
    

Example:

```bash
kubectl get pods | grep auth
```

This is daily real industry usage.

---

# Final Mental Model

```
You → Terminal → Shell → Kernel → Hardware
```

Shell is your **remote control of Linux**.