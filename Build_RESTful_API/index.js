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
    const decoder = new StringDecoder("utf-8");
    var buffer = "";
    req.on("data", (data) => {
        buffer += decoder.write(data);
    });
    req.once("end", () => {
        buffer += decoder.end();

        // Choose the handler this request should go to
        const choosenHandler =
            typeof router[trimmedPath] !== "undefined" ?
            router[trimmedPath] :
            handlers.notFound;

        // Construct the data object to send to the handler
        const data = {
            trimmedPath: trimmedPath,
            queryStringURL: queryStringURL,
            method: method,
            headers: headers,
            payload: buffer,
        };

        choosenHandler(data, (statusCode, payload) => {
            // Use the status code called back by the handler, or default to 200
            statusCode = typeof statusCode == "number" ? statusCode : 200;
            // use the payload called back by the handler, or default to an empty
            payload = typeof payload == "object" ? payload : {};
            // Convert a payload to a string
            const payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode)
            res.end(payloadString);

            // Log the request path
            console.log("Returning this response: " + statusCode, payloadString);
        });
    });
});

// Start the server and have it listen on port 3000
server.listen(3000, () => {
    console.log("The server is listening on PORT 3000");
});

// Define handlers
const handlers = {};

// Sample handler
handlers.sample = (data, callback) => {
    // Callback a http status code and a payload object
    callback(406, { name: "sample handler" });
};

// Not found handler
handlers.notFound = (data, callback) => {
    callback(404);
};

// Define a request router
const router = {
    'sample': handlers.sample
};