# Linux Fundamentals

---

## What is Linux?

**Linux** is a free, open-source operating system. It powers:
- Web servers (most of the internet runs on Linux)
- Android phones
- Cloud platforms (AWS, GCP, Azure use Linux)
- Docker & Kubernetes
- Supercomputers

---

## What is a Kernel?

The **kernel** is the heart of Linux. It sits between your software and hardware.

```
You (user) → Shell → Kernel → Hardware (CPU, Disk, RAM)
```

The kernel:
- Manages memory
- Schedules CPU tasks
- Controls devices (disk, network, etc.)

---

## What is a Linux Distro?

A **distro (distribution)** is Linux + extra software bundled together.

| Distro | Common Use |
|---|---|
| **Ubuntu** | Development, beginners |
| **CentOS / RHEL** | Enterprise servers |
| **Debian** | Stable servers |
| **Amazon Linux** | AWS EC2 |
| **Alpine** | Docker containers (very small) |

---

## What is a Shell?

A **shell** is a program that takes your commands and gives them to the kernel.

Real-world analogy:
- You = customer, Shell = waiter, Kernel = kitchen, Hardware = tools

### Types of Shells

| Shell | Command |
|---|---|
| **Bash** (most common) | `/bin/bash` |
| Bourne Shell | `/bin/sh` |
| Z Shell | `/bin/zsh` |
| C Shell | `/bin/csh` |

```bash
echo $SHELL    # check your current shell
```

---

## What is a Terminal?

- **Terminal** = the screen/window where you type commands
- **Shell** = the program running inside it (does the actual work)

---

## Linux Architecture

```
+-----------------------------+
|         Applications        |  <- Your programs (Java, etc.)
+-----------------------------+
|           Shell             |  <- Bash, Zsh
+-----------------------------+
|           Kernel            |  <- Core of Linux
+-----------------------------+
|          Hardware           |  <- CPU, RAM, Disk
+-----------------------------+
```

---

## Why Linux Matters for Developers

As a Java / backend engineer, you'll use Linux for:
- Docker & Kubernetes
- AWS EC2 / cloud servers
- Jenkins CI/CD pipelines
- Reading and debugging logs
- Deploying Spring Boot applications

```bash
kubectl get pods | grep auth     # daily real industry usage
```

---

## Final Mental Model

```
You → Terminal → Shell → Kernel → Hardware
```

Shell is your **remote control of Linux**.

---


