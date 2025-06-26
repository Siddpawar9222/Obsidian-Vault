
---


```
// Generate intial script.sql file 
# outputChangeLogFile=src/main/resources/db/changelog/initial-schema.sql 
mvn liquibase:generateChangeLog

// Generate changeSet 
# changeLogFile=src/main/resources/db/changelog/db.changelog-master.xml
mvn liquibase:changelogSync


mvn liquibase:update

```