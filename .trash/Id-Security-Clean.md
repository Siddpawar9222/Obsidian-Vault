---
# Securing Database IDs in Spring Boot

## The Core Problem

Exposing your database's auto-incremented primary key (e.g., `/users/1`, `/users/2`) in public APIs is a security risk. It allows attackers to easily enumerate resources and predict other valid IDs (called **IDOR — Insecure Direct Object Reference**).

The best solution is to **keep the internal `Long` ID hidden** and expose only a **UUID as a public identifier**.

---

## Primary Key Options at a Glance

| Strategy | Size | Performance | Security | Best For |
|---|---|---|---|---|
| `BIGINT` (Auto-increment) | 8 bytes | Fastest | Low (guessable) | Internal/enterprise apps |
| `UUID` as primary key | 16 bytes | Slower (v4) / Fast (v7) | High | Distributed systems |
| `BIGINT` + public `UUID` ✅ | Both | Fast internally | High externally | Public APIs, LMS, SaaS |

> **Recommended Pattern:** Use `Long` as the internal primary key for fast joins and indexing, and a separate `UUID` field exposed only via APIs and DTOs.

---

## Why Not Use UUID as the Primary Key?

Classic random `UUID.randomUUID()` (UUIDv4) generates completely random values. When used as a database index, this causes three serious performance issues:

- **B-Tree Page Splits:** Databases use B-Tree indexes that love sequential data (like `1, 2, 3`). Random UUIDs force inserts into the middle of full index pages, triggering expensive "page splits."
- **Index Fragmentation & Bloat:** Constant page splitting leaves index pages partially empty and fragmented. A UUIDv4 index can take over twice the storage of a sequential index on the same dataset.
- **Cache Misses:** Sequential inserts keep hot data in RAM. Random UUIDs scatter data across disk, causing frequent and costly cache misses.

---

## The Modern Fix: UUIDv7 (Time-Ordered)

**UUIDv7** solves the performance problem while keeping security. It embeds a Unix timestamp in the first 48 bits, followed by random bits:

```
[ 48-bit Timestamp ] - [ 12-bit Version/Variant ] - [ 68-bit Randomness ]
  (Ensures Sorting)                                   (Ensures Uniqueness)
```

Because the leading bits are a timestamp, UUIDv7 values are **chronologically ordered**. They behave like an auto-incrementing key at the index level — no page splits, minimal bloat, full cache efficiency — while remaining unguessable to the outside world.

---

## Full Implementation: `Long` PK + Public UUIDv7

### Step 1 — Add the UUIDv7 Dependency

The standard JDK does not yet have a native `UUIDv7` generator. Add this lightweight library to `pom.xml`:

```xml
<dependency>
    <groupId>com.fasterxml.uuid</groupId>
    <artifactId>java-uuid-generator</artifactId>
    <version>5.1.0</version>
</dependency>
```

### Step 2 — Define the Entity

Both fields live on the same entity. The `id` is never exposed outside the JPA layer.

```java
import com.fasterxml.uuid.Generators;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Hidden — used internally for fast joins/foreign keys

    @Column(nullable = false, unique = true, updatable = false)
    private UUID publicId = Generators.timeBasedEpochGenerator().generate();  // UUIDv7 — exposed publicly

    private String name;
    private String email;

    // Getters and Setters
}
```

> **Note:** If you are not on Java 21+ / Spring Boot 3.3+, `UUID.randomUUID()` (UUIDv4) also works here for security — you only lose the indexing performance benefit of v7.

### Step 3 — Create the DTO

The DTO is the contract with the outside world. It must **never include the internal `id`**.

```java
import java.util.UUID;

public class UserDTO {
    private UUID publicId;
    private String name;
    private String email;

    // Getters and Setters
}
```

### Step 4 — Configure the Repository

Add query methods that look up entities by `publicId` instead of the primary key.

```java
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByPublicId(UUID publicId);
    void deleteByPublicId(UUID publicId);
}
```

### Step 5 — Implement the Service Layer

The service maps between the Entity and the DTO, and uses `publicId` for all read/update/delete operations.

```java
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // CREATE
    public UserDTO createUser(UserDTO dto) {
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        return convertToDTO(userRepository.save(user));
    }

    // READ
    public UserDTO getUserByPublicId(UUID publicId) {
        User user = userRepository.findByPublicId(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return convertToDTO(user);
    }

    // UPDATE
    public UserDTO updateUser(UUID publicId, UserDTO dto) {
        User user = userRepository.findByPublicId(publicId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        return convertToDTO(userRepository.save(user));
    }

    // DELETE
    public void deleteUser(UUID publicId) {
        userRepository.deleteByPublicId(publicId);
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setPublicId(user.getPublicId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        return dto;
    }
}
```

### Step 6 — Expose via the Controller

All endpoints use `publicId` as the path variable. The internal `Long` id is never mentioned.

```java
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserDTO> create(@RequestBody UserDTO dto) {
        return ResponseEntity.ok(userService.createUser(dto));
    }

    @GetMapping("/{publicId}")
    public ResponseEntity<UserDTO> getOne(@PathVariable UUID publicId) {
        return ResponseEntity.ok(userService.getUserByPublicId(publicId));
    }

    @PutMapping("/{publicId}")
    public ResponseEntity<UserDTO> update(@PathVariable UUID publicId, @RequestBody UserDTO dto) {
        return ResponseEntity.ok(userService.updateUser(publicId, dto));
    }

    @DeleteMapping("/{publicId}")
    public ResponseEntity<Void> delete(@PathVariable UUID publicId) {
        userService.deleteUser(publicId);
        return ResponseEntity.noContent().build();
    }
}
```

---

## Alternative: ID Obfuscation with Hashids

If you don't want to store a second UUID column, you can **encode your existing `Long` ID** into a short, reversible string using a library like Hashids (e.g., `12345` → `NkK9`).

| | Hashids | UUIDv7 (Recommended) |
|---|---|---|
| DB schema change | ❌ None needed | ✅ One extra column |
| URL size | ✅ Compact | ❌ Longer (36 chars) |
| CPU overhead | ❌ Encode/decode on every request | ✅ Generated once on insert |
| Security | ⚠️ Reversible if salt leaks | ✅ Cryptographically random suffix |

> **Recommendation:** Prefer the UUIDv7 approach. Hashids are a convenience, not true security — if your salt is leaked, all IDs can be decoded.

---

## What the Database Looks Like

Internally, both columns coexist:

| id | public_id |
|---|---|
| 1 | `a1b2c3d4-...` |
| 2 | `e5f6g7h8-...` |

Internal query (never exposed):
```sql
SELECT * FROM users WHERE id = 1;
```

API response (what the client sees):
```json
{
  "publicId": "a1b2c3d4-..."
}
```

---

## When Is UUID as Primary Key Appropriate?

Use UUID directly as the primary key (not just a secondary field) only when:

- **Microservices / distributed systems:** Multiple services need to generate IDs independently without coordinating with a central database.
- **Data merging / multi-tenant:** Records from different databases are merged and integer IDs would collide.

For most applications — including a typical Spring Boot + PostgreSQL LMS — `BIGINT/BIGSERIAL` as the primary key with a secondary `publicId` UUID is the simpler and more performant choice.

---

## Automation Tip: MapStruct

Manually writing `convertToDTO()` methods in every service becomes tedious. **MapStruct** can generate these mappings at compile time. Consider adopting it as your project scales.
