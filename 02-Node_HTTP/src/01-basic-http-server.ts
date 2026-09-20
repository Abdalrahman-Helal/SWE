import http, {
  IncomingMessage,
  ServerResponse,
} from "node:http";

const PORT = 5000;

// ========================================
// Create HTTP Server
// ========================================

// createServer() creates a low-level HTTP server.
//
// The callback runs every time a client sends
// an HTTP request to our server.
//
// req -> incoming request from the client
// res -> response we will send back to the client
const server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {

    // ========================================
    // 1. Read Request Information
    // ========================================

    // HTTP method tells us what the client
    // wants to do.
    //
    // GET    -> read data
    // POST   -> create new data
    // PUT    -> replace existing data
    // PATCH  -> update part of existing data
    // DELETE -> delete data
    const method = req.method;

    // The URL tells us which path the client
    // is requesting.
    //
    // Examples:
    // /users
    // /products
    // /users/10
    const url = req.url;

    // Request headers contain metadata sent
    // by the client.
    //
    // Here, we are reading the User-Agent,
    // which usually contains information about
    // the browser or client.
    const userAgent = req.headers["user-agent"];


    // ========================================
    // 2. Build the Response
    // ========================================

    // HTTP status code tells the client
    // what happened with the request.
    //
    // 200 -> OK
    // 201 -> Created
    // 400 -> Bad Request
    // 404 -> Not Found
    // 500 -> Internal Server Error
    res.statusCode = 200;

    // Tell the client what type of data
    // we are sending in the response body.
    //
    // text/plain -> plain text
    res.setHeader("Content-Type", "text/plain");


    // ========================================
    // 3. Send the Response
    // ========================================

    // res.end() sends the response body
    // and finishes the HTTP response.
    res.end(
      `Basic HTTP Node Server

Method: ${method}
URL: ${url}
User-Agent: ${userAgent}`
    );
  }
);


// ========================================
// Start the Server
// ========================================

// Start listening for incoming requests
// on port 5000.
server.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});