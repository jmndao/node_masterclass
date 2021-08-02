/*
 *  Primary file for the API
 */

// Depedencies
const fs = require("fs");
const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");

// Instanciation of the HTTP Server
const httpServer = http.createServer((req, res) => {
    unifiedServer(req, res);
});

// Start the HTTP server
httpServer.listen(config.httpPort, () => {
    console.log(
        `The server is listening on PORT ${config.httpPort} in ${config.mode}`
    );
});

// Instanciation of the HTTPS Server
const httpsServerOptions = {
    key: fs.readFileSync("./https/localhost.key"),
    cert: fs.readFileSync("./https/localhost.cert"),
};

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
    unifiedServer(req, res);
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort, () => {
    console.log(
        `The server is listening on PORT ${config.httpsPort} in ${config.mode}`
    );
});

// All the server logic for both http and https
const unifiedServer = (req, res) => {
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
            res.setHeader("Content-Type", "application/json");
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the request path
            console.log("Returning this response: " + statusCode, payloadString);
        });
    });
};

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
    sample: handlers.sample,
};