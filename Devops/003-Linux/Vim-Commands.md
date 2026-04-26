

---

# 🧠 1. Modes (Most important concept)

Vim works in modes:

- **Normal mode** → navigation & commands
    
- **Insert mode** → typing text
    
- **Visual mode** → selecting text
    

👉 Switch:

- `i` → insert mode
    
- `Esc` → back to normal mode
    

---

# ✍️ 2. Insert Mode (Typing faster)

| Command | Meaning             |
| ------- | ------------------- |
| `i`     | insert at cursor    |
| `a`     | insert after cursor |
| `o`     | new line below      |
| `O`     | new line above      |

💡 Real example:  
You are editing Java code → use `o` to quickly add next line.

---

# 🚀 3. Save & Exit (VERY IMPORTANT)

|Command|Meaning|
|---|---|
|`:w`|save|
|`:q`|quit|
|`:wq`|save & quit|
|`:q!`|force quit (ignore changes)|

👉 Real world:

```bash
git commit
```

→ Vim opens → write message → `Esc` → `:wq`

---

# 🔎 4. Navigation (Move like a pro)

|Command|Meaning|
|---|---|
|`h j k l`|left, down, up, right|
|`w`|next word|
|`b`|previous word|
|`0`|start of line|
|`$`|end of line|
|`gg`|top of file|
|`G`|bottom of file|

💡 Example:

- Jump to bottom logs file → `G`
    
- Jump to start → `gg`
    

---

# ✂️ 5. Copy, Cut, Paste

|Command|Meaning|
|---|---|
|`yy`|copy line|
|`dd`|delete (cut) line|
|`p`|paste below|
|`P`|paste above|

💡 Example:  
Copy a method → `yy` → go somewhere → `p`

---

# 🔄 6. Undo / Redo

|Command|Meaning|
|---|---|
|`u`|undo|
|`Ctrl + r`|redo|

---

# 🔍 7. Search (Very useful in coding)

|Command|Meaning|
|---|---|
|`/word`|search forward|
|`?word`|search backward|
|`n`|next result|
|`N`|previous result|

💡 Example:

```bash
/searchUser
```

→ jump between all occurrences

---

# ✏️ 8. Replace

### Replace single word:

```bash
:%s/old/new/g
```

👉 Example:

```bash
:%s/user/customer/g
```

---

# 🎯 9. Visual Mode (Select like mouse)

|Command|Meaning|
|---|---|
|`v`|select characters|
|`V`|select whole line|
|`Ctrl + v`|block selection|

💡 Example:  
Select multiple lines → press `V` → move → `d`

---

# ⚡ 10. Developer Power Shortcuts

### Delete word:

```bash
dw
```

### Change word:

```bash
cw
```

### Delete till end of line:

```bash
D
```

### Repeat last command:

```bash
.
```

💡 Example:

- Delete one word → `dw`
    
- Repeat 10 times → just press `.` repeatedly
    

---

# 🧑‍💻 Real Developer Scenario

You open a config file:

```bash
vim application.properties
```

What you do:

1. Search → `/server.port`
    
2. Edit → `i`
    
3. Save → `:wq`
    

---

# 🧠 Simple Memory Trick

Think like this:

- `d` → delete
    
- `y` → copy (yank)
    
- `p` → paste
    
- `w` → word
    
- `$` → end
    

👉 Combine:

- `dw` = delete word
    
- `d$` = delete till end
    

---

# 🚨 Important Advice

Don’t try to memorize everything at once.

Start with:

- `i`, `Esc`
    
- `:wq`
    
- `dd`, `yy`, `p`
    
- `/search`
    
- `u`
    

👉 Use daily → automatically you’ll become fast.

---
