
---

## First Understand the Problem

Imagine you are building a React application.

Your project needs:

- React
- React Router
- Axios
- Material UI
- Redux

These libraries are created by **different developers** around the world.

**Question:**

> How will you download, install, update, and manage all these dependencies?

Doing it **manually** would be a nightmare.

That's why **package managers** exist.

---

## What is Node.js?

Before learning npm or Yarn, understand Node.js first.

Normally, JavaScript runs **inside browsers**:

- Chrome
- Firefox
- Edge

Example — this runs in the browser:

```javascript
console.log("Hello");
```

---

**Node.js allows JavaScript to run OUTSIDE the browser.**

Example:

```javascript
// app.js
console.log("Hello from Terminal");
```

Save the file as `app.js`, then run it from terminal:

```bash
node app.js
```

Output:

```
Hello from Terminal
```

**Node.js is simply:**

> A JavaScript runtime environment that lets JavaScript run on your operating system — outside the browser.

---

## Verify Node.js Installation

You already installed Node.js 22.

Check your version:

```bash
node -v
```

Example output:

```
v22.17.0
```

---

## What is npm?

npm stands for:

```
Node Package Manager
```

**When you install Node.js, npm is automatically installed along with it.**

Verify:

```bash
npm -v
```

Example output:

```
10.x.x
```

---

## What Does npm Do?

Think of **Maven** in Java.

In Java, you write:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

Maven **automatically downloads** that library.

---

Similarly in JavaScript:

```bash
npm install react
```

npm **automatically downloads** React.

---

**Comparison Table:**

| Java World       | JavaScript World  |
|------------------|-------------------|
| Maven / Gradle   | npm               |
| pom.xml          | package.json      |
| ~/.m2/repository | node_modules/     |

---

## Your First npm Project

**Create a project folder:**

```bash
mkdir npm-demo
cd npm-demo
```

**Initialize the project:**

```bash
npm init
```

npm will ask a few questions:

```
package name:    (press Enter for default)
version:         (press Enter for default)
description:     (press Enter for default)
```

Press **Enter** to accept all defaults.

---

**Shortcut — skip all questions:**

```bash
npm init -y
```

The `-y` flag means "yes to everything."

---

After this, you get a file:

```
package.json
```

Example content:

```json
{
  "name": "npm-demo",
  "version": "1.0.0",
  "description": ""
}
```

This is equivalent to `pom.xml` in Maven.

---

## Install a Package

Let's install **Axios** (a popular HTTP client library):

```bash
npm install axios
```

npm downloads it.

New files and folders appear:

```
node_modules/
package.json        ← updated automatically
package-lock.json   ← new file (explained below)
```

---

## What is node_modules?

This folder contains **all downloaded libraries**.

Example structure:

```
node_modules/
    axios/
    form-data/       ← dependency of axios
    ...
```

> Think of it like `~/.m2/repository` in Maven — but stored **inside each project folder**.

**Important note:** You should **never commit** `node_modules` to Git. Add it to `.gitignore`. When someone else clones your project, they just run `npm install` and npm recreates it automatically.

---

## What is npx?

Many beginners confuse `npm` and `npx`.

---

**npm** = installs a package permanently

```bash
npm install package-name
```

---

**npx** = downloads, runs a package temporarily, then removes it

```bash
npx package-name
```

---

**Real-world example:**

```bash
npx create-react-app my-app
```

What happens internally:

1. npx downloads `create-react-app` temporarily
2. Runs it to create a React project
3. Does NOT permanently install it on your system

This is cleaner — your system stays tidy.

---

**Fun example to test npx:**

```bash
npx cowsay Hello
```

Output:

```
 _______
< Hello >
 -------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

This proves npx ran a package without permanently installing it.

---

## Global Installation

By default, `npm install` installs packages **only inside the current project**.

To install a package **globally** (available system-wide):

```bash
npm install -g nodemon
```

Now you can run `nodemon` from any folder:

```bash
nodemon app.js
```

> `nodemon` automatically restarts your Node.js app when files change — very useful during development.

**Check all globally installed packages:**

```bash
npm list -g --depth=0
```

---

## What is Yarn?

Yarn is **another package manager** for JavaScript.

Created by **Meta (Facebook)** — because npm used to be very slow a few years ago.

Today npm has improved a lot. But Yarn is still widely used in many companies.

---

**npm:**

```bash
npm install axios
```

**Yarn (same result):**

```bash
yarn add axios
```

---

## Install Yarn

Install Yarn using npm:

```bash
npm install -g yarn
```

Verify:

```bash
yarn -v
```

---

## npm vs Yarn Comparison

| Feature              | npm                  | Yarn                |
|----------------------|----------------------|---------------------|
| Comes with Node.js   | ✅ Yes               | ❌ No (install separately) |
| Popularity           | Very High            | High                |
| Lock file            | package-lock.json    | yarn.lock           |
| Install package      | npm install axios    | yarn add axios      |
| Remove package       | npm uninstall axios  | yarn remove axios   |
| Run a script         | npm run dev          | yarn dev            |

> **Recommendation for beginners:** Start with npm. It comes built-in with Node.js and is more than enough for most projects.

---

## What Happens Internally When You Run npm install?

When you run:

```bash
npm install axios
```

Internally, npm does this:

```
1. Reads the package name (axios)
2. Contacts the npm registry (registry.npmjs.org)
3. Finds the latest stable version
4. Downloads the package files
5. Caches them in ~/.npm (so next time it's faster)
6. Also downloads sub-dependencies (packages that axios depends on)
7. Creates/updates node_modules/ folder
8. Updates package.json (adds axios under "dependencies")
9. Updates package-lock.json (locks exact versions)
```

This is very similar to how Maven downloads JARs from Maven Central and stores them in `~/.m2`.

---

## Daily Commands You'll Use

**Initialize a new project:**

```bash
npm init -y
```

**Install a package:**

```bash
npm install axios
```

**Install a specific version:**

```bash
npm install axios@1.7.0
```

**Install as dev dependency (only needed during development, not in production):**

```bash
npm install jest --save-dev
```

**Remove a package:**

```bash
npm uninstall axios
```

**Install all dependencies** (when someone clones your project):

```bash
npm install
```

**Run a project script:**

```bash
npm run dev
npm run build
npm start
```

**List installed packages:**

```bash
npm list
```

**Check for outdated packages:**

```bash
npm outdated
```

**Update packages:**

```bash
npm update
```

---

## Why Does Node.js Need a node_modules Folder Inside Every Project?

Because of how Node.js **finds packages**.

When you write:

```javascript
const axios = require("axios");
```

Node.js searches like this:

```
Current project folder
    ↓
./node_modules/axios
    ↓
Found? → Load it
Not Found? → Go up to parent folder and check again
```

It expects dependencies to exist **near the project** on disk.

---

## Why Doesn't Java Need This?

Java uses a completely different system:

```
JVM (Java Virtual Machine)
Classpath
Maven Local Repository (~/.m2)
```

When you run:

```bash
mvn spring-boot:run
```

Maven builds a **classpath** like:

```
spring.jar
hibernate.jar
mysql.jar
```

The JVM loads classes directly from those JAR files.

**Java doesn't copy every dependency into each project folder.** All projects share the same `~/.m2/repository`.

---

## The node_modules Problem and Modern Solution

Because `node_modules` can become **huge** (sometimes 500MB+), newer package managers introduced smarter approaches.

**pnpm(Performant npm)** stores packages centrally and links them into projects:

```
Project-A  ──────┐
                 ↓
Project-B  ──── Central Store (~/.pnpm-store)
                 ↑
Project-C  ──────┘
```

This saves a LOT of disk space — closer to how Maven works.

---

## Final Summary Table

| Feature                        | Maven (Java)        | npm (JavaScript)     | pnpm (JavaScript)    |
|-------------------------------|---------------------|----------------------|----------------------|
| Shared dependency storage     | ~/.m2/repository    | ~/.npm (cache only)  | ~/.pnpm-store        |
| Project-specific folder       | ❌ No               | ✅ node_modules/     | Links, not copies    |
| Disk usage                    | Lower               | Higher               | Lower (like Maven)   |
| Isolation between projects    | Moderate            | Strong               | Strong               |

---

## Quick Cheat Sheet

| Command                          | What it does                             |
|----------------------------------|------------------------------------------|
| `npm init -y`                    | Create a new project                     |
| `npm install axios`              | Install a package                        |
| `npm install axios@1.7.0`        | Install specific version                 |
| `npm install jest --save-dev`    | Install as dev-only dependency           |
| `npm uninstall axios`            | Remove a package                         |
| `npm install`                    | Install all dependencies from package.json |
| `npm run dev`                    | Run a script                             |
| `npm outdated`                   | See which packages are outdated          |
| `npm update`                     | Update packages                          |
| `npx create-react-app my-app`    | Run a package without installing         |
| `npm install -g nodemon`         | Install globally                         |
| `npm list -g --depth=0`          | List global packages                     |

---