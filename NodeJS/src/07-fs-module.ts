// file system

// create folder
// write files
// read files
// check file information
// delete files

// sync APIs : fs.readFileSync
// callback APIs
// promise APIs

// small startup scripts
// build scripts
// local demos

// bad practice at
// - http request handlers
// -high traffic APIs
// -background jobs

import path from "node:path";
import fs, { read, Stats, write } from "node:fs";
import { error } from "node:console";
import fsPromises from 'node:fs/promises'

const DEMO_FOLDER_PATH = path.join(process.cwd(), "file-system", "fs-demo");

const SYNC_FILE_PATH = path.join(DEMO_FOLDER_PATH, "sync-note.txt");
const CALLBACK_FILE_PATH = path.join(DEMO_FOLDER_PATH, "callback-note.txt");
const PROMISE_FILE_PATH = path.join(DEMO_FOLDER_PATH, "promise-note.txt");

type FileResult = {
  style: string;
  fileName: string;
  content: string;
  sizeBytes: number;
};

function ensureDemoFolderExists() {
  if (!fs.existsSync(DEMO_FOLDER_PATH)) {
    fs.mkdirSync(DEMO_FOLDER_PATH, { recursive: true });
  }
}

function runSyncExample(): FileResult {
  // write content the file
  fs.writeFileSync(SYNC_FILE_PATH, "Created using sync fs ", "utf-8");
  fs.appendFileSync(SYNC_FILE_PATH, "Appended using sync fs ", "utf-8");

  // read content
  const content = fs.readFileSync(SYNC_FILE_PATH, "utf-8");
  const stats = fs.statSync(SYNC_FILE_PATH);

  return {
    style: "sync",
    content,
    fileName: path.basename(SYNC_FILE_PATH),
    sizeBytes: stats.size,
  };
}

// promise APIs
async function runPromiseExample(): Promise<FileResult>{
  await fsPromises.writeFile(
    PROMISE_FILE_PATH,
    "Created using promise APIs ",
    'utf-8'
  )
  await fsPromises.appendFile(
    PROMISE_FILE_PATH,
    "Appended using promise APIs ",
    'utf-8'
  )
  const content = await fsPromises.readFile(PROMISE_FILE_PATH, 'utf-8');
  const stats = await fsPromises.stat(PROMISE_FILE_PATH);

  return {
    style: 'promises',
    content,
    fileName: path.basename(PROMISE_FILE_PATH),
    sizeBytes:stats.size
  }
}

// callback(error , result)
function runCallbackExample(): Promise<FileResult> {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      CALLBACK_FILE_PATH,
      "Created using callback fs",
      "utf-8",
      (writeError) => {
        if (writeError) {
          reject(writeError);
          return;
        }
        fs.appendFile(
          CALLBACK_FILE_PATH,
          "Appended using callback fs",
          "utf-8",
          (appendError) => {
            if (appendError) {
              reject(appendError);
              return;
            }
            fs.readFile(CALLBACK_FILE_PATH, "utf-8", (readError, content) => {
              if (readError) {
                reject(readError);
                return;
              }
              fs.stat(CALLBACK_FILE_PATH, (statError, stats) => {
                if (statError) {
                  reject(statError);
                  return;
                }
                resolve({
                  style: "callback",
                  content,
                  sizeBytes: stats.size,
                  fileName: path.basename(CALLBACK_FILE_PATH),
                });
              });
            });
          },
        );
      },
    );
  });
}

async function main(): Promise<void> {
  try {
    ensureDemoFolderExists();

    const syncResult = runSyncExample();
    const callbackResult = await runCallbackExample();
    const promiseResult = await runPromiseExample();

    console.log([syncResult , callbackResult , promiseResult]);

  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    console.error("file system error", message);
  }
}

main();
