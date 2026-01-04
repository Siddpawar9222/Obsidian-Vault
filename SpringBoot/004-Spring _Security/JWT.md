
---

![[JWTStructure.png]]



A user edits the payload of their JWT , changes his role to Admin and sends it to access a protected API. How does your system detect the tampering, which JWT part is responsible, and what happens during authentication and authorization when the token is invalid? 

A jwt token has 3 parts: header, payload, and signature. The user can edit the payload (e.g., change role to Admin), but they cant recreate the signature because they don't have the server's secret key. When the API receives the token, it recalculates the signature from the header + payload and compares it to the token's signature. Since the payload was tampered with, the signatures don't match, so the token is rejected during authentication (401 Unauthorized). Because authentication fails, authorization never runs. The signature is what detects tampering.