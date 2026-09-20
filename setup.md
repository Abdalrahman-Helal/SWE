# Node.js + TypeScript Setup

## 1. Create Project

```bash
mkdir my-project
cd my-project
npm init -y
```

## 2. Install Packages

```bash
npm install -D typescript tsx @types/node
```

* `typescript` → TypeScript compiler
* `tsx` → Run `.ts` files directly
* `@types/node` → Node.js types (`http`, `fs`, `process`, etc.)

## 3. Create tsconfig

```bash
npx tsc --init
```

Replace `tsconfig.json` with:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "types": ["node"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

## 4. Configure ESM

In `package.json`:

```json
"type": "module"
```

Use:

```ts
import http from "node:http";
```

Don't mix with CommonJS:

```ts
require("node:http"); // ❌
import http = require("node:http"); // ❌
```

## 5. Project Structure

```text
my-project/
├── src/
│   └── app.ts
├── dist/
├── node_modules/
├── package.json
├── package-lock.json
└── tsconfig.json
```

## 6. Scripts

In `package.json`:

```json
"scripts": {
  "dev": "tsx watch src/app.ts",
  "build": "tsc",
  "start": "node dist/app.js"
}
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Run

```bash
npm start
```

## Quick Setup

```text
npm init -y
        ↓
npm install -D typescript tsx @types/node
        ↓
npx tsc --init
        ↓
"type": "module"
        ↓
NodeNext + types: ["node"]
        ↓
```
