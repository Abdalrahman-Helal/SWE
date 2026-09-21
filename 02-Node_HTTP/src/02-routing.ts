import http, {createServer, IncomingMessage , ServerResponse} from 'node:http';
import path from 'node:path';

const PORT = 5000;

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  const method = req.method ?? "GET"

  // http://localhost:5000/users req.url = /users
  // http://localhost:5000/users?id=1 req.url = /users?id=1
  const requestUrl = new URL(req.url ?? "/", `http://${req.headers.host}`)

  const pathName = requestUrl.pathname;
  res.setHeader('Content-Type' , 'text/plain')

  if(method === 'GET' && pathName === '/health'){
    res.statusCode = 200;
    res.end('Server is healthy');
    return;
  }

  if(method === 'POST' && pathName === '/users'){
    res.statusCode = 201;
    res.end('User created successfully');
    return;
  }

  res.statusCode = 404;
  res.end('Not Found');
})


server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});