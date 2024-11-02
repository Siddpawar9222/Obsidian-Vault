
---
## Settings Up Database

### Step 1: Update Your Package List
Run the following command to ensure your package list is up-to-date:
```bash
sudo apt update
```

### Step 2: Install PostgreSQL
Install PostgreSQL and the associated tools (`postgresql-contrib` includes useful utilities and extensions):
```bash
sudo apt install postgresql postgresql-contrib
```

### Step 3: Start and Enable PostgreSQL Service
Start PostgreSQL if it isn’t already running:
```bash
sudo systemctl start postgresql
```
To ensure it starts on server boot, enable it with:
```bash
sudo systemctl enable postgresql
```

### Step 4: Switch to the PostgreSQL User
PostgreSQL creates a user called `postgres` by default. Switch to this user to perform database setup tasks:
```bash
sudo -i -u postgres
```

### Step 5: Access PostgreSQL Command Line
Now, open the PostgreSQL command-line interface:
```bash
psql
```

### Step 6: Set a Password for the PostgreSQL User
Once inside the `psql` prompt, set a password for the `postgres` user:
```sql
ALTER USER postgres PASSWORD 'yourpassword';
```
Replace `yourpassword` with a secure password.

### Step 7: Create a New Database
While still in the `psql` prompt, create a new database:
```sql
CREATE DATABASE yourdbname;
```
Replace `yourdbname` with the desired name for your database.

### Step 8: Configure Remote Access (Optional)
If you need to allow remote connections to your PostgreSQL server, follow these additional steps:

1. **Edit PostgreSQL Configuration**  
   Open the PostgreSQL configuration file:
   ```bash
   sudo nano /etc/postgresql/<version>/main/postgresql.conf
   ```
   Replace `<version>` with your PostgreSQL version, like `12` or `14`.
   - Locate the line that starts with `#listen_addresses = 'localhost'` and change it to:
     ```conf
     listen_addresses = '*'
     ```

2. **Configure Client Authentication**
   Open the `pg_hba.conf` file to add rules for IP addresses allowed to connect:
   ```bash
   sudo nano /etc/postgresql/<version>/main/pg_hba.conf
   ```
   Add a line at the end for each IP or range you want to allow:
   ```conf
   host    all             all             0.0.0.0/0               md5
   ```
   This line allows all IPs. You may want to specify a particular IP or subnet for better security.

3. **Restart PostgreSQL**
   After making these changes, restart the PostgreSQL service:
   ```bash
   sudo systemctl restart postgresql
   ```

### Step 9: Exit psql
Type `\q` to exit the `psql` prompt:
```sql
\q
```

### Step 10: Test the Connection
You can test the connection using the `psql` command, either locally:
```bash
psql -U yourdbuser -d yourdbname -h 127.0.0.1 -W
```
It will ask for the password.


---


### Steps to Create a New PostgreSQL User

1. **Switch to PostgreSQL User**  
   Switch to the PostgreSQL user on your Linux server:
   ```bash
   sudo -i -u postgres
   ```

2. **Access PostgreSQL CLI**  
   Open the PostgreSQL command-line interface:
   ```bash
   psql
   ```

3. **Create a New User**  
   Use the `CREATE USER` command to add a new user. For example:
   ```sql
   CREATE USER newuser WITH ENCRYPTED PASSWORD 'newpassword';
   ```
   Replace `newuser` with your desired username and `newpassword` with a secure password.

4. **Grant Permissions (Optional)**  
   You can grant different types of access to this new user. For example:

   - **Grant Access to a Specific Database**:
     ```sql
     GRANT ALL PRIVILEGES ON DATABASE yourdbname TO newuser;
     ```
     This gives `newuser` full access to `yourdbname`.

   - **Grant Specific Role Privileges** (e.g., `CREATEDB`):
     ```sql
     ALTER USER newuser CREATEDB;
     ```
     This allows `newuser` to create new databases.

   - **Superuser Access** (use only if necessary):
     ```sql
     ALTER USER newuser WITH SUPERUSER;
     ```
     **Warning**: Superuser access gives unrestricted permissions, so it should be granted cautiously.

5. **Exit psql**  
   Type `\q` to exit the `psql` prompt:
   ```sql
   \q
   ```

6. **Test the New User’s Access**  
   You can verify the new user’s access by trying to log in with it:
   ```bash
   psql -U newuser -d yourdbname -h 127.0.0.1 -W
   ```
   This will prompt you for the password.

---
### Command PSQL commands :
```sql
-- Switch to a Specific Database
\c your_database;
-- Connects to `your_database`. Replace with your database name.

-- List All Databases
\l;
-- Shows a list of all databases on the PostgreSQL server.

-- Show Tables in the Current Database
\dt;
-- Lists all tables in the connected database.

-- Describe Table Structure
\d table_name;
-- Displays the schema/structure of `table_name`, including column names and data types.

-- List All Schemas in the Database
\dn;
-- Lists all schemas in the current database.

-- View All Indexes on a Table
\d index_name;
-- Shows details of `index_name`, such as columns it indexes and type (useful for optimization).

-- View Current Database Connection Info
\conninfo;
-- Displays information about the current database connection.

-- Create a New Database
CREATE DATABASE new_database;
-- Creates a new database called `new_database`.

-- Drop a Database
DROP DATABASE database_name;
-- Deletes `database_name` from the server. Make sure it's not in use.

-- Show Current User
SELECT current_user;
-- Displays the username of the current session.

-- Show Current Database
SELECT current_database();
-- Shows the name of the currently connected database.

-- List All Columns in a Table
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'table_name';
-- Lists each column and its data type for `table_name`.

-- Exit PostgreSQL
\q;
-- Exits the PostgreSQL shell.
```
---

### Common Steps Across Databases
1. **Updating Package List:** Ensures you’re getting the latest version and dependencies.
2. **Installation:** Installing the database software using the package manager (e.g., `apt`).
3. **Starting and Enabling the Service:** This makes sure the database server runs and starts on boot.
4. **Accessing the Database Command Line:** Most databases have a command-line client (like `psql` for PostgreSQL, `mysql` for MySQL).
5. **Setting User Password and Creating Databases:** These steps establish admin controls and default access.
6. **Granting Permissions:** Most databases require explicit permissions for users to interact with specific databases.
7. **Configuring Remote Access (Optional):** Editing configuration files to allow access from other machines is common for databases that might be accessed remotely.


