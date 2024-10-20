
---

### Step-by-Step Guide for Troubleshooting PostgreSQL Connection Issues

#### 1. **Check PostgreSQL Version**
First, make sure you have PostgreSQL installed and check its version:
```bash
psql --version
```

#### 2. **Connect to PostgreSQL**
Connect to PostgreSQL using the following command:
```bash
psql -U postgres
```
This assumes you are using the default user `postgres`. Replace it with your username if different.

---

### Common PostgreSQL Setup Commands:

#### a. **Create a New User**
To create a new user in PostgreSQL:
```sql
CREATE USER new_user WITH PASSWORD 'your_password';
```

#### b. **Grant Superuser Privileges to a User**
If you need to give superuser privileges to the user:
```sql
ALTER USER new_user WITH SUPERUSER;
```

#### c. **Grant Database Access**
To allow a user access to a specific database:
```sql
GRANT ALL PRIVILEGES ON DATABASE your_database TO new_user;
```

#### d. **Drop a User**
If you need to remove a user:
```sql
DROP USER username;
```

#### e. **View List of Users**
To see all users in the PostgreSQL system:
```sql
\du
```

#### f. **Exit PostgreSQL**
To quit the PostgreSQL shell:
```bash
\q
```

---

### Troubleshooting PostgreSQL Connection Issue in IntelliJ

If you are having trouble connecting to your PostgreSQL database from IntelliJ, here’s a step-by-step guide to troubleshoot the issue:

#### 1. **Check if PostgreSQL is Running**
Make sure PostgreSQL is running on your server. You can check this with:
```bash
sudo systemctl status postgresql
```
If PostgreSQL is not running, you can start it with:
```bash
sudo systemctl start postgresql
```

#### 2. **Check PostgreSQL Logs**
Sometimes, error logs can give you useful information about what’s going wrong. To see recent logs, run:
```bash
sudo tail -f /var/log/postgresql/postgresql-<version>-main.log
```

#### 3. **Allow Remote Connections**
Make sure PostgreSQL is set up to allow remote connections:

- Open `postgresql.conf` and ensure `listen_addresses` is set to `'*'` (or the IP address of your server):
  ```plaintext
  listen_addresses = '*'
  ```

- In `pg_hba.conf`, make sure remote connections are allowed by adding this line:
  ```plaintext
  host    all             all             0.0.0.0/0            md5
  ```

After making any changes, restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

#### 4. **Check if Port 5432 is Open**
Verify that PostgreSQL is listening on port 5432:
```bash
sudo netstat -plnt | grep 5432
```
You should see output showing that PostgreSQL is listening on port `5432`:
```plaintext
tcp        0      0 0.0.0.0:5432           0.0.0.0:*               LISTEN
```

#### 5. **Firewall Settings**
Make sure your firewall isn’t blocking port 5432. If you are using `ufw`, allow connections to this port:
```bash
sudo ufw allow 5432/tcp
```
For `firewalld`, run:
```bash
sudo firewall-cmd --add-port=5432/tcp --permanent
sudo firewall-cmd --reload
```

#### 6. **Ensure Correct User and Password**
Double-check that the user you're using exists in PostgreSQL and has the correct privileges. 

To verify, log into PostgreSQL and check:
```bash
sudo -u postgres psql
\du
\l
```
If the user does not exist or lacks privileges, you can create the user and grant access:
```sql
CREATE USER root WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE rms TO root;
```

#### 7. **Test Connection Locally**
Try connecting locally from the server itself to check if PostgreSQL is working properly:
```bash
psql -U root -d rms
```
If it works locally but not remotely, the issue is likely with network or configuration settings.

#### 8. **Check for Version Compatibility**
Ensure that the PostgreSQL version on your server is compatible with the client version you're using in IntelliJ. PostgreSQL is generally backward-compatible, but it’s still a good idea to double-check.

By following these steps, you should be able to resolve your connection issue in IntelliJ. Let me know if you encounter any specific errors during the process!


---
  psql error while creating table automatically by spring boot
  [Link1](https://serverfault.com/questions/488669/postgres-insert-error-permission-denied-for-schema-public)
  [Link2](https://stackoverflow.com/questions/67276391/why-am-i-getting-a-permission-denied-error-for-schema-public-on-pgadmin-4)
  [Link3](https://stackoverflow.com/questions/3602450/where-does-postgresql-store-configuration-conf-files)