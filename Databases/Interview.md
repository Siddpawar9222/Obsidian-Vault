
---

# = vs NULL 

--- 


###  1. Correct way to check NULL

```sql
SELECT * FROM dms_express_interest WHERE campaign_name IS NULL;
```

This will **correctly return all rows where `campaign_name` is NULL**.

---

###  2. Wrong / ineffective way

```sql
SELECT * FROM dms_express_interest WHERE campaign_name = NULL;
```

This will **not work**.  
It will **always return 0 rows**, even if NULL values exist.

---

### Why?

In SQL, `NULL` means **unknown value**.  
You cannot compare unknown values using `=`.

- `column = NULL` → **always false**
    
- `column IS NULL` → **correct way to check**
    


---

# Example to make it super clear

Imagine you have two empty boxes.

You ask:

> Are both boxes having the same item?

I will say:

> I don’t know.  
> Both are empty, so I cannot compare their items.

This is exactly how SQL treats NULL.


---


