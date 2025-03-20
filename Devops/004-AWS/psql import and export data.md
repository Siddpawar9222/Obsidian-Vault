


---


```sql
--(export) Dump database
 pg_dump -U <username> -d <database_name> -f <file_path>.sql

--Log in as superuser
 psql -U postgres -d postgres

-- Create New User
 CREATE USER newuser WITH ENCRYPTED PASSWORD 'newpassword';

--Create Database
CREATE DATABASE database_name;

--Grant access to specific database
GRANT ALL PRIVILEGES ON DATABASE database_name TO newuser;

--Give alter permissions
ALTER DATABASE database_name OWNER TO newuser;

--Import .sql file in database
psql -U newuser -d database_name -f file.sql

--Log in as newuser
psql -U newuser -d database_name





promotenus and grapana
audit log
flyway integration


UI testing with tejawi
admin , class fee , payment , student 
```