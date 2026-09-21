# Node.js `path` Module — Cheat Sheet

## 1. What is `path`?

`path` is a **built-in Node.js module** used to build and work with file and folder paths.

```ts
import path from "node:path";
```

Common uses:

* Build paths
* Get file names
* Get file extensions
* Get parent folders
* Check path patterns

---

# 2. `process.cwd()`

Returns the folder where the **Node.js process was started**.

```ts
const projectRoot = process.cwd();

console.log(projectRoot);
```

Example:

```text
H:\Git\SWE\NodeJS
```

### Remember

```text
process.cwd()
      ↓
Current working directory
```

---

# 3. `path.join()`

Builds a path by joining multiple parts.

```ts
const uploadFilePath = path.join(
  projectRoot,
  "uploads",
  "users",
  userId,
  originalName
);
```

Result:

```text
H:\Git\SWE\NodeJS\uploads\users\42\profile.photo.png
```

It automatically uses the correct separator for the current OS.

### Important

`path.join()` **only creates a path string**.

It does NOT:

* Create the folder
* Create the file
* Check if the path exists

---

# 4. `path.basename()`

Returns the **last part of the path**, usually the file name.

```ts
path.basename(uploadFilePath);
```

Result:

```text
profile.photo.png
```

Think:

```text
H:\Git\SWE\NodeJS\uploads\users\42\profile.photo.png
                                      ↑
                                   basename
```

---

# 5. `path.extname()`

Returns the **file extension**.

```ts
path.extname(uploadFilePath);
```

Result:

```text
.png
```

Example:

```text
profile.photo.png
             ↑
          extname
```

---

# 6. `path.dirname()`

Returns the **parent directory/folder**.

```ts
path.dirname(uploadFilePath);
```

Result:

```text
H:\Git\SWE\NodeJS\uploads\users\42
```

Think:

```text
dirname                    basename
   ↓                           ↓
uploads/users/42/profile.photo.png
```

---

# 7. `path.matchesGlob()`

Checks if a path matches a **glob pattern**.

```ts
const filePath = "uploads/profile.png";

const isPngFile = path.matchesGlob(
  filePath,
  "*.png"
);

console.log(isPngFile);
```

Result:

```text
true
```

Because:

```text
*.png
  ↓
Any file ending with .png
```

Examples:

```text
profile.png → true
avatar.png  → true
photo.jpg   → false
```

### `*`

`*` means **any sequence of characters**.

```text
*.png
 ↓
anything.png
```

### Remember

```text
path.matchesGlob(path, pattern)
             ↓
      Does the path match?
             ↓
          true / false
```

---

# 8. Important Functions

| Function             | Purpose                           |
| -------------------- | --------------------------------- |
| `process.cwd()`      | Current working directory         |
| `path.join()`        | Build a path                      |
| `path.basename()`    | Get file name                     |
| `path.extname()`     | Get extension                     |
| `path.dirname()`     | Get parent directory              |
| `path.matchesGlob()` | Check path against a glob pattern |

---

# Quick Interview Revision

**Q: Does `path.join()` create a folder?**

A: No. It only creates a **path string**.

**Q: How do you get the file name?**

```ts
path.basename(filePath)
```

**Q: How do you get the extension?**

```ts
path.extname(filePath)
```

**Q: How do you get the parent folder?**

```ts
path.dirname(filePath)
```

**Q: What does `matchesGlob()` do?**

A: Checks whether a path matches a given glob pattern.

### Mental Model

```text
process.cwd()       → where Node started
path.join()         → build path
path.basename()     → filename
path.extname()      → extension
path.dirname()      → parent folder
path.matchesGlob()  → pattern match
```
