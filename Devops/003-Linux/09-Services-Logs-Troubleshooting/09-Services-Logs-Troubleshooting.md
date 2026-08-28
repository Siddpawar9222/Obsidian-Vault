# Services, Logs & Troubleshooting

---

## Viewing Logs with tail

### Read Last N Lines of a Log File

```bash
tail -n 100 /path/to/logfile.log    # last 100 lines
tail -n 200 /var/log/syslog         # last 200 lines
```

### Real-time Log Monitoring

```bash
tail -f /path/to/logfile.log             # follow new lines live
tail -n 100 -f /path/to/logfile.log      # last 100 + follow
```

`-f` means "follow" — keeps showing new lines as they are written.

**Spring Boot live log:**
```bash
tail -f /var/log/myapp/application.log
```

---

## Important Log File Locations

| Log File | What it Contains |
|---|---|
| `/var/log/syslog` | General system events |
| `/var/log/auth.log` | Login attempts, sudo usage |
| `/var/log/nginx/access.log` | Nginx HTTP requests |
| `/var/log/nginx/error.log` | Nginx errors |
| `/var/log/apt/history.log` | Package install history |

---


