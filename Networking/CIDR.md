

---
## 🔶 What is CIDR?

**CIDR** stands for **Classless Inter-Domain Routing**. It is a method used to **efficiently allocate IP addresses** and **manage routing** in computer networks.

### 🔸 Example:

You may have seen an IP address written like this:

```
192.168.1.0/24
```

This format is called **CIDR notation**.

- `192.168.1.0` → This is the **IP address**.
    
- `/24` → This is the **subnet mask**, written in **prefix length** format (means first 24 bits are the **network part**).
    

---

## 🔶 Why was CIDR introduced?

Earlier, we had fixed IP classes like:

- Class A: `/8` → 16 million addresses
    
- Class B: `/16` → 65,000+ addresses
    
- Class C: `/24` → 256 addresses
    

This caused **waste of IPs**. For example, if a company needed 300 IPs, they had to take a Class B (65K IPs), wasting thousands.

👉 CIDR solves this by allowing **custom subnet sizes** like `/22`, `/30`, etc., giving just the number of IPs needed.

---

## 🔶 How does `/24`, `/26`, etc. work?

Each IP address is **32 bits** (for IPv4), so:

- `/24` → 32 - 24 = **8 bits left for hosts** → 2⁸ = 256 IPs
    
- `/26` → 32 - 26 = **6 bits left** → 2⁶ = 64 IPs
    

But 2 IPs are **reserved**:

- **1st IP** is **network address**
    
- **Last IP** is **broadcast address**
    

So for `/24`, usable IPs = 256 - 2 = **254**

---

## 🏠 Real-world Analogy:

Imagine a **street with houses**.

- The **street name** is the network part (like `192.168.1`)
    
- The **house number** is the host part (like `0` to `255`)
    
- CIDR controls how many houses (IPs) are allowed on the street.
    

---

## 🔶 How are IP addresses assigned?

### 🔹 Public IP:

Given by **ISPs (Internet Service Providers)**. They use **CIDR** to allocate a block of IPs to companies or home networks.

### 🔹 Private IP:

Used inside your home or office (LAN). Routers assign them using **DHCP** (Dynamic Host Configuration Protocol).

For example:

```
Router assigns:
- Laptop: 192.168.1.10
- Phone: 192.168.1.11
```

All devices share the same **public IP** outside (via NAT – Network Address Translation).

---

## 🔶 Summary

|Term|Meaning|
|---|---|
|CIDR|Flexible way to divide IPs (like 192.168.1.0/24)|
|/24|Subnet mask – 24 bits for network, 8 for hosts|
|DHCP|Protocol to automatically assign IPs|
|NAT|Translates private IPs to a public IP|

---


```
192.168.1.0/24
```

This is called **CIDR Notation** – which stands for **Classless Inter-Domain Routing**. It's used to **identify IP address blocks** and **subnet sizes**.

This has **two parts**:

1. `192.168.1.0` → The **network address**
    
2. `/24` → The **prefix length**, which tells how many bits are for the **network**
    

---

## 💡 Let's understand each part:

### ✅ 1. IP Address – `192.168.1.0`

This is the **starting point** or the **network ID** of this group of IP addresses.

> Think of it like the **name of a colony or area** (e.g., “Greenwood Society”).

It is written in **dotted decimal format**, made of 4 parts (called _octets_):

```
192.168.1.0
```

Each part is **8 bits**, so the full IP is 32 bits:

```
192        .168        .1          .0
11000000 .10101000 .00000001 .00000000
```

---

### ✅ 2. Subnet Mask – `/24`

This `/24` tells:

- The **first 24 bits** are for the **network**
    
- The remaining **8 bits (32 - 24)** are for **hosts (devices)**
    

> It's like saying: "The street name is 24 characters long, and the house number is 8 characters."

---

## 💡 How many IPs does `/24` give?

You have **8 bits for hosts**:

```
2^8 = 256 IP addresses
```

But 2 are **reserved**:

- **1 for Network Address** (first one: `192.168.1.0`)
    
- **1 for Broadcast Address** (last one: `192.168.1.255`)
    

So usable IPs = `256 - 2 = 254`

---

## ✅ IP Address Range for `/24`

So `192.168.1.0/24` gives IPs from:

|Type|IP Address|
|---|---|
|Network Address|192.168.1.0|
|Usable Start IP|192.168.1.1|
|Usable End IP|192.168.1.254|
|Broadcast Address|192.168.1.255|

All IPs in this range **belong to the same network**.

---
Great! Let's understand **Network Address** and **Broadcast Address** in very simple and clear English with examples. ✅

---

##  What is a Network?

A **network** is a group of computers/devices that can talk to each other using IP addresses.

Every network has:

- A **starting point** → called **Network Address**
    
- An **ending point for sending to all** → called **Broadcast Address**
    

---

## ✅ 1. **Network Address**

### 📌 Definition:

It is the **first IP address** in any network block.  
It **represents the whole network**, not a device.

> It’s like saying “This is the name of the entire colony.”

### 💡 Example:

For `192.168.1.0/24`:

- The **Network Address** is: `192.168.1.0`
    

### ❌ You cannot assign this to a device (computer, phone, etc.)

---

## ✅ 2. **Broadcast Address**

### 📌 Definition:

It is the **last IP address** in a network block.  
It is used to **send a message to all devices** in the network.

> It’s like using a loudspeaker in the colony to talk to **everyone**.

### 💡 Example:

For `192.168.1.0/24`:

- The **Broadcast Address** is: `192.168.1.255`
    

When a computer sends a message to this IP, **all devices** in the network will receive it.

### ❌ You also cannot assign this to a device.

---

## 📦 Example Summary for `/24`:

|Type|IP Address|
|---|---|
|Network Address|`192.168.1.0`|
|Usable Start IP|`192.168.1.1`|
|...|...|
|Usable End IP|`192.168.1.254`|
|Broadcast Address|`192.168.1.255`|

---

## 🧠 Real Life Example:

Imagine a colony:

- The **colony name** is `192.168.1.0` → Network Address
    
- Houses: `192.168.1.1` to `192.168.1.254`
    
- **Loudspeaker** for announcements to everyone: `192.168.1.255` → Broadcast Address

---

## 🏠 Three Main Types of IP Addresses:

|IP Type|Where Used|Who Can See It?|Example|
|---|---|---|---|
|Local IP|Inside your device|Only your own device|`127.0.0.1`|
|Private IP|Inside your home|Only inside your network|`192.168.x.x`|
|Public IP|On the internet|Visible to everyone|`103.25.202.5`|

---

### ✅ 1. **Local IP** (`127.0.0.1`)

- Also called **Loopback address**
    
- Used when a device wants to **talk to itself**
    
- Mostly used by **software** developers for testing
    

🧠 Think: "I talk to myself"

---

### ✅ 2. **Private IP** (used inside home, office, hotspot)

- Used **inside your Wi-Fi** or mobile hotspot
    
- Not visible on the internet
    
- Given by **your router or mobile**
    

📦 Examples:

- `192.168.x.x`
    
- `10.x.x.x`
    
- `172.16.x.x` to `172.31.x.x`
    

📱 Laptop: `192.168.43.123`  
📱 Mobile: `192.168.43.1` (acts as router)

---

### ✅ 3. **Public IP** (used on the internet)

- Assigned by your **Internet provider (ISP)** like Jio, Airtel, BSNL
    
- **Visible to websites**, Google, YouTube, etc.
    
- Shared by many devices behind 1 network using **NAT**
    

🌐 Example:

- When you search **"What is my IP?"**, you see your **public IP**
    

---

## 🧠 Real Life Analogy:

### 🏠 You live in a house inside a society:

- **Private IP** = your flat number inside the building (only visible inside society)
    
- **Public IP** = building’s address for the outside world (used by courier boy)
    
- **Local IP** = you writing a note to yourself in your diary
    

---

## 🔄 Quick Summary:

| Term       | Used Where        | Visible On Internet? | Given By       |
| ---------- | ----------------- | -------------------- | -------------- |
| Local IP   | Inside one device | ❌ No                 | Automatically  |
| Private IP | In local network  | ❌ No                 | Router/Mobile  |
| Public IP  | On the internet   | ✅ Yes                | ISP (like Jio) |

---

