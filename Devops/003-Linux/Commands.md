
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
