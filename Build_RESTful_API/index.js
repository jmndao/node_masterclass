/*
 *  Primary file for the API
 */

// Depedencies
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

// The server should respond to all request with a string
const server = http.createServer((req, res) => {
    const baseURL = "http://" + req.headers.host + "/";
    // Get the URL and parse it
    const parsedURL = new url.URL(req.url, baseURL);

    // Get the path from that URL
    const path = parsedURL.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, "");

    // Get the query string as an object
    const queryStringURL = parsedURL.searchParams;


    // Get the Http method
    const method = req.method.toLowerCase();

    // Get the headers as an object
    const headers = req.headers;

    // Get the payload if any
    const decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });
    req.once('end', () => {
        buffer += decoder.end();

        // Send the response
        res.end("Hello World\n");

        // Log the request path
        console.log(
            "Request is received with this payload: " +
            buffer
        );
    })

});

// Start the server and have it listen on port 3000
server.listen(3000, () => {
    console.log("The server is listening on PORT 3000");
});