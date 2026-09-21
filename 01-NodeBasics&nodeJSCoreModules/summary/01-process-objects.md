````md
# Node.js Process Object — Quick Cheat Sheet

## What is `process`?

`process` is a built-in Node.js object that provides information about
and control over the currently running Node.js process.

---

## 1. `process.env`

Used to access **Environment Variables**.

```ts
const nodeEnv = process.env.NODE_ENV ?? "development";
const port = Number(process.env.PORT ?? 3000);
````

* `process.env.NODE_ENV` → reads an environment variable.
* Environment variables are usually strings.
* `??` → uses the right value if the left side is `null` or `undefined`.

---

## 2. `process.argv`

An Array containing **command-line arguments**.

```powershell
node app.js hello 123
```

```text
process.argv[0] → Node executable
process.argv[1] → Script path
process.argv[2] → "hello"
process.argv[3] → "123"
```

Example:

```ts
const command = process.argv[2] ?? "start";
```

---

## 3. Passing Arguments with npm

If `package.json` contains:

```json
"01": "tsx src/01-process-object"
```

Run:

```powershell
npm run 01 -- start
```

Then:

```ts
process.argv[2] // "start"
```

`--` tells npm to pass the following arguments to the script.

---

## 4. Flags

Check if a flag was provided:

```ts
const shouldFail = process.argv.includes("--fail");
const shouldCrash = process.argv.includes("--crash");
```

Run:

```powershell
npm run 01 -- start --crash
```

Then:

```ts
process.argv.includes("--crash") // true
```

---

## 5. `process.exit()`

Terminates the current process.

```ts
process.exit(0); // success
process.exit(1); // failure/error
```

Example:

```ts
if (shouldFail) {
  console.error("Failure");
  process.exit(1);
}
```

Common exit codes:

```text
0 → Success
1 → Failure
```

---

## 6. `process.on("exit")`

Listen for the process `exit` event.

```ts
process.on("exit", (code) => {
  console.log(`Process finished with exit code ${code}`);
});
```

---

## 7. Useful npm Scripts

```json
"dev": "tsx watch src/index.ts",
"build": "tsc",
"01": "tsx src/01-process-object"
```

```text
npm run dev
→ Run TypeScript + automatically restart when files change

npm run build
→ Compile TypeScript → JavaScript

npm run 01
→ Run a specific TypeScript file directly with tsx
```

---

## Interview Quick Answers

### What is `process`?

> A built-in Node.js object that provides information about and control over
> the currently running process.

### What is `process.env`?

> It provides access to environment variables.

### What is `process.argv`?

> An array containing the command-line arguments passed to the Node.js process.

### What is `process.exit(1)`?

> It terminates the process with an exit code indicating failure.

### How do you check a CLI flag?

```ts
process.argv.includes("--flag");
```

### How do you pass arguments to an npm script?

```powershell
npm run 01 -- argument
```

---

## Remember

```text
process.env
→ Environment Variables

process.argv
→ Command-line Arguments

process.argv[2]
→ First user argument

process.argv.includes("--flag")
→ Check for a flag

process.exit(0)
→ Success

process.exit(1)
→ Failure

process.on("exit", ...)
→ Listen for process exit
```

```
```
