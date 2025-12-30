
---

## 🔹 Heap Layout in Java

Heap is divided into:

1. **Young Generation**
    
    - **Eden Space** → new objects created here
        
    - **Survivor 0 (S0)** and **Survivor 1 (S1)** → used to hold objects that survive GC
        
2. **Old Generation (Tenured)** → long-lived objects moved here after surviving several GCs
    

---

## 🔹 Dry Run Example

### Step 1: Program starts → objects created

- Suppose our program creates 5 objects: `A, B, C, D, E`.
    
- All new objects go into **Eden**.
    

```
Eden:   A, B, C, D, E
S0:     (empty)
S1:     (empty)
Old:    (empty)
```

---

### Step 2: Minor GC (Mark + Sweep on Young Gen)

- GC checks which objects are still **reachable** from root variables.
    
- Assume only `A, C, D` are reachable; `B` and `E` are garbage.
    

👉 **Mark phase:** Mark `A, C, D` as alive.  
👉 **Sweep phase:** Remove `B, E`.

Now **surviving objects (A, C, D)** are copied to **Survivor space (S0)**.

```
Eden:   (empty after collection)
S0:     A, C, D
S1:     (empty)
Old:    (empty)
```

---

### Step 3: More allocations

- Program creates new objects: `F, G`.
    
- They go into Eden.
    

```
Eden:   F, G
S0:     A, C, D
S1:     (empty)
Old:    (empty)
```

---

### Step 4: Next Minor GC

- Roots say: `A, D, F` are alive; `C` and `G` are garbage.
    
- GC marks reachable (`A, D, F`).
    
- Sweep removes `C, G`.
    

👉 Survivors are moved/copied into **other survivor space (S1)**.  
👉 **Roles of S0 and S1 swap each time** (only one is used at a time).

```
Eden:   (empty)
S0:     (empty, will be reused later)
S1:     A, D, F
Old:    (empty)
```

---

### Step 5: Object promotion to Old Gen

- Suppose after **few more minor GCs**, object `A` survives multiple times.
    
- JVM promotes `A` to **Old Gen**.
    

```
Eden:   H, I  (new objects created)
S0:     D, F
S1:     (empty)
Old:    A
```

---

### Step 6: Major GC (Old + Young)

- Sometimes a **Major GC** (or Full GC) runs → does Mark and Sweep on **Old Gen + Young Gen**.
    
- Old objects not referenced are freed.
    

If later `A` is no longer referenced → Major GC removes it from Old Gen.

---

## 🔹 Key Points from Dry Run

1. **Eden is the entry point** for all new objects.
    
2. **Minor GC**: Cleans only **Young Gen** (Eden + Survivor).
    
3. Objects that **survive multiple GCs → promoted to Old Gen**.
    
4. **Major GC**: Cleans both Young and Old Gen.
5. 
    
5. Mark phase = identify live objects; Sweep phase = free dead ones.
    

---

# Detailed Steps : 
## 🟢 Step 1: Program starts (new allocations)

Objects `A, B, C, D, E` are created.  
All new objects go into **Eden**.

```
[ Young Generation ]                 [ Old Generation ]
 Eden:  A  B  C  D  E                 Old: (empty)
 S0:    (empty)
 S1:    (empty)
```

---

## 🟢 Step 2: Minor GC #1 (Mark + Sweep on Young Gen)

- Suppose only `A, C, D` are still reachable.
    
- `B, E` are garbage → collected.
    
- Survivors (`A, C, D`) are copied to **S0**.
    
- Eden becomes empty.
    

```
[ Young Generation ]                 [ Old Generation ]
 Eden:  (empty)                      Old: (empty)
 S0:    A  C  D
 S1:    (empty)
```

---

## 🟢 Step 3: More allocations

Program creates new objects: `F, G`.  
They go to **Eden**.

```
[ Young Generation ]                 [ Old Generation ]
 Eden:  F  G                         Old: (empty)
 S0:    A  C  D
 S1:    (empty)
```

---

## 🟢 Step 4: Minor GC #2

- Roots say: `A, D, F` are alive.
    
- `C` and `G` are garbage.
    
- Survivors are copied into **S1** (roles of S0/S1 swap each time).
    

```
[ Young Generation ]                 [ Old Generation ]
 Eden:  (empty)                      Old: (empty)
 S0:    (empty)
 S1:    A  D  F
```

---

## 🟢 Step 5: New allocations

Objects `H, I` created in **Eden**.

```
[ Young Generation ]                 [ Old Generation ]
 Eden:  H  I                         Old: (empty)
 S0:    (empty)
 S1:    A  D  F
```

---

## 🟢 Step 6: Minor GC #3

- Suppose: `A, F, H` are alive; `D, I` are garbage.
    
- Survivors copied into **S0**.
    
- After surviving multiple cycles, `A` is **promoted to Old Gen**.
    

```
[ Young Generation ]                 [ Old Generation ]
 Eden:  (empty)                      Old: A
 S0:    F  H
 S1:    (empty)
```

---

## 🟢 Step 7: Major GC (Full GC)

- Runs less frequently, scans both Young + Old.
    
- If later `A` is no longer referenced → Major GC collects it too.
    

```
[ Young Generation ]                 [ Old Generation ]
 Eden:  (empty)                      Old: (empty)
 S0:    (empty)
 S1:    (empty)
```

---

✅ This is the **Mark & Sweep dry run in Generational Heap**:

- **Eden → Survivor spaces** during Minor GC
    
- **Promotion to Old Gen** after multiple survivals
    
- **Major GC** eventually clears Old Gen
    

---
