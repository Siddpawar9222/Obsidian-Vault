
---

### 🔐 **Encryption**

**Purpose**: To **secure data** so that only authorized people can read it.

- **It is reversible** — you can **decrypt** it back to original form using a **key**.
    
- Used to **protect data** in storage or transmission (like messages, passwords, files).
    

**Real-world Example**:  
Think of writing a secret letter to a friend using a secret code. Only your friend knows how to **decode** it using a **key**.

```java
// Simple example using Java AES encryption
// Just for understanding (not production code)

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class EncryptionExample {
    public static void main(String[] args) throws Exception {
        String secretKey = "1234567812345678"; // 16 chars for AES
        String original = "HelloWorld";

        SecretKeySpec key = new SecretKeySpec(secretKey.getBytes(), "AES");
        Cipher cipher = Cipher.getInstance("AES");

        cipher.init(Cipher.ENCRYPT_MODE, key);
        byte[] encrypted = cipher.doFinal(original.getBytes());
        String encryptedText = Base64.getEncoder().encodeToString(encrypted);

        cipher.init(Cipher.DECRYPT_MODE, key);
        byte[] decrypted = cipher.doFinal(Base64.getDecoder().decode(encryptedText));

        System.out.println("Encrypted: " + encryptedText);
        System.out.println("Decrypted: " + new String(decrypted));
    }
}
```

---

### 🧂 **Hashing**

**Purpose**: To create a **unique fixed-size fingerprint** of data.

- **It is NOT reversible** — you **cannot get original data back** from a hash.
    
- Used to **store passwords**, verify file integrity, etc.
    

**Real-world Example**:  
Imagine making a **thumbprint** of a document. You can use the thumbprint to check if it has changed — but you **can’t recreate** the document from the thumbprint.

```java
// Simple hashing using Java SHA-256

import java.security.MessageDigest;

public class HashingExample {
    public static void main(String[] args) throws Exception {
        String password = "mySecret123";
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] hash = md.digest(password.getBytes());

        // Convert to hex string
        StringBuilder hex = new StringBuilder();
        for (byte b : hash) {
            hex.append(String.format("%02x", b));
        }

        System.out.println("Hashed password: " + hex.toString());
    }
}
```

---

### 🔑 Summary Table

|Feature|Encryption|Hashing|
|---|---|---|
|Reversible|✅ Yes (with key)|❌ No|
|Use-case|Protect data (e.g., messages)|Verify data (e.g., passwords)|
|Key needed?|✅ Yes|❌ No|
|Output length|Varies or fixed|Always fixed|

---