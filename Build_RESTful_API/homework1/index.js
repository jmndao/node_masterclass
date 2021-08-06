/*
 * __author: Jonathan Moussa NDAO
 * __date: 02/08/2021
 * API that sends hello to user who browsed to /hello || /hello/ route
 *
 */

const http = require("http");
const https = require("https");
const fs = require("fs");
const { URL } = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");

// Instanciate the HTTP server
const httpServer = http.createServer((req, res) => {
    unifiedServer(req, res);
});

httpServer.listen(config.HTTP_PORT, () => {
    console.log(
        `The server is listening on PORT ${config.HTTP_PORT} in ${config.mode}`
    );
})

// Instanciate the HTTPS server
const httpsServerOptions = {
    key: fs.readFileSync("../https/localhost.key"),
    cert: fs.readFileSync("../https/localhost.cert"),
};

const httpsServer = http.createServer(httpsServerOptions, (req, res) => {
    unifiedServer(req, res);
});

httpsServer.listen(config.HTTPS_PORT, () => {
    console.log(
        `The server is listening on PORT ${config.HTTPS_PORT} in ${config.mode}`
    );
})

// All the server logic for both the HTTP and HTTPS
const unifiedServer = (req, res) => {
    const baseURL =
        config.HTTPS === true ?
        `https://${req.headers.host}/` :
        `http://${req.headers.host}/`;

    // Parse the url
    const parsedURL = new URL(req.url, baseURL);

    // Get the path from the url;
    const path = parsedURL.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, "");

    // Get the query string from the url
    const queryString = parsedURL.searchParams;

    // Get the HTTP method
    const method = req.method.toLowerCase();

    // Get the headers
    const headers = req.headers;

    // Get the payload if any
    // Data will get decoded in utf-8
    const decoder = new StringDecoder("utf-8");
    // Let's define a string buffer to hold the response data
    var buffer = "";
    // When we're receiving the request
    req.on("data", (data) => {
        buffer += decoder.write(data);
    });
    // Once we're finishing to receive the request data
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
            queryString: queryString,
            method: method,
            headers: headers,
            payload: buffer,
        };

        choosenHandler(data, (statusCode, payload) => {
            // Set the statusCode to the one in the callback or just set it to 200
            statusCode = typeof statusCode === "number" ? statusCode : 200;
            // Set the payload to the one in the callback or just set it to empty object
            payload = typeof payload === "object" ? payload : {};

            // Stringify the payload
            const payloadString = JSON.stringify(payload);

            // Return the response 
            res.setHeader("Content-Type", "application/json");
            res.writeHead(statusCode);
            res.end(`Hello with ${payloadString}`);

            // Log the request Path
            console.log(`Response send with ${statusCode} and payload ${payloadString}`);
        });
    });
};

const handlers = {};

handlers.notFound = (data, callback) => {
    callback(404);
};

handlers.hello = (data, callback) => {
    callback(202, "Hello");
};

// Define a request router
const router = {
    hello: handlers.hello,
};