# Permissions, Users & Groups

---

## What are File Permissions?

In Linux, **everything is a file** — text files, programs, directories, devices.
Linux controls **who can do what** using **file permissions**.

Each file has **three types of permissions** for **three types of users**.

---

## Three Types of Users

| User Type | Meaning | Example |
|---|---|---|
| **Owner (u)** | The person who created the file | You |
| **Group (g)** | Other users in the same group | Your teammates |
| **Others (o)** | Everyone else | Public users |

---

## Three Types of Permissions

| Symbol | Permission | Meaning on File | Meaning on Directory |
|---|---|---|---|
| **r** | Read | Can view content | Can list files inside |
| **w** | Write | Can modify content | Can create/delete files |
| **x** | Execute | Can run the file | Can enter the directory |

---

## Reading Permissions

```bash
ls -l test.sh
```

Output:
```
-rwxr-xr--
```

| Section | Who | Permissions | Meaning |
|---|---|---|---|
| `-` | File type | — | `-` = file, `d` = directory |
| `rwx` | Owner | Read, Write, Execute | Owner can do everything |
| `r-x` | Group | Read, Execute | Group can view and run, not edit |
| `r--` | Others | Read only | Others can only view |

---

## Numeric (Octal) Representation

| Permission | Number |
|---|---|
| r (read) | 4 |
| w (write) | 2 |
| x (execute) | 1 |
| — (none) | 0 |

Add them up:

| Who | Permissions | Calculation | Result |
|---|---|---|---|
| Owner | rwx | 4+2+1 | **7** |
| Group | r-x | 4+0+1 | **5** |
| Others | r-- | 4+0+0 | **4** |

So `-rwxr-xr--` = **`754`**

### Common Permission Numbers

| Number | Permissions | Common Use |
|---|---|---|
| `755` | rwxr-xr-x | Scripts, directories |
| `644` | rw-r--r-- | Regular files |
| `700` | rwx------ | Private scripts |
| `600` | rw------- | Private files (SSH keys) |
| `777` | rwxrwxrwx | Everyone full access (avoid!) |

---

## chmod — Changing Permissions

### Numeric Method

```bash
chmod 755 script.sh     # rwxr-xr-x
chmod 644 config.txt    # rw-r--r--
chmod 754 test.sh       # rwxr-xr--
```

### Symbolic Method

**Who:** `u` = user/owner, `g` = group, `o` = others, `a` = all

**Operator:** `+` = add, `-` = remove, `=` = set exact

```bash
chmod g+w test.sh           # add write for group
chmod o-r test.txt          # remove read from others
chmod u+x,g+w test.txt      # add execute for user AND write for group
chmod u=rw,g=r,o= test.txt  # user=rw, group=r, others=nothing
chmod +x script.sh          # add execute for all
chmod a+r file.txt          # everyone can read
```

### Quick Reference

| Command | Meaning |
|---|---|
| `chmod a+r file` | Everyone can read |
| `chmod u+x file` | Owner can execute |
| `chmod go-w file` | Remove write for group and others |
| `chmod +x file` | Execute for all |

---

## Practice Example

```bash
touch demo.txt
chmod 640 demo.txt
ls -l demo.txt
```

Output:
```
-rw-r-----
```

- Owner: read & write (6 = rw)
- Group: read only (4 = r)
- Others: no permission (0 = ---)

---

## sudo — SuperUser Do

`sudo` lets you run a command **as root (admin)** temporarily.

```bash
sudo apt update
sudo mkdir /opt/myapp
sudo rm /etc/old-config
```

---

## Why Linux is Still Secure Despite sudo

Linux protects itself in **four layers**:

### 1. Not Everyone Has sudo

Only users in `/etc/sudoers` can use sudo. Others see:
```
user is not in the sudoers file. This incident will be reported.
```

Check your groups:
```bash
groups
```

If you see `sudo` or `wheel` in the list — you can use sudo.

### 2. Password Authentication

When you type `sudo`, Linux asks for **your password**. Even if someone is at your terminal, they can't do anything without it.

### 3. Limited Time Window (5 minutes)

After entering your password, you're trusted for only ~5 minutes. After that, it asks again.

### 4. Logging and Auditing

Every sudo action is recorded in:
```
/var/log/auth.log
```

System admins can see who ran which command, when, and on which machine.

### Principle of Least Privilege

> Work as a normal user most of the time.
> Use `sudo` only when absolutely needed.

Because root can destroy everything:
```bash
sudo rm -rf /    # deletes entire system!
```

### Summary

| Concept | Purpose |
|---|---|
| Only sudoers can run sudo | Restricts admin access |
| Password needed | Prevents misuse |
| 5-minute timeout | Temporary access |
| Logs in /var/log/auth.log | Accountability |
| Least privilege | Reduces damage chance |

---

## chown — Change File Owner

```bash
chown siddhesh file.txt              # change owner
chown siddhesh:developers file.txt   # change owner and group
chown -R siddhesh /myapp/            # change owner recursively
```

---

## Users and Groups

```bash
whoami                  # your current username
id                      # your user ID and groups
groups                  # list your groups
cat /etc/passwd         # list all users
cat /etc/group          # list all groups
```

---


