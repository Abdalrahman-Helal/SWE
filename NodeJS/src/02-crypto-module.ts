import { log } from "node:console";
import crypto, { randomBytes } from "node:crypto"

// built in node js module 

// security related task
// creating random UUIDs and IDs
// creating secure tokens
// hashing data
// to verify data integrity
// encrypting and decrypting data



// unique ID 
// user id , order id , session id
const requestId = crypto.randomUUID();
console.log(requestId);




// crypto.randomBytes();
// password reset token
// email verification 
// session secret , api keys
const resetToken = crypto.randomBytes(16).toString('hex');
console.log(resetToken);


// crypto.createHash();

// hello -> hash
// hash -> hello 


const text = "hello node";
const text2 = "hello node";

const hash = crypto.createHash("sha256").update(text).digest('hex');
const hash2 = crypto.createHash("sha256").update(text2).digest('hex');
console.log(hash);
console.log(hash2);



// crypto.createHmac

// normal hash : data -> hash

// HMAC : data + secret -> signed hash

// webhook 
// signet tokens

const secret = "my-super-secret-key" 
const message = "user_id=1"

const signature = crypto.createHmac('sha256', secret).update(message).digest('hex')

console.log(signature);

const signatureVerify = crypto.createHmac('sha256', secret).update(message).digest('hex');

console.log('signature is valid and mathing', signature === signatureVerify);

