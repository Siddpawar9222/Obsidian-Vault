# Environment Variables & Package Management

---

## Environment Variables

**Environment variables** are key-value pairs that your shell and programs use for configuration.

```bash
echo $PATH          # see your PATH variable
echo $HOME          # your home directory
echo $USER          # your username
echo $SHELL         # your current shell
```

### View All Environment Variables

```bash
env                 # list all variables
printenv PATH       # print a specific variable
```

### Set a Variable (Temporary — current session only)

```bash
export JAVA_HOME=/usr/lib/jvm/java-17
export PORT=8080
```

### Make It Permanent

Add to `~/.bashrc`:

```bash
echo 'export JAVA_HOME=/usr/lib/jvm/java-17' >> ~/.bashrc
source ~/.bashrc    # reload to apply
```

---

## PATH Variable

`PATH` tells Linux **where to look for commands**.

```bash
echo $PATH
```

Output:
```
/usr/local/bin:/usr/bin:/bin:/home/siddhesh/.local/bin
```

Add a new directory to PATH:

```bash
export PATH=$PATH:/opt/myapp/bin
```

---

## Package Management (apt — Ubuntu/Debian)

```bash
sudo apt update                    # update package list
sudo apt upgrade                   # upgrade installed packages
sudo apt install nginx             # install nginx
sudo apt install openjdk-17-jdk    # install Java 17
sudo apt remove nginx              # uninstall nginx
sudo apt search java               # search for packages
apt list --installed               # list installed packages
```

---


