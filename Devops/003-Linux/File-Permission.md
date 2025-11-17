
---

## 🧠 What are File Permissions?

In Linux, **everything is a file** — text files, programs, directories, devices, etc.  
To keep files secure, Linux controls **who can do what** using **file permissions**.

Each file or folder has **three types of permissions** for **three types of users**.

---

## 👥 Three Types of Users

|User Type|Meaning|Example|
|---|---|---|
|**Owner (u)**|The person who created the file|You|
|**Group (g)**|Other users in the same group|Your teammates|
|**Others (o)**|Everyone else|Public users|

---

## 🔐 Three Types of Permissions

|Symbol|Permission|Meaning on File|Meaning on Directory|
|---|---|---|---|
|**r**|Read|Can view content|Can list files|
|**w**|Write|Can modify content|Can create/delete files|
|**x**|Execute|Can run the file|Can enter the directory|

---

## 🧩 Example

Let’s say you have a file named `test.sh`.

```bash
ls -l test.sh
```

Output:

```
-rwxr-xr--
```

Let’s break this down 👇

| Section | Who                                                               | Permission           | Meaning                            |
| ------- | ----------------------------------------------------------------- | -------------------- | ---------------------------------- |
| `-`     | File type (– = file if at start otherwise nothing, d = directory) | —                    | It’s a normal file                 |
| `rwx`   | Owner                                                             | Read, Write, Execute | Owner can do everything            |
| `r-x`   | Group                                                             | Read, Execute        | Group can view & run, but not edit |
| `r--`   | Others                                                            | Read only            | Others can only view               |

---

## 🧮 Numeric (Octal) Representation

Each permission has a number:

|Permission|Number|
|---|---|
|r (read)|4|
|w (write)|2|
|x (execute)|1|

Add them up for each user type:

|Type|Permissions|Sum|Example|
|---|---|---|---|
|Owner|rwx|4+2+1=7||
|Group|r-x|4+0+1=5||
|Others|r--|4+0+0=4||

So `-rwxr-xr--` = **`754`**

---

## 🧰 Changing Permissions

Use the `chmod` command:

### 1️⃣ Symbolic Method

```bash
chmod g+w test.sh
```

➡ Adds **write** permission to **group**

### 2️⃣ Numeric Method

```bash
chmod 754 test.sh
```

➡ Sets permissions to **rwxr-xr--**

---

## 📁 Example for Directory

```bash
mkdir mydir
chmod 755 mydir
```

|Permission|Effect|
|---|---|
|Owner (7)|Full access|
|Group (5)|Read & enter|
|Others (5)|Read & enter|

---

## ⚙️ Quick Practice

```bash
touch demo.txt
chmod 640 demo.txt
ls -l demo.txt
```

Output:

```
-rw-r-----
```

✅ Owner → read & write  
✅ Group → read only  
🚫 Others → no permission


---

## 🧠 What is Symbolic Method?

The **symbolic method** in Linux means changing permissions using **letters (symbols)** instead of numbers.

We use:

- **u** → user (owner)
    
- **g** → group
    
- **o** → others
    
- **a** → all (user + group + others)
    

And we use:

- **+** → add permission
    
- **-** → remove permission
    
- **=** → set exact permission
    

---

## 🧩 Example File

Let's say you have:

```bash
ls -l test.txt
```

Output:

```
-rw-r--r--
```

That means:

- **user (u)** → rw
    
- **group (g)** → r
    
- **others (o)** → r
    

---

## 🔧 Example 1 — Add Permission

```bash
chmod g+w test.txt
```

👉 Meaning: give **write** permission to the **group**

Now:

```
-rw-rw-r--
```

---

## 🔧 Example 2 — Remove Permission

```bash
chmod o-r test.txt
```

👉 Meaning: remove **read** permission from **others**

Now:

```
-rw-rw----
```

---

## 🔧 Example 3 — Add Multiple Permissions

```bash
chmod u+x,g+w test.txt
```

👉 Meaning:

- give **execute** to **user**
    
- give **write** to **group**
    

Result:

```
-rwxrw----
```

---

## 🔧 Example 4 — Set Exact Permissions

```bash
chmod u=rw,g=r,o= test.txt
```

👉 Meaning:

- user → read, write
    
- group → read
    
- others → no permission
    

Result:

```
-rw-r-----
```

---

## 🧠 Quick Trick

| Command           | Meaning                           |
| ----------------- | --------------------------------- |
| `chmod a+r file`  | Everyone can read                 |
| `chmod u+x file`  | Owner can execute                 |
| `chmod go-w file` | Remove write for group and others |
| `chmod a=x file`  | Only execute for everyone         |
| `chmod +x file`   | Execute for all                   |

---

