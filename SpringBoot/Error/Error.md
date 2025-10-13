
----

- Dropping old constraint(ENUM) and adding new constraint gives error if new constraint doesnt have values which are present in DB


> “Dropping a constraint removes the rule.  
> But when you add a new rule, PostgreSQL checks old data.  
> If even one old row breaks the rule — it fails.”