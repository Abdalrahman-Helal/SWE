const fs = require('fs');
const http = require('http');
const url = require('url');

//  ---------- reading - writing files ----------
// Blocking - synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textIn);

// const textOut = `this is what we know about avocado : ${textIn} \n Created on ${Date.now()}`;

// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written');



//  ---------- Non-Blocking, asynchronous way ----------

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if(err){
//     return console.log('ERROR! 🌋')
//   }
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);

//       fs.writeFile('./txt/final.txt',`${data2}\n${data3}` ,'utf-8', err => {
//         console.log('Your file has been written');
//       })
//     });
//   });
// });
// console.log('Will read file!');



// ---------- creating simple webserver ----------

// const server = http.createServer((req, res) => {
//   console.log(req);
//   res.end('Hello from the server!');
// });


// const client = server.listen(8000, '127.0.0.1', () => {
//   console.log('Listening to requests on port 8000');
// })




// ---------- Routing ----------

const server = http.createServer((req, res) => {
  const pathName = req.url
  if (pathName === '/' || pathName === '/overview') {
    res.end('This is the OVERVIEW');
  } else if (pathName === '/product') {
    res.end('This is the PRODUCT');
  } else {
    res.writeHead(404, {
      "content-type": 'text/html',
      'my-own-header': 'hello-world'
    });
    res.end('<h1> Page not found! </h1>');
  }
});

const client = server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
})