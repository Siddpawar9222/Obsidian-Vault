
---

## What happens when Spring Boot starts

When your Spring Boot application starts, this happens automatically:

  -  Spring Boot loads Liquibase
  -  Liquibase reads your changelog file
  -  It checks the DATABASECHANGELOG table
   - It finds new changesets
   - It executes them