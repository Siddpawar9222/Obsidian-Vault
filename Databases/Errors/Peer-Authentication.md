

---

### 💡 What is “Peer authentication”?

In PostgreSQL, **peer authentication** means:  
👉 “Allow login _only if_ your **Linux username** and **PostgreSQL username** are the same.”

---

### 🧠 Example

Let’s say your Linux username is:

```
geekysiddhesh
```

Now you try:

```bash
psql -U root -d techeazy_liquibase
```

Here:

- PostgreSQL username = `root`
    
- Linux username = `geekysiddhesh`
    

PostgreSQL checks:

> “Does Linux user `geekysiddhesh` = PostgreSQL user `root`?”

Answer = ❌ No  
So it **denies the connection** and shows:

```
FATAL: Peer authentication failed for user "root"
```

---

### 🔑 So what’s the fix?

You must tell PostgreSQL:

> “Don’t check Linux usernames — just ask for a password.”

That’s what changing `peer` → `md5` in the file `pg_hba.conf` does.

---

### 🧩 Summary

|Term|Meaning|
|---|---|
|**peer**|Linux username must match PostgreSQL username|
|**md5**|Ask for a password (normal login)|
|**trust**|Allow anyone to log in (not safe)|

---

So in your case:

- Linux user: `geekysiddhesh`
    
- PostgreSQL user: `root`  
    → Peer check fails  
    ✅ Changing to `md5` makes PostgreSQL ask for a password instead, which solves the issue.
    

Would you like me to show you a **small diagram** explaining this visually (Linux user vs PostgreSQL user)?