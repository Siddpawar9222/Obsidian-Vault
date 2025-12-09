
---


### **1. What is System Design?**

<font color="#ffc000">System design is the process of **planning and creating the structure of a software system** so it can work efficiently, handle many users, and be easy to maintain.</font>


---

### **2. Why System Design is Important**

- To handle **many users** without crashing (like Facebook or Amazon).
    
- To make the system **fast** and **efficient**.
    
- To make it **easy to add new features** later.
    
- To **avoid mistakes** before writing a lot of code.
    

---

### **3. Two Types of System Design**

1. **High-Level Design (HLD)**
    
    - Big picture view.
        
    - Decides **main components** and **how they communicate**.
        
    - Example: For an e-commerce app, you decide there will be:
        
        - User service
            
        - Product service
            
        - Order service
            
        - Payment service
            
    - You also decide how they talk (APIs, database, etc.)
        
2. **Low-Level Design (LLD)**
    
    - Detailed view.
        
    - Decides **how each component works internally**.
        
    - Example: In User service:
        
        - Classes: `User`, `Address`, `LoginSession`
            
        - Functions: `login()`, `logout()`, `updateProfile()`
            

---

### **4. Main Components in System Design**

- **Clients:** Users’ devices (mobile, browser)
    
- **Servers:** Handle requests from clients
    
- **Databases:** Store information (like user info, orders)
    
- **APIs:** Communication between different services
    
- **Caching:** For faster access to frequently used data
    
- **Load Balancers:** Spread requests across servers so no server gets overloaded
    

---

### **5. Real-World Example**

Imagine **WhatsApp**:

1. Users send messages from phones (clients)
    
2. Messages go to WhatsApp servers
    
3. Servers store messages in a database and deliver to other users
    
4. To handle millions of messages at the same time:
    
    - WhatsApp uses multiple servers
        
    - Uses caching to deliver messages faster
        
    - Ensures messages are delivered even if someone is offline
        

---

**<font color="#ffc000">System design is about planning software like an engineer plans a building, making sure it works well for everyone.</font>**

---
