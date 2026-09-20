// piece by piece
// not loading the data all at once, but in chunks
// reading , uplaoding , downloading , processing large files
// video / audio processing
// compression
// chunks

// here is my full 500mb file
// here is chunk 1
// here is chunk 2
// here is chunk 3
// here is chunk 4
// here is chunk 5

// memory efficient way to handle large files

// stream types
// readable stream - read data from a source
// writable stream - write data to a destination
// transform stream - read data from a source, transform it, and write it to a destination

import { read } from "node:fs";
import { Readable, Transform, Writable } from "node:stream";
import { pipeline } from "node:stream/promises";

const readableStream = Readable.from(["hello", "from", "node.js", "streams"]);

const uppercaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    const text = chunk.toString();
    callback(null, text.toUpperCase())
  },
});


const writableStream = new Writable({
  write(chunk, encoding, callback) {
    console.log('received chunk', chunk.toString());

    callback()
  },
})


async function main(): Promise<void> {
  try{
    await pipeline(readableStream , uppercaseTransform , writableStream);
    console.log('stream completed');

  }catch(error){
    const msg = error instanceof Error? error.message : "unknown error";
    console.error('Stream failed', msg)
  }
}

main();