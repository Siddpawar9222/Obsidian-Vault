# Shell, Pipes & Text Processing

---

## What is a Shell Script?

A shell script is a file with multiple Linux commands that run in sequence.

```bash
#!/bin/bash

DATE=$(date)
BACKUP_DIR="/backup"

mkdir -p $BACKUP_DIR
cp -r /home/user/data $BACKUP_DIR

echo "Backup done at $DATE"
```

Used in: server backups, log rotation, monitoring, CI/CD pipelines.

---

## Shebang

First line of every shell script — tells system which shell to use:

```bash
#!/bin/bash
```

---

## Make Script Executable and Run

```bash
chmod +x script.sh    # give execute permission
./script.sh           # run the script
```

---

## Variables

```bash
name="Siddhesh"
echo $name
```

---

## Input from User

```bash
read name
echo "Hello $name"
```

---

## If Condition

```bash
if [ $age -gt 18 ]; then
  echo "Adult"
else
  echo "Minor"
fi
```

---

## Loops

```bash
for i in 1 2 3
do
  echo $i
done
```

---

## Pipes (`|`)

Passes the **output of one command as input to the next**.

```bash
ps -ef | grep java         # get all processes, filter java ones
ls -l | grep ".txt"        # list files, filter .txt
cat log.txt | grep ERROR   # view log, show only errors
```

---

## Redirection

```bash
ls > files.txt         # save output to file (overwrites)
ls >> files.txt        # append output to file
cmd 2>&1               # redirect errors to stdout
```

---

## grep — Search Text

```bash
grep "error" log.txt              # find lines with "error"
grep -i "error" log.txt           # case-insensitive
grep -n "error" log.txt           # show line numbers
grep -r "port" /etc/              # search recursively
grep "ERROR" app.log | tail -20   # last 20 error lines
```

Real-world use:
```bash
ps -ef | grep java
cat app.log | grep ERROR | wc -l   # count error lines
```

---

