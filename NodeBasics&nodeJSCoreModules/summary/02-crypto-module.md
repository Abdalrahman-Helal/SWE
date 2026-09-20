# Node.js `crypto` Module — Cheat Sheet

## 1. What is `crypto`?

`crypto` is a **built-in Node.js module** used for security-related tasks.

```ts
import crypto from "node:crypto";
```

Common uses:

* Generate unique IDs
* Generate secure random tokens
* Hash data
* Verify data integrity
* Create HMAC signatures
* Encrypt / decrypt data

---

# 2. `crypto.randomUUID()`

Used to generate a **unique UUID**.

```ts
const requestId = crypto.randomUUID();

console.log(requestId);
```

Example:

```text
21648ce4-d31d-44e5-82d8-0f5f6e3a8dbc
```

Common uses:

* User IDs
* Order IDs
* Request IDs
* Session IDs

### Remember

```text
randomUUID()
     ↓
unique-looking UUID
```

---

# 3. `crypto.randomBytes()`

Generates **cryptographically secure random bytes**.

```ts
const resetToken = crypto.randomBytes(16).toString("hex");
```

### Important: `16` means 16 BYTES

It does **NOT** mean 16 characters.

```text
16 bytes
× 8
= 128 bits
```

When converted to hex:

```text
1 byte → 2 hex characters

16 bytes
× 2
= 32 hex characters
```

Example:

```text
d554a6a64286fa73ead2c0a9e7a7b0ec
```

This is **32 characters**, representing **16 random bytes**.

### Common uses

* Password reset tokens
* Email verification tokens
* Session secrets
* API keys / random secrets

### Remember

```text
randomBytes(16)
      ↓
16 random bytes
      ↓
toString("hex")
      ↓
32 hex characters
```

---

# 4. `toString("hex")`

`randomBytes()` returns a **Buffer**.

```ts
const bytes = crypto.randomBytes(16);
```

`toString("hex")` converts the Buffer into a readable hexadecimal string:

```ts
bytes.toString("hex");
```

### Hex

Hexadecimal uses:

```text
0 1 2 3 4 5 6 7 8 9 a b c d e f
```

Each byte is represented by **2 hex characters**.

---

# 5. Hashing

Hashing converts data into a fixed-size hash.

```text
data
 ↓
hash
```

Example:

```ts
const hash = crypto
  .createHash("sha256")
  .update(text)
  .digest("hex");
```

### Important property

Hashing is designed to be **one-way**.

```text
"hello node"
      ↓
   SHA-256
      ↓
    HASH

HASH
  ↓
❌ cannot simply recover "hello node"
```

### Same input → same hash

```ts
const text = "hello node";
const text2 = "hello node";
```

```ts
hash(text) === hash(text2)
```

Result:

```text
true
```

Because the inputs are identical.

### Important

If you write:

```ts
.update("text")
```

you are hashing the literal string:

```text
"text"
```

If you write:

```ts
.update(text)
```

you are hashing the **value stored inside `text`**.

---

# 6. `createHash()`

```ts
crypto.createHash("sha256")
```

Creates a hash object using the SHA-256 algorithm.

Think:

```text
createHash("sha256")
        ↓
Create SHA-256 hash machine
```

---

# 7. `.update()`

`.update()` **feeds data into the hash/HMAC object**.

```ts
.update("hello")
```

Means:

> Add `"hello"` as the data that will be processed.

You can call it multiple times:

```ts
hash
  .update("hello")
  .update(" ")
  .update("node");
```

This is equivalent in terms of the input data to:

```ts
hash.update("hello node");
```

### Remember

```text
update()
   ↓
input data
```

---

# 8. `.digest()`

`.digest()` **finishes the operation and returns the final result**.

```ts
.digest("hex")
```

`"hex"` specifies the output encoding.

So:

```ts
crypto
  .createHash("sha256")
  .update("hello")
  .digest("hex");
```

means:

```text
createHash()
    ↓
choose SHA-256

update()
    ↓
give it the data

digest()
    ↓
get the final hash
```

### The pattern

```text
createHash()
     ↓
  update(data)
     ↓
  digest("hex")
     ↓
    hash
```

---

# 9. HMAC

HMAC = **Hash-based Message Authentication Code**

Think of it as:

```text
HMAC = data + secret + hash algorithm
```

Normal hash:

```text
data
 ↓
hash
```

HMAC:

```text
data + secret
      ↓
     HMAC
      ↓
  signature
```

---

# 10. `createHmac()`

```ts
crypto.createHmac("sha256", secret)
```

Arguments:

```ts
createHmac(algorithm, secret)
```

Example:

```ts
const secret = "my-super-secret-key";

const signature = crypto
  .createHmac("sha256", secret)
  .update(message)
  .digest("hex");
```

Here:

```text
Algorithm → SHA-256
Secret    → my-super-secret-key
Data      → message
```

---

# 11. Why HMAC?

HMAC is commonly used to verify that:

1. The sender knows the shared secret.
2. The message was not modified.

Example:

```text
message = "user_id=1"
secret  = "my-super-secret-key"

message + secret
       ↓
   HMAC-SHA256
       ↓
   signature
```

The sender sends:

```text
message
signature
```

The receiver has the same secret and calculates the signature again.

```text
received message + secret
          ↓
       HMAC-SHA256
          ↓
   calculated signature
```

Then compare:

```ts
calculatedSignature === receivedSignature
```

If they match:

```text
✅ Signature matches
```

If they don't:

```text
❌ Signature doesn't match
```

---

# 12. HMAC Example

```ts
const secret = "my-super-secret-key";
const message = "user_id=1";

const signature = crypto
  .createHmac("sha256", secret)
  .update(message)
  .digest("hex");

const signatureVerify = crypto
  .createHmac("sha256", secret)
  .update(message)
  .digest("hex");

console.log(signature === signatureVerify);
```

Output:

```text
true
```

Why?

Because both calculations use:

```text
same algorithm
+
same secret
+
same message
```

---

# 13. Webhooks + HMAC

A **webhook** is when another service sends an HTTP request to your server automatically when an event happens.

Example:

```text
Payment completed
       ↓
Payment Service
       ↓
POST /webhook
       ↓
Your Server
```

The service can send:

```text
message
signature
```

Your server uses the shared secret to calculate the HMAC again.

```text
message + secret
       ↓
     HMAC
       ↓
calculated signature
```

Then:

```text
calculated signature
        ==
received signature
```

If they match → accept the webhook.

---

# 14. Hash vs HMAC

### Hash

```text
data
 ↓
SHA-256
 ↓
hash
```

Used when you need a **one-way fingerprint** of data.

### HMAC

```text
data + secret
      ↓
    SHA-256
      ↓
  signature
```

Used when you need to verify **authentication + integrity** using a shared secret.

---

# 15. Important Mental Model

Remember these four functions:

```text
randomUUID()
    ↓
Generate UUID
```

```text
randomBytes(n)
    ↓
Generate n secure random bytes
```

```text
createHash()
    ↓
Create a normal hash
```

```text
createHmac()
    ↓
Create a hash-based signature using a secret
```

And the common chain:

```text
createHash / createHmac
          ↓
       update(data)
          ↓
       digest("hex")
          ↓
        result
```

## Quick Interview Revision

**Q: What does `randomBytes(16)` mean?**

A: Generate **16 cryptographically secure random bytes**, equal to **128 bits**. With hex encoding, that's **32 characters**.

**Q: What does `.update()` do?**

A: Feeds/adds the data that will be processed by the hash or HMAC.

**Q: What does `.digest("hex")` do?**

A: Finalizes the operation and returns the result as a hexadecimal string.

**Q: Is hashing reversible?**

A: No. Hashing is designed to be **one-way**.

**Q: What is the difference between Hash and HMAC?**

A:

```text
Hash  → data + algorithm
HMAC  → data + secret + algorithm
```

**Q: Why use HMAC?**

A: To verify **message integrity and authenticity** when both sides share a secret.
