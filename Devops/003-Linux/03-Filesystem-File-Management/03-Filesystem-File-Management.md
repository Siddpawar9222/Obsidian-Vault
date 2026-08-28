# Filesystem & File Management

---

## Linux Filesystem Structure

In Linux, everything starts from `/` (root).

```
/
+-- etc/       <- System configuration files
+-- var/       <- Variable data (logs, databases)
+-- home/      <- User home directories
+-- tmp/       <- Temporary files (cleared on reboot)
+-- usr/       <- Installed programs
+-- bin/       <- Essential commands (ls, cp, mv)
+-- opt/       <- Optional/third-party software
+-- proc/      <- Running processes (virtual)
+-- dev/       <- Device files
+-- root/      <- Home directory for root user
```

### Important Directories

| Directory | Purpose |
|---|---|
| `/etc` | All system config files (nginx.conf, sshd_config, etc.) |
| `/var/log` | Application and system logs |
| `/home/username` | Your personal files |
| `/tmp` | Temporary files — cleared on reboot |
| `/opt` | Custom installed software (e.g., Java) |
| `/usr/bin` | User commands |
| `/proc` | Live info about running processes |

---

## touch — Create Files

```bash
touch file.txt              # create empty file
touch file1.txt file2.txt   # create multiple files
```

---

## mkdir — Create Directories

```bash
mkdir myfolder              # create a folder
mkdir -p parent/child/deep  # create nested folders
```

---

## cp — Copy Files and Folders

```bash
cp file.txt backup.txt              # copy file
cp file.txt /home/user/             # copy to another location
cp -r myfolder/ /backup/myfolder/   # copy entire folder (-r = recursive)
```

---

## mv — Move or Rename

```bash
mv file.txt newname.txt         # rename a file
mv file.txt /home/user/         # move to another folder
mv folder/ /opt/folder/         # move a folder
```

---

## rm — Remove Files and Folders

```bash
rm file.txt                 # delete a file
rm -r myfolder/             # delete a folder and all contents
rm -f file.txt              # force delete (no error if missing)
rm -rf myfolder/            # force delete folder recursively
```

> Warning: `rm -rf` is permanent — no undo. Always double-check your path.

---

## cat — View File Contents

```bash
cat file.txt                # print entire file
cat -n file.txt             # show with line numbers
```

---

## less — Scroll Through Large Files

```bash
less logfile.log
```

| Key | Action |
|---|---|
| `Space` | Next page |
| `b` | Previous page |
| `/word` | Search |
| `q` | Quit |

---

## head — First Lines

```bash
head file.txt           # first 10 lines (default)
head -n 20 file.txt     # first 20 lines
```

---

## tail — Last Lines

```bash
tail file.txt               # last 10 lines
tail -n 100 logfile.log     # last 100 lines
tail -n 200 logfile.log     # last 200 lines
tail -f logfile.log         # follow in real-time (live log watching)
tail -n 100 -f logfile.log  # last 100 lines + follow new entries
```

Live Spring Boot log watching:

```bash
tail -f /var/log/myapp/application.log
```

---

## find — Search for Files

```bash
find /home -name "*.txt"                    # find all .txt files
find / -name "application.properties"       # find a config file
find /var/log -name "*.log" -mtime -1       # logs modified in last 1 day
```

---


