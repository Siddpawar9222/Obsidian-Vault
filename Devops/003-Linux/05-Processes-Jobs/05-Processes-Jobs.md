# Processes & Jobs

---

## What is a Process?

A **process** is any running program in Linux. Every time you run a command, start a server, or open an app — Linux creates a process for it.

Each process gets a unique **PID (Process ID)**.

---

## ps — List Processes

```bash
ps                      # processes in current terminal only
ps -ef                  # ALL processes on the system (full format)
ps -ef | grep java      # find only Java processes
ps -ef | grep nginx     # find nginx process
```

---

## kill — Stop a Process

```bash
kill 1234               # gracefully stop process with PID 1234
kill -9 1234            # force kill immediately (no cleanup)
```

> Use `kill -9` only when process is stuck and not responding.

---

## top — Live Process Monitor

```bash
top
```

Shows:
- CPU usage
- Memory usage
- All running processes (updated every second)

Press `q` to exit.

---

## Quick Notes from Basics

```bash
ps -ef | grep java      # find Java process and get its PID
kill -9 <PID>           # force stop it
```

---

