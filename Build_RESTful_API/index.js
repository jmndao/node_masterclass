/*
 *  Primary file for the API
 */

// Depedencies
const http = require("http");
const url = require("url");

// The server should respond to all request with a string
const server = http.createServer((req, res) => {
    const baseURL = "http://" + req.headers.host + "/";
    // Get the URL and parse it
    const parsedURL = new url.URL(req.url, baseURL);

    // Get the path from that URL
    const path = parsedURL.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, "");

    // Get the query string as an object
    const queryStringURL = parsedURL.searchParams.toString();


    // Get the Http method
    const method = req.method.toLowerCase();

    // Send the response
    res.end("Hello World\n");

    // Log the request path
    console.log(
        "Request is received on path: " +
        trimmedPath +
        " with this mehtod: " +
        method +
        " with the query string: " + queryStringURL
    );
});

// Start the server and have it listen on port 3000
server.listen(3000, () => {
    console.log("The server is listening on PORT 3000");
});