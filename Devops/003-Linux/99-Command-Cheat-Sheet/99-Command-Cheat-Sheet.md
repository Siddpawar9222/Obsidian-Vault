# Linux Command Cheat Sheet

---

## Navigation

```bash
pwd                     # current directory
ls -la                  # list all files with details
cd foldername           # enter folder
cd ..                   # go up one level
cd ~                    # go to home
clear                   # clear screen (Ctrl+L)
history                 # command history
whoami                  # current username
```

---

## Files & Folders

```bash
touch file.txt          # create file
mkdir folder            # create folder
mkdir -p a/b/c          # create nested folders
cp file.txt copy.txt    # copy file
cp -r src/ dest/        # copy folder
mv file.txt new.txt     # rename or move
rm file.txt             # delete file
rm -rf folder/          # delete folder (no undo!)
cat file.txt            # view file
less file.txt           # scroll through file (q to quit)
head -n 20 file.txt     # first 20 lines
tail -n 100 file.txt    # last 100 lines
tail -f file.log        # live log watching
find / -name "file.txt" # search for file
```

---

## Permissions

```bash
ls -l                   # show permissions
chmod 755 script.sh     # rwxr-xr-x
chmod 644 file.txt      # rw-r--r--
chmod +x script.sh      # add execute for all
chmod g+w file.txt      # add write for group
chown user file.txt     # change owner
sudo command            # run as root
```

---

## Processes

```bash
ps -ef                  # all processes
ps -ef | grep java      # find java process
top                     # live monitor (q to quit)
kill 1234               # stop process
kill -9 1234            # force kill
```

---

## Networking

```bash
sudo lsof -i :8080      # what's on port 8080
ping google.com         # test connectivity
curl http://localhost:8080   # test HTTP endpoint
```

---

## Logs & Monitoring

```bash
tail -n 100 app.log     # last 100 log lines
tail -f app.log         # live log stream
grep "ERROR" app.log    # filter errors
df -h                   # disk usage
free -h                 # memory usage
uptime                  # system uptime
```

---

## Services

```bash
sudo systemctl start nginx      # start service
sudo systemctl stop nginx       # stop service
sudo systemctl restart nginx    # restart service
sudo systemctl status nginx     # check status
sudo systemctl enable nginx     # start on boot
```

---

## Environment

```bash
echo $PATH              # view PATH
echo $JAVA_HOME         # view JAVA_HOME
export VAR=value        # set variable (current session)
env                     # list all env variables
source ~/.bashrc        # reload config
```

---

## Packages (Ubuntu/Debian)

```bash
sudo apt update                      # update list
sudo apt install openjdk-17-jdk      # install Java 17
sudo apt remove nginx                # remove package
apt list --installed                 # list installed
```

---

## Vim Quick Reference

```bash
vim file.txt    # open file
i               # insert mode (start typing)
Esc             # back to normal mode
:w              # save
:q              # quit
:wq             # save and quit
:q!             # force quit without saving
/word           # search
dd              # delete line
yy              # copy line
p               # paste
u               # undo
G               # go to end
gg              # go to top
```

---

## Pipes & Redirection

```bash
cmd1 | cmd2         # pipe output to next command
cmd > file.txt      # save output to file (overwrite)
cmd >> file.txt     # append output to file
grep "text" file    # search in file
grep -i "text" file # case-insensitive
grep -r "text" dir/ # search recursively
```

---

## Spring Boot on Linux

```bash
java -jar app.jar                            # run jar
java -DPORT=8080 -jar app.jar                # with property override
nohup java -jar app.jar > app.log 2>&1 &     # run in background
ps -ef | grep java                           # find the process
sudo lsof -i :8080                           # check which process is on port 8080
tail -f app.log                              # watch logs
kill -9 <PID>                                # stop it
```

