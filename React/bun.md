
---

## First Understand the Problem with Node.js

You already know Node.js.

In a normal Node.js project, you need **many separate tools**:

- **Node.js** → to run JavaScript
- **npm / Yarn** → to manage packages
- **tsc / Babel** → to compile TypeScript
- **Webpack / Vite** → to bundle code
- **Jest** → to run tests

Every tool needs its own installation and configuration.

This adds complexity to every project.

---

**Bun solves this.**

> Think of it like this: Node.js is like buying a phone, charger, earphones, and case separately. Bun gives you all of them in one box.

---

## What is Bun?

Bun is a **modern, all-in-one JavaScript runtime** built from scratch by **Jarred Sumner**, first released in **2022**.

> Bun is not just a runtime. It is a complete toolkit — runtime + package manager + bundler + transpiler + test runner, all in one.

Bun is designed to be a **drop-in replacement for Node.js**.

This means: your existing Node.js code works in Bun without changes.

---

## What is Bun Built With?

Node.js is built with:

```
C++ language
V8 Engine (Chrome's JavaScript engine)
```

Bun is built with:

```
Zig language (low-level, very fast)
JavaScriptCore engine (Safari's JavaScript engine)
```

> JavaScriptCore starts up much faster than V8. That's one reason Bun is significantly faster than Node.js.

---

## What Does Bun Include?

Bun replaces 5 separate tools with just one:

| Tool Inside Bun  | What it Does                            | Replaces            |
|------------------|-----------------------------------------|---------------------|
| Runtime          | Runs JavaScript and TypeScript          | Node.js             |
| Package Manager  | Installs and manages packages           | npm / Yarn / pnpm   |
| Bundler          | Bundles your code for production        | Webpack / Vite      |
| Transpiler       | Converts TypeScript → JavaScript        | tsc / Babel         |
| Test Runner      | Runs your tests                         | Jest                |

---

## Install Bun

**macOS / Linux / WSL:**

```bash
curl -fsSL https://bun.sh/install | bash
```

**Verify installation:**

```bash
bun -v
```

Example output:

```
1.x.x
```

---

## Bun vs npm — Command Comparison

| npm Command                   | Bun Equivalent              |
|-------------------------------|-----------------------------|
| `npm init -y`                 | `bun init`                  |
| `npm install`                 | `bun install`               |
| `npm install axios`           | `bun add axios`             |
| `npm install jest --save-dev` | `bun add jest --dev`        |
| `npm uninstall axios`         | `bun remove axios`          |
| `npm run dev`                 | `bun run dev`               |
| `npm run build`               | `bun run build`             |
| `npx create-react-app my-app` | `bunx create-react-app my-app` |
| `node app.js`                 | `bun app.js`                |

---

## Your First Bun Project

**Create a project folder:**

```bash
mkdir bun-demo
cd bun-demo
```

**Initialize project:**

```bash
bun init
```

Bun asks a few questions and creates:

```
package.json
index.ts       ← notice .ts not .js (TypeScript by default!)
tsconfig.json
```

---

## Run a File

JavaScript file:

```bash
bun app.js
```

TypeScript file — works directly, no setup needed:

```bash
bun app.ts
```

> In Node.js, running TypeScript requires extra tools like `ts-node` or compiling with `tsc` first. Bun runs TypeScript directly out of the box.

---

## Big Advantage — TypeScript Works Directly

In Node.js:

```bash
# Step 1 — compile TypeScript to JavaScript
tsc app.ts

# Step 2 — then run the compiled file
node app.js
```

In Bun:

```bash
# Just run directly — no compilation needed
bun app.ts
```

Example TypeScript file:

```typescript
// app.ts
const name: string = "Bun";
console.log(`Hello from ${name}!`);
```

Run:

```bash
bun app.ts
```

Output:

```
Hello from Bun!
```

---

## Package Manager — Much Faster Than npm

Install all dependencies:

```bash
bun install
```

Add a package:

```bash
bun add axios
```

Add a dev dependency:

```bash
bun add jest --dev
```

Remove a package:

```bash
bun remove axios
```

---

**How much faster?**

```
npm install    →  ~5 to 10 seconds
bun install    →  ~0.3 to 0.8 seconds
```

> Bun is roughly 10x to 25x faster than npm for installing packages. Same `node_modules` folder is created. Same `package.json` is used. Just much faster.

---

## Bun is Compatible With npm Packages

Bun uses the same npm registry.

So every package you know — React, Express, Axios, Prisma — works with Bun.

```bash
bun add express
bun add react
bun add axios
```

No changes needed.

---

## Built-in Test Runner

Bun has a test runner built in. No need to install Jest separately.

Create a test file:

```typescript
// app.test.ts
import { expect, test } from "bun:test";

test("addition works", () => {
  expect(2 + 2).toBe(4);
});
```

Run tests:

```bash
bun test
```

Output:

```
✓ addition works [0.12ms]

1 pass
0 fail
```

> The syntax is identical to Jest. So if you know Jest, you already know Bun's test runner.

---

## Bun vs Node.js — Full Comparison

| Feature                  | Node.js              | Bun                     |
|--------------------------|----------------------|--------------------------|
| Created                  | 2009                 | 2022                     |
| Built with               | C++                  | Zig                      |
| JavaScript Engine        | V8 (Chrome)          | JavaScriptCore (Safari)  |
| TypeScript support       | Needs extra setup    | Built-in, runs directly  |
| Package manager          | npm (separate tool)  | Built-in                 |
| Bundler                  | Webpack / Vite       | Built-in                 |
| Test runner              | Jest (separate)      | Built-in                 |
| Startup speed            | Standard             | Much faster              |
| Package install speed    | Standard             | 10x–25x faster           |
| Maturity                 | Very mature (15 yrs) | Still growing (2 yrs)    |
| Industry adoption        | Very High            | Growing                  |
| Node.js compatibility    | —                    | 100% goal                |

---

## What Happens When You Run bun install?

```
1. Reads package.json
2. Contacts npm registry
3. Downloads packages in parallel (very fast)
4. Caches them in ~/.bun/install/cache
5. Creates node_modules/ folder
6. Creates bun.lockb (Bun's lock file — binary format, faster than JSON)
```

> Bun uses a **binary lock file** (`bun.lockb`) instead of a text-based JSON lock file like `package-lock.json`. Binary format is faster to read and write.

---

## Lock File Comparison

| Tool   | Lock File           | Format  |
|--------|---------------------|---------|
| npm    | package-lock.json   | JSON (text) |
| Yarn   | yarn.lock           | Text    |
| Bun    | bun.lockb           | Binary (faster) |

**Rule:** Always commit `bun.lockb` to Git. Never commit `node_modules`.

---

## Use Bun Just as a Package Manager (Without Switching Runtime)

You don't have to switch everything to Bun at once.

You can use Bun **only for installing packages** inside an existing Node.js project:

```bash
# In your existing Node.js project
bun install         # replaces npm install — much faster
bun add axios       # replaces npm install axios
```

Then continue running your project with Node.js:

```bash
node app.js
```

> This is the easiest way to start using Bun — just replace npm with Bun for installs, keep everything else the same.

---

## bunx — Equivalent of npx

Just like `npx` in npm, Bun has `bunx`:

```bash
bunx create-react-app my-app
```

Downloads, runs the package temporarily, does not install it globally.

---

## Should You Use Bun?

| Situation                        | Recommendation                                      |
|----------------------------------|-----------------------------------------------------|
| Learning JavaScript basics       | Stick with **Node.js** first                        |
| Personal / side projects         | Try **Bun** — great developer experience            |
| Need faster package installs     | Use **Bun** as package manager in Node.js projects  |
| Large production company project | Mostly **Node.js** still (more stable, mature)      |
| New project from scratch         | **Bun** is a great choice in 2024+                  |

---

## Daily Bun Commands Cheat Sheet

| Command                        | What it does                              |
|--------------------------------|-------------------------------------------|
| `bun init`                     | Create a new project                      |
| `bun app.ts`                   | Run a TypeScript or JavaScript file       |
| `bun install`                  | Install all dependencies                  |
| `bun add axios`                | Add a package                             |
| `bun add jest --dev`           | Add a dev-only package                    |
| `bun remove axios`             | Remove a package                          |
| `bun run dev`                  | Run a project script                      |
| `bun test`                     | Run all tests                             |
| `bunx create-react-app my-app` | Run a package without installing globally |
| `bun -v`                       | Check Bun version                         |
| `bun upgrade`                  | Upgrade Bun to latest version             |

---

## Summary

Bun is the **next generation JavaScript toolkit**.

It is faster, simpler, and all-in-one.

Node.js is still the industry standard, but Bun is rapidly growing and worth learning today.

> **Key rule:** Bun is 100% compatible with Node.js. You can adopt it gradually — start by using `bun install` in your Node.js project and move further as you get comfortable.

---

*Node.js solved the problem of running JavaScript outside the browser. Bun solves the problem of making that experience fast, simple, and all-in-one.*