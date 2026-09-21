import http, { IncomingMessage, ServerResponse } from "node:http";


const PORT = 5002;

type CreateUserBody = {
  name?: string;
  email?: string;
};

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    const method = req.method ?? "GET";
    const requestUrl = new URL(req.url ?? "/", `http://${req.headers.host}`);
    const pathName = requestUrl.pathname;

    res.setHeader("Content-Type", "text/plain");

    if (method === "POST" && pathName === "/users") {
      const chunks: Buffer[] = [];
      // data event is going to run evert time a new chunk of data is received from the request body
      req.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      req.on("end", () => {
        try{
            const rawBody = Buffer.concat(chunks).toString("utf-8");

          if (!rawBody) {
            res.statusCode = 400;
            res.end("req body is required");
            return;
          }

          const body = JSON.parse(rawBody) as CreateUserBody;
          if (!body.name || !body.email) {
            res.statusCode = 400;
            res.end("both name and email are required");
            return;
          }
          res.statusCode = 201;
          res.end(`User Created ${body.name} and ${body.email}`)
        }catch{
          res.statusCode = 400;
          res.end('Invalid JSON body')
        }
      });

      req.on('error', () => {
        res.statusCode = 500;
        res.end('Failed to read request body');
      })

      return;
    }
  }

);


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
})