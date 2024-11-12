
-----
Default Spring Behavior : 
  https://satyacodes.medium.com/a-complete-guide-to-spring-security-with-springboot-329a959a7c64



**Spring Security Notes by eazy bytes:**

![[SpringSecurity.pdf]]


**Flow chart For DaoAuthentcationProvider:**

![[DaoAPFlow.jpg]]


### YouTube videos to watch : 
 https://youtu.be/Kzx8MKA7Q0Y?si=p2bF1AZIA46q1MGJ

Spring Security : 

_ROLE prefix is used by spring security, to identify that it is as a role. A role has a set of privileges a.k.a Authorities, these authorities define varies permissions for a role. ex:- EDIT_PROFILE, DELETE_PROFILE

You can define both the roles and authorities, if you are defining a role then it must be prefixed with "ROLE_"

In your case you are looking for a role, so by default spring security looks for a string that is prefixed with "ROLE_". 

hasAuthority : we need to use without role 
hasRole :   we need to use with role 


In Spring Security, **roles** and **authorities** define what a user can or cannot do in an application, but they serve slightly different purposes:

1. **Roles**:
   - A role represents a user’s overall level or type of access. It’s like a job title in a company.
   - For example, roles could be **ADMIN**, **USER**, or **MODERATOR**. Each role groups related permissions (called "authorities") that a user with that role is allowed to perform.

2. **Authorities (or Permissions)**:
   - Authorities are specific actions that a user is allowed to perform. Think of them as permissions tied to a role.
   - For instance, **EDIT_PROFILE** and **DELETE_PROFILE** could be authorities. An **ADMIN** role might have both `EDIT_PROFILE` and `DELETE_PROFILE` permissions, while a **USER** role might only have `EDIT_PROFILE`.

### Real-World Example

Imagine a **Company Management System**:
   - **Roles**: There are two main roles: **Manager** and **Employee**.
   - **Authorities**:
     - The **Manager** role has the following authorities: `VIEW_REPORTS`, `APPROVE_TIME_OFF`, `MANAGE_TEAM`.
     - The **Employee** role has these authorities: `VIEW_SALARY`, `REQUEST_TIME_OFF`.

In Spring Security:
   - Roles are often defined with the `ROLE_` prefix to help Spring identify them as roles. For instance, you might have `ROLE_MANAGER` and `ROLE_EMPLOYEE`.
   - Spring Security will automatically look for `ROLE_` when checking a user's role, so a check for "Manager" will need the `ROLE_MANAGER` prefix in code. This tells Spring, “check if the user is in the **Manager** role,” and if so, it allows them to perform actions assigned to **Manager** authorities. 

To sum up, **roles** organize users by type, while **authorities** specify exactly what each role is allowed to do in the application.