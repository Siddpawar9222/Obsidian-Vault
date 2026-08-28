# Networking & SSH

---

## Check What's Running on a Port

One of the most common real-world tasks — find which process is using a specific port.

### lsof — List Open Files (including network ports)

In Linux, **everything is treated as a file** — including network connections.

```bash
sudo lsof -i :80       # what's on port 80
sudo lsof -i :8080     # what's on port 8080
sudo lsof -i :443      # HTTPS port
```

**Breaking down `sudo lsof -i :80`:**

| Part | Meaning |
|---|---|
| `sudo` | Run as admin (some processes are protected) |
| `lsof` | List Open Files |
| `-i` | Show network connections |
| `:80` | Filter by port 80 |

**Example output:**
```
COMMAND   PID   USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
nginx    1234   root   6u   IPv4  12345      0t0  TCP *:80 (LISTEN)
```

How to read it:

| Column | Meaning |
|---|---|
| COMMAND | Program name (nginx, java, etc.) |
| PID | Process ID |
| USER | Who started it |
| NAME | Port and connection status |

**When to use this:**
```
Error: Port 80 already in use
```
Run `sudo lsof -i :80` → find which process → stop it.

---

## Stop the Process Blocking a Port

```bash
# Stop nginx
sudo systemctl stop nginx

# Stop apache
sudo systemctl stop apache2

# Force kill by PID
sudo kill -9 1234
```

> Warning: Don't kill processes blindly — know what you're stopping first.

---



