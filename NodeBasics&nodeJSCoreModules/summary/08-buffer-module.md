# Node.js Buffers

## 1. What is a Buffer?

A **Buffer** is used in Node.js to work with **raw binary data**.

### Binary data

Binary data means data stored as **bytes**.

For example:

```text
N → 4e
o → 6f
d → 64
e → 65
```

So the string:

```text
Node
```

can be represented as bytes:

```text
4e 6f 64 65
```

A Buffer is basically Node.js's way of working directly with these bytes.

---

# 2. String vs Buffer

### String

A string represents **human-readable text**:

```ts
const text = "Node";
```

### Buffer

A Buffer represents the **raw bytes**:

```ts
const buffer = Buffer.from("Node");
```

Think of it like:

```text
String
  ↓
"Node"

Buffer
  ↓
[4e 6f 64 65]
```

---

# 3. Where are Buffers useful?

Buffers are common when working with data that is not necessarily text.

Examples:

* Reading files
* Receiving HTTP request bodies
* Working with streams
* Images
* PDF files
* Videos
* Encryption
* Hashing
* Network data

For example, an image is not normally handled as:

```ts
"hello world"
```

It is handled as a sequence of bytes.

---

# 4. Creating a Buffer with `Buffer.from()`

```ts
const textBuffer = Buffer.from("Node");

console.log(textBuffer);
```

You may see something like:

```text
<Buffer 4e 6f 64 65>
```

Each value represents a byte.

```text
N → 4e
o → 6f
d → 64
e → 65
```

So:

```ts
Buffer.from("Node")
```

converts the string into its byte representation.

---

# 5. Converting Buffer back to String

Use:

```ts
buffer.toString("utf-8");
```

Example:

```ts
const textBuffer = Buffer.from("Node");

console.log(textBuffer.toString("utf-8"));
```

Output:

```text
Node
```

### Important

For `Buffer.toString()`:

```ts
textBuffer.toString()
```

uses UTF-8 by default.

So these are equivalent:

```ts
textBuffer.toString();
```

```ts
textBuffer.toString("utf-8");
```

---

# 6. Buffer length

```ts
const engBuffer = Buffer.from("Hello");

console.log(engBuffer.length);
```

Output:

```text
5
```

Why?

Because `"Hello"` contains 5 ASCII characters, and each one uses 1 byte in UTF-8.

```text
H → 1 byte
e → 1 byte
l → 1 byte
l → 1 byte
o → 1 byte

Total → 5 bytes
```

### Important

`Buffer.length` means:

> **number of bytes**

It does NOT always mean number of characters.

For example, some UTF-8 characters require multiple bytes.

---

# 7. `Buffer.alloc()`

You can create a Buffer with a fixed size:

```ts
const fixedBuffer = Buffer.alloc(5);

console.log(fixedBuffer);
```

Output:

```text
<Buffer 00 00 00 00 00>
```

You requested:

```text
5 bytes
```

So Node creates 5 bytes initialized to `00`.

---

# 8. Writing into a Buffer

You can write data into an existing Buffer:

```ts
const fixedBuffer = Buffer.alloc(5);

fixedBuffer.write("API");

console.log(fixedBuffer);
```

Conceptually:

```text
Before:

00 00 00 00 00


After "API":

41 50 49 00 00
```

Because:

```text
A → 41
P → 50
I → 49
```

There are still 2 unused bytes.

---

# 9. Reading the Buffer as text

```ts
console.log(fixedBuffer.toString("utf-8"));
```

Output:

```text
API
```

Even though the Buffer has 5 bytes:

```text
41 50 49 00 00
```

the written text is only:

```text
API
```

---

# 10. Buffer chunks

When working with **streams**, data may arrive in multiple pieces called **chunks**.

For example:

```ts
const chunks = [
  Buffer.from("Hello "),
  Buffer.from("Node "),
  Buffer.from("JS"),
];
```

Think of it as:

```text
Chunk 1 → "Hello "
Chunk 2 → "Node "
Chunk 3 → "JS"
```

Each chunk is a Buffer.

---

# 11. `Buffer.concat()`

You can combine multiple Buffers:

```ts
const combineBuffer = Buffer.concat(chunks);
```

Now the result contains:

```text
Hello Node JS
```

You can print it:

```ts
console.log(combineBuffer);
```

or convert it to text:

```ts
console.log(combineBuffer.toString());
```

Output:

```text
Hello Node JS
```

Remember:

```text
Buffer.concat()
      ↓
combines multiple Buffers
      ↓
one Buffer
```

---

# 12. Why do streams use chunks?

Large data doesn't always arrive all at once.

For example, imagine downloading a large video:

```text
Video
  ↓
Chunk 1
Chunk 2
Chunk 3
Chunk 4
...
```

Instead of loading the entire video into memory at once, Node can process it piece by piece.

Each piece can be a **Buffer**.

This is one of the most important reasons Buffers are common in Node.js.

---

# 13. Important Buffer APIs

### `Buffer.from()`

Create a Buffer from existing data:

```ts
Buffer.from("Node");
```

---

### `Buffer.alloc()`

Create a Buffer with a specific size:

```ts
Buffer.alloc(5);
```

---

### `.write()`

Write data into a Buffer:

```ts
buffer.write("API");
```

---

### `.toString()`

Convert Buffer bytes into a string:

```ts
buffer.toString("utf-8");
```

Default:

```ts
buffer.toString();
```

→ UTF-8

---

### `Buffer.concat()`

Combine multiple Buffers:

```ts
Buffer.concat([buffer1, buffer2]);
```

---

# 14. Important connection with `fs`

This is especially important when working with the File System.

```ts
fs.readFile("file.txt", (error, data) => {
  // data is a Buffer by default
});
```

Because no encoding was provided:

```text
fs.readFile()
      ↓
Buffer
```

If you provide UTF-8:

```ts
fs.readFile("file.txt", "utf-8", (error, data) => {
  // data is a string
});
```

Now:

```text
fs.readFile(..., "utf-8")
          ↓
        String
```

So remember:

```text
fs.readFile(path)
        ↓
      Buffer


fs.readFile(path, "utf-8")
        ↓
      String
```

---

# 15. Simple Mental Model

Think of a Buffer as a **box containing bytes**:

```text
Buffer
┌─────────────────────┐
│ 4e │ 6f │ 64 │ 65 │
└─────────────────────┘
        ↓
      Node
```

And:

```text
String
"Node"
```

is human-readable text.

So:

```text
String
  ↓ Buffer.from()
Buffer
  ↓ .toString()
String
```

---

# 16. Key Takeaways

* **Buffer = raw bytes**
* Binary data is represented as bytes.
* `Buffer.from()` creates a Buffer from data.
* `Buffer.alloc()` creates a fixed-size Buffer.
* `.write()` writes data into a Buffer.
* `.toString()` converts Buffer → String.
* `Buffer.toString()` uses UTF-8 by default.
* `.length` on a Buffer means **number of bytes**.
* `Buffer.concat()` combines multiple Buffers.
* Streams commonly process data as **chunks**, and those chunks are often Buffers.
* `fs.readFile()` returns a Buffer by default.
* `fs.readFile(..., "utf-8")` returns a String.

## The core idea

```text
Human-readable text
       ↕
     Buffer
       ↕
    Raw bytes
```

When working with files, streams, network data, images, PDFs, etc., you'll often see **Buffers** because Node.js is dealing with the actual bytes of the data.
