

# 1. Why CAP Theorem Exists

Modern applications are distributed.

Example:

* multiple servers
* multiple databases
* multiple cloud regions

Because:

* millions of users
* huge traffic
* need scalability
* need fault tolerance

So systems use distributed databases.

---

# 2. Our Architecture Example

We use:

```text id="ur0j1e"
                  Application
                 /         \
                /           \
      Primary Database    Replica Database
   (Writes + Important Reads)   (Normal Reads)
```

---

# 3. Role of Databases

## Primary DB

Responsible for:

* write operations
* critical reads

Examples:

* payment confirmation
* latest account balance
* inventory update

---

## Replica DB

Responsible for:

* scalable read operations

Examples:

* feed loading
* analytics
* comments
* product listing

Replica receives data from Primary using replication.

---

# 4. Why Replicas Exist

In real applications:

# Reads >> Writes

Example Instagram:

| Operation   | Traffic        |
| ----------- | -------------- |
| Upload post | Low            |
| View feed   | Extremely High |

If all reads go to primary:

* DB overload
* performance issues

So replicas handle reads.

---

# 5. Replication Lag

Replication is not always instant.

Example:

```text id="jlwmn1"
10:00:01 → Primary updated
10:00:03 → Replica updated
```

For 2 seconds:

* replica has old data

This is called:

# Replication Lag

---

# 6. What is Partition?

Suppose network fails:

```text id="jlwmn2"
Primary DB ❌ Replica DB
```

Now:

* replica cannot receive updates
* communication broken

This is called:

# Partition

Examples:

* network failure
* packet loss
* cloud outage
* cable cut

---

# 7. CAP Theorem

CAP theorem says:

# During network partition,

a distributed system can guarantee only ONE of:

* Consistency
* Availability

because Partition already exists.

So practical choices are:

| Choice |
| ------ |
| CP     |
| AP     |

---

# 8. Consistency (C)

Meaning:

# Every successful read gets latest correct data.

No stale data allowed.

---

## Example

Current balance:

```text id="jlwmn3"
1000
```

User withdraws:

```text id="jlwmn4"
1000 → 100
```

Primary updated:

```text id="jlwmn5"
Primary = 100
Replica = 1000
```

Replica still stale because partition happened.

---

# CP System Decision

Architect says:

```text id="jlwmn6"
"Never return stale data."
```

So:

* replica stops serving reads
* some users get 503 error

---

## Result

| Request           | Response |
| ----------------- | -------- |
| Read from Primary | 100      |
| Read from Replica | 503      |

---

# Why Consistent?

Because:

* nobody received wrong data
* every successful response had latest value

---

# Real Industry Examples of CP

| System               | Why CP                            |
| -------------------- | --------------------------------- |
| Banking              | wrong balance dangerous           |
| Payment Gateway      | transaction correctness important |
| Stock Trading        | stale stock price dangerous       |
| Inventory Management | overselling dangerous             |

---

# 9. Availability (A)

Meaning:

# Every request gets response.

Even if response may contain stale data.

---

# AP System Decision

Architect says:

```text id="jlwmn7"
"Always respond to users."
```

So replica continues serving reads.

---

## Result

| Request           | Response |
| ----------------- | -------- |
| Read from Primary | 100      |
| Read from Replica | 1000     |

---

# Why Available?

Because:

* every request received response
* no service interruption

---

# Why Not Consistent?

Because:

* different users saw different values
* stale data returned

---

# Real Industry Examples of AP

| System              | Why AP                       |
| ------------------- | ---------------------------- |
| Instagram Feed      | tiny stale data acceptable   |
| YouTube Views       | exact count not critical     |
| Facebook Likes      | eventual sync acceptable     |
| Analytics Dashboard | slightly old data acceptable |

---

# 10. Partition Tolerance (P)

Meaning:

# System continues operating despite communication failure between nodes.

Example:

```text id="jlwmn8"
Primary ❌ Replica
```

System still works partially.

This is partition tolerance.

---

# Important Understanding

Partition tolerance does NOT mean:

* every request succeeds
* every node responds

It only means:

* distributed system survives network split

---

# 11. Eventual Consistency

Most AP systems use:

# Eventual Consistency

Meaning:

Temporary inconsistency allowed.

After network recovery:

```text id="jlwmn9"
Replica → synchronized
```

Eventually all nodes become same.

---

# 12. Real Production Architecture

Large companies use:

```text id="jlwmna"
                Load Balancer
                      |
             ------------------
             |                |
          App 1            App 2
             |
      -----------------
      |               |
   Primary DB      Replica DBs
```

---

# 13. Real Industrial Thinking

Different modules choose different CAP behavior.

| Module        | Choice |
| ------------- | ------ |
| Payment       | CP     |
| Inventory     | CP     |
| User Feed     | AP     |
| Notifications | AP     |
| Analytics     | AP     |

---

# 14. Most Important Interview Point

CAP theorem matters:

# ONLY during partition.

If no partition exists:

* many systems can provide both
* consistency and availability together

The hard tradeoff starts when network failure happens.

---

# 15. Final Easy Memory Trick

## Consistency

```text id="jlwmnb"
"Correct data matters."
```

---

## Availability

```text id="jlwmnc"
"Response matters."
```

---

## Partition Tolerance

```text id="jlwmnd"
"Network failures are handled."
```

---
