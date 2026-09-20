# Node.js Streams

## 1. What is a Stream?

A **Stream** allows us to handle data **piece by piece (chunks)** instead of loading the entire data into memory at once.

### Without Streams

```text
500 MB file
     ↓
Load the entire file into RAM
     ↓
Process it
```

This can consume a lot of memory.

### With Streams

```text
500 MB file
     ↓
Chunk 1 → process
Chunk 2 → process
Chunk 3 → process
Chunk 4 → process
...
```

### Common use cases

* Reading large files
* Uploading files
* Downloading files
* Video/audio processing
* Compression
* Processing large amounts of data

### Mental Model

Think of a stream like a **water pipe**:

```text
Source
  ↓
chunk
  ↓
chunk
  ↓
chunk
  ↓
Destination
```

---

# 2. Types of Streams

Node.js mainly has three important stream types:

### Readable

**Produces / reads data.**

```text
Source → Readable
```

Example:

```text
File → Readable Stream
```

---

### Writable

**Receives / writes data.**

```text
Writable → Destination
```

Example:

```text
Writable Stream → File
```

---

### Transform

**Receives data, transforms it, then produces the transformed data.**

```text
Readable → Transform → Writable
```

Example:

```text
"hello"
   ↓
uppercase transform
   ↓
"HELLO"
```

A Transform stream can be thought of as:

```text
Readable + Writable
```

---

# 3. `Readable.from()`

Node provides convenient ways to create streams.

```ts
import { Readable } from "node:stream";

const readableStream = Readable.from([
  "hello",
  "from",
  "node.js",
  "streams",
]);
```

`Readable.from()` takes an **iterable** such as an array and creates a Readable Stream from it.

You don't need to manually define a `read()` function.

Node handles the internal reading logic for you.

Conceptually:

```text
["hello", "from", "node.js", "streams"]
                ↓
        Readable Stream
                ↓
      hello → from → node.js → streams
```

---

# 4. `new` + `{}` when creating a Stream

You will often see:

```ts
new Writable({
  // options
});
```

### `new`

`Writable` is a class, so:

```ts
new Writable(...)
```

means:

> Create a new Writable instance.

### `{}`

The object is an **options/configuration object**.

```ts
new Writable({
  write(...) {
    // instructions
  }
});
```

You're basically telling Node:

> "Create this Writable Stream, and here's how I want it to behave."

---

# 5. Custom Writable Stream

```ts
const writableStream = new Writable({
  write(chunk, encoding, callback) {
    console.log("received chunk", chunk.toString());

    callback();
  },
});
```

The `write()` function is called when the Writable receives a chunk.

### Important parameters

```ts
write(chunk, encoding, callback)
```

### `chunk`

The actual piece of data received.

```ts
chunk.toString()
```

converts it to text for our example.

### `encoding`

Information about the encoding.

Usually you won't need it when working with Buffers.

### `callback`

Tells Node:

> "I'm done processing this chunk."

```ts
callback();
```

If something goes wrong:

```ts
callback(error);
```

---

# 6. Custom Transform Stream

```ts
const uppercaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    const text = chunk.toString();

    callback(null, text.toUpperCase());
  },
});
```

The `transform()` function receives each chunk.

```text
chunk
  ↓
transform()
  ↓
modified chunk
```

### `callback(null, result)`

```ts
callback(null, text.toUpperCase());
```

Means:

```text
null
 ↓
No error

text.toUpperCase()
 ↓
Send this result to the next stream
```

For example:

```text
hello
  ↓
HELLO
```

If there is an error:

```ts
callback(error);
```

---

# 7. `pipeline()`

We can connect our streams using:

```ts
import { pipeline } from "node:stream/promises";
```

Then:

```ts
await pipeline(
  readableStream,
  uppercaseTransform,
  writableStream
);
```

This creates:

```text
Readable
   ↓
Transform
   ↓
Writable
```

In our example:

```text
"hello"
   ↓
uppercaseTransform
   ↓
"HELLO"
   ↓
writableStream
   ↓
console.log()
```

`pipeline()` is useful because it handles the stream connection and lifecycle/error handling for us.

---

# 8. Why `pipeline()` with `await`?

Because the pipeline is asynchronous.

```ts
await pipeline(
  readableStream,
  uppercaseTransform,
  writableStream
);

console.log("stream completed");
```

The `console.log()` runs after the pipeline finishes.

If something fails:

```ts
try {
  await pipeline(...);

  console.log("stream completed");
} catch (error) {
  console.error("Stream failed");
}
```

The error can be handled with `try/catch`.

---

# 9. Complete Example

```ts
import { Readable, Transform, Writable } from "node:stream";
import { pipeline } from "node:stream/promises";

const readableStream = Readable.from([
  "hello",
  "from",
  "node.js",
  "streams",
]);

const uppercaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    const text = chunk.toString();

    callback(null, text.toUpperCase());
  },
});

const writableStream = new Writable({
  write(chunk, encoding, callback) {
    console.log("received chunk", chunk.toString());

    callback();
  },
});

async function main(): Promise<void> {
  try {
    await pipeline(
      readableStream,
      uppercaseTransform,
      writableStream
    );

    console.log("stream completed");
  } catch (error) {
    const msg =
      error instanceof Error
        ? error.message
        : "unknown error";

    console.error("Stream failed", msg);
  }
}

main();
```

Output:

```text
received chunk HELLO
received chunk FROM
received chunk NODE.JS
received chunk STREAMS
stream completed
```

---

# 10. The Most Important Mental Model

Remember this:

```text
              STREAM PIPELINE

Readable
   │
   │ chunks
   ▼
Transform
   │
   │ transformed chunks
   ▼
Writable
```

For our example:

```text
["hello", "from", "node.js", "streams"]
                    ↓
               Readable
                    ↓
             "hello" chunk
                    ↓
               Transform
                    ↓
              "HELLO" chunk
                    ↓
               Writable
                    ↓
              console.log()
```

---

# 11. `Readable.from()` vs `new Writable()`

This difference is important.

### Readable

```ts
Readable.from(["hello", "world"]);
```

Node already knows how to turn the array into a stream.

So you don't need to implement the reading logic.

### Writable

```ts
new Writable({
  write(chunk, encoding, callback) {
    // What should happen with the chunk?
  }
});
```

Node doesn't know **what you want to do with the incoming data**.

So you provide the `write()` behavior.

---

# 12. `pipe()` vs `pipeline()`

You may also see:

```ts
readable.pipe(transform).pipe(writable);
```

This connects streams too.

But for most application code, prefer:

```ts
pipeline(readable, transform, writable);
```

because `pipeline()` provides better handling for errors and stream cleanup.

---

# Key Takeaways

* **Stream = process data chunk by chunk.**
* `Readable` → produces data.
* `Writable` → receives/writes data.
* `Transform` → receives data and transforms it.
* `Readable.from()` → convenient way to create a Readable from an iterable.
* `new Writable({...})` → creates a custom Writable with configuration.
* `write()` → handles incoming chunks.
* `transform()` → transforms incoming chunks.
* `callback()` → tells Node the current operation is finished.
* `callback(null, data)` → successfully produce transformed data.
* `pipeline()` → connects streams and handles errors/lifecycle.
* Main pattern:

```text
Readable → Transform → Writable
```

### Interview Question

**Why are Streams useful in Node.js?**

Because they allow us to process data **incrementally in chunks**, which is more memory-efficient than loading the entire data source into memory at once.
