# Node.js Streams and HTTP Responses

## Overview

This example demonstrates three ways to send a file to a client using Node.js HTTP:

1. `fs.readFile()` — reads the entire file before sending it.
2. Streams with events — sends the file in chunks manually.
3. `pipe()` — connects a readable stream directly to the HTTP response.

---

## Complete Code

```js
const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  // Solution 1: Read the entire file
  // fs.readFile('test-file.txt', (err, data) => {
  //   if (err) {
  //     console.log(err);
  //     res.statusCode = 500;
  //     return res.end('File not found!');
  //   }
  //
  //   res.end(data);
  // });

  // Solution 2: Streams (manual handling)
  // const readable = fs.createReadStream('test-file.txt');
  //
  // readable.on('data', (chunk) => {
  //   res.write(chunk);
  // });
  //
  // readable.on('end', () => {
  //   res.end();
  // });
  //
  // readable.on('error', (err) => {
  //   console.log(err);
  //   res.statusCode = 500;
  //   res.end('File not found!');
  // });

  // Solution 3: Using pipe()
  const readable = fs.createReadStream("test-file.txt");
  readable.pipe(res);

  // General pattern:
  // readableSource.pipe(writableDestination);
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening...");
});
```

---

## Solution 1: `fs.readFile()`

```js
fs.readFile("test-file.txt", (err, data) => {
  if (err) {
    console.log(err);
    res.statusCode = 500;
    return res.end("File not found!");
  }

  res.end(data);
});
```

### How it works

1. Node.js reads the entire file into memory.
2. When reading finishes, the callback executes.
3. `res.end(data)` sends the file contents and ends the HTTP response.

**Advantages:**

- Simple and easy to understand.
- Suitable for small files.

**Disadvantages:**

- The entire file must be loaded into memory before it can be sent.
- Can consume significant memory when handling large files or many concurrent requests.

---

## Solution 2: Streams (Manual Handling)

```js
const readable = fs.createReadStream("test-file.txt");

readable.on("data", (chunk) => {
  res.write(chunk);
});

readable.on("end", () => {
  res.end();
});

readable.on("error", (err) => {
  console.log(err);
  res.statusCode = 500;
  res.end("File not found!");
});
```

### How it works

1. `fs.createReadStream()` creates a readable stream for the file.
2. The `data` event fires as chunks become available.
3. `res.write(chunk)` sends each chunk to the client.
4. The `end` event fires when the file has been read completely.
5. `res.end()` finishes the HTTP response.
6. The `error` event lets us handle errors such as a missing file.

**Advantages:**

- Sends data progressively instead of loading the whole file into memory.
- Gives you control over how each chunk is processed.

**Disadvantages:**

- Requires more code.
- You must handle stream events and errors correctly.

---

## Solution 3: Using `pipe()`

```js
const readable = fs.createReadStream("test-file.txt");

readable.pipe(res);
```

### How it works

`pipe()` connects a readable stream to a writable stream.

In this example:

- `readable` is the source that reads the file.
- `res` is the destination that sends data through the HTTP response.
- `pipe()` transfers the chunks automatically and manages backpressure.
- By default, it ends the destination when the readable stream finishes.

Instead of manually handling `data`, `end`, and `res.write()`, you can use one line:

```js
readable.pipe(res);
```

### What does this mean?

```js
readableSource.pipe(writableDestination);
```

This is a generic pattern, not code that must be copied exactly.

For example:

```js
const readableSource = fs.createReadStream("test-file.txt");

const writableDestination = fs.createWriteStream("copy.txt");

readableSource.pipe(writableDestination);
```

Here, Node.js reads from `test-file.txt` and writes the chunks into `copy.txt`.

The source and destination can change depending on your task.

**Important:** `pipe()` does not automatically handle every stream error. For more robust error handling and cleanup, consider using `pipeline()` from `node:stream/promises`.

---

## Comparison

| Feature               | `fs.readFile()`                | Manual Streams          | `pipe()`                         |
| --------------------- | ------------------------------ | ----------------------- | -------------------------------- |
| Reads progressively   | No                             | Yes                     | Yes                              |
| Sends chunks manually | No                             | Yes                     | No                               |
| Handles backpressure  | Not applicable to this pattern | Requires care           | Yes                              |
| Code complexity       | Low                            | Higher                  | Low                              |
| Best use              | Small files                    | Custom chunk processing | Direct stream-to-stream transfer |

## Key Takeaways

- `fs.readFile()` loads the complete file before invoking its callback.
- `fs.createReadStream()` reads data in chunks.
- `data` fires when a chunk is available.
- `end` indicates that reading has completed.
- `res.write(chunk)` sends a chunk; `res.end()` finishes the response.
- `readable.pipe(res)` connects the file stream directly to the HTTP response.
- `pipe()` is not deprecated; it remains a valid Node.js API.
- `pipeline()` is useful when you need stronger error propagation and stream cleanup.

### Mental Model

**File → Readable Stream → `pipe()` → HTTP Response → Browser**

Remember: learn the manual stream approach first to understand how chunks move, then use `pipe()` for simpler transfers.
