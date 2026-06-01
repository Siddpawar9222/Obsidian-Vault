
---

# First Understand the Problem

Imagine you are building a React application.

Your project needs:

- React
    
- React Router
    
- Axios
    
- Material UI
    
- Redux
    

These libraries are created by different developers around the world.

Question:

**How will you download, install, update, and manage all these dependencies?**

Doing it manually would be a nightmare.

That's why package managers exist.

---

# What is Node.js?

Before npm or Yarn, understand Node.js.

Normally JavaScript runs inside browsers:

- Chrome
    
- Firefox
    
- Edge
    

Example:

```javascript
console.log("Hello");
```

Browser executes it.

---

Node.js allows JavaScript to run outside the browser.

Example:

```javascript
console.log("Hello from Ubuntu");
```

Save:

```bash
app.js
```

Run:

```bash
node app.js
```

Output:

```text
Hello from Ubuntu
```

Node.js is basically:

> A JavaScript runtime that lets JavaScript run on your operating system.

---

# Verify Node Installation

You already installed Node 22.

Check:

```bash
node -v
```

Example:

```bash
v22.17.0
```

---

# What is npm?

npm stands for:

```text
Node Package Manager
```

When Node gets installed:

npm gets installed automatically.

Verify:

```bash
npm -v
```

Example:

```text
10.x.x
```

---

# What Does npm Do?

Think of Maven in Java.

Java:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
</dependency>
```

Maven downloads libraries.

---

Similarly:

```bash
npm install react
```

npm downloads React.

So:

| Java World     | JavaScript World |
| -------------- | ---------------- |
| Maven          | npm              |
| pom.xml        | package.json     |
| .m2 repository | node_modules     |

---

# Your First npm Project

Create folder:

```bash
mkdir npm-demo
cd npm-demo
```

Initialize project:

```bash
npm init
```

npm asks:

```text
package name:
version:
description:
```

Press Enter for defaults.

---

Now you'll get:

```text
package.json
```

Example:

```json
{
  "name": "npm-demo",
  "version": "1.0.0"
}
```

This is equivalent to:

```xml
pom.xml
```

in Maven.

---

# Install a Package

Let's install Axios.

```bash
npm install axios
```

npm downloads it.

New files appear:

```text
node_modules/
package.json
package-lock.json
```

---

# What is node_modules?

This folder contains:

```text
all downloaded libraries
```

Example:

```text
node_modules/
    axios/
    ...
```

Think:

```text
~/.m2/repository
```

in Maven.


---

# Using Axios

Create:

```javascript
const axios = require("axios");

console.log("Axios Loaded");
```

Run:

```bash
node app.js
```

---

# What is npx?

Many beginners confuse npm and npx.

---

npm:

```bash
npm install package
```

installs package.

---

npx:

```bash
npx package-name
```

runs package without permanently installing it.

---

Example:

```bash
npx create-react-app my-app
```

What happens?

1. Download package
    
2. Execute package
    
3. Create React app
    

No global installation needed.

---

Another example:

```bash
npx cowsay Hello
```

Output:

```text
 _______
< Hello >
 -------
        \   ^__^
         \  (oo)\_______
```

---

# Global Installation

Install globally:

```bash
npm install -g nodemon
```

Now:

```bash
nodemon app.js
```

works from anywhere.

---

Check global packages:

```bash
npm list -g --depth=0
```

---

# What is Yarn?

Yarn is another package manager.

Created by:

Meta

because npm used to be slow years ago.

---

npm:

```bash
npm install axios
```

Yarn:

```bash
yarn add axios
```

Same purpose.

---

# Install Yarn

Using npm:

```bash
npm install -g yarn
```

Verify:

```bash
yarn -v
```

---

# npm vs Yarn

|Feature|npm|Yarn|
|---|---|---|
|Default with Node|Yes|No|
|Popularity|Very High|High|
|Lock File|package-lock.json|yarn.lock|
|Install Package|npm install|yarn add|
|Remove Package|npm uninstall|yarn remove|
|Run Script|npm run|yarn|

---

Today npm is much improved.

For most projects:

```text
npm is enough
```

---

# Understanding the Complete Flow

When you execute:

```bash
npm install axios
```

Internally:

```text
1. npm reads package name
2. npm contacts npm registry
3. Finds latest version
4. Downloads package
5. Cache in `~/.npm`
6. Downloads sub-dependencies
7. Creates node_modules
8. Updates package.json
9. Updates package-lock.json
```

This is very similar to Maven downloading JARs from a repository.

---

# Commands You'll Use Daily

Initialize project:

```bash
npm init -y
```

Install package:

```bash
npm install axios
```

Install specific version:

```bash
npm install axios@1.11.0
```

Remove package:

```bash
npm uninstall axios
```

Install all dependencies:

```bash
npm install
```

Run project script:

```bash
npm run dev
```

List installed packages:

```bash
npm list
```

Check outdated packages:

```bash
npm outdated
```

Update packages:

```bash
npm update
```

---

# Why Does Node Need Physical Files Inside node_modules?

Because Node's module resolution algorithm works by searching directories.

Example:

```javascript
const axios = require("axios");
```

Node internally looks like:

```text
Current Project
    ↓
./node_modules/axios
    ↓
Found? Load it
```

It expects dependencies to exist near the project.

---

# Why Doesn't Java Need This?

Java uses:

```text
JVM
Classpath
Maven Repository
```

When you run:

```bash
mvn spring-boot:run
```

Maven builds a classpath like:

```text
spring.jar
hibernate.jar
mysql.jar
...
```

The JVM loads classes from those JAR files.

Java doesn't need every dependency physically copied into each project folder.

---

# Modern Improvement

Because `node_modules` can become huge, package managers such as:

- <font color="#ffc000">pnpm</font>
    
- <font color="#ffc000">Yarn</font>
    

introduced smarter approaches.

For example, pnpm stores packages centrally:

```text
~/.pnpm-store
```

and creates links into projects.

This is actually closer to Maven's approach.

```text
Project-A
     ↓
Project-B
     ↓
     links
     ↓
Central Store
```

So pnpm saves disk space.

---

### Quick Summary

|Feature|Maven|npm|
|---|---|---|
|Shared dependency storage|`.m2/repository`|Cache in `~/.npm`|
|Project-specific dependency folder|No|`node_modules`|
|Multiple versions per project|Managed via classpath|Natural through `node_modules`|
|Disk usage|Lower|Higher|
|Isolation|Moderate|Strong|
|Similar modern alternative|Maven|pnpm|

That's why every React, Angular, or Node.js project has its own `node_modules` folder, while Java projects typically share dependencies from `.m2/repository`.


---


