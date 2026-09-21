import http, { IncomingMessage, ServerResponse } from "node:http";


const PORT = 5003;

type User = {
  id: number;
  name: string;
  email: string;
};

type ApiResponse<T> = {
  sucess: boolean;
  message: string;
  data?: T;
  error?: string;
};

const users: User[] = [
 {id: 1, name: 'John Doe', email: 'john.doe@example.com'},
 {id: 2, name: 'Jane Smith', email: 'jane.smith@example.com'}
];

function sendJson<T>(
  res: ServerResponse,
  statusCode: number,
  body: ApiResponse<T>,
): void {
  res.statusCode = statusCode;

  res.setHeader("Content-Type", "application/json");

  res.end(JSON.stringify(body));
}

const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    const method = req.method ?? "GET";
    const requestUrl = new URL(req.url ?? "/", `http://${req.headers.host}`);
    const pathName = requestUrl.pathname;

    if (method === "GET" && pathName === "/") {
      sendJson(res, 200, {
        sucess: true,
        message: "server is running",
        data: {
          routes: ["GET/users"],
        },
      });
      return;
    }
    if(method === 'GET' && pathName === '/users'){
      sendJson(res, 200 , {
        sucess: true,
        message: 'user fetched successfully',
        data: users
      });
      return;
    }
    sendJson<null>(res, 404, {
      sucess: false,
      message: "Route not found",
      error: `${method} and ${pathName} is not exists`
    })
  },
);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
