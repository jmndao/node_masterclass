/*
 * Library for request handlers
 *
 */

// Dependencies
const _data = require("./data");
const helpers = require("./helpers");

// handlers Contander
const handlers = {};

// Users
handlers.users = (data, callback) => {
    const acceptableMethods = ["post", "get", "put", "delete"];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, callback);
    } else {
        callback(405);
    }
};

// Container for users submethods
handlers._users = {};
// User - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = (data, callback) => {
    // Check that all required fields are filled
    const firstName =
        typeof data.payload.firstName === "string" &&
        data.payload.firstName.trim().length > 0 ?
        data.payload.firstName.trim() :
        false;
    const lastName =
        typeof data.payload.lastName === "string" &&
        data.payload.lastName.trim().length > 0 ?
        data.payload.lastName.trim() :
        false;
    const phone =
        typeof data.payload.phone === "string" &&
        data.payload.phone.trim().length == 9 ?
        data.payload.phone.trim() :
        false;
    const password =
        typeof data.payload.password === "string" &&
        data.payload.password.trim().length > 0 ?
        data.payload.password.trim() :
        false;
    const tosAgreement =
        typeof data.payload.tosAgreement === "boolean" && data.payload.tosAgreement ?
        true :
        false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // Make sure the user does not already exist
        _data.read("users", phone, (err, data) => {
            if (err) {
                // Hash the password
                const hashedPassword = helpers.hash(password);

                // Continue if only the hashPassword went fine
                if (hashedPassword) {
                    // Create the user Object
                    const userObject = {
                        firstName,
                        lastName,
                        phone,
                        hashedPassword,
                        tosAgreement,
                    };

                    // Create the user in the data folder
                    _data.create("users", phone, userObject, (err) => {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, { Error: "Could not create the new user" });
                        }
                    });
                } else {
                    callback(500, { Error: "Could not hash the new user's password" });
                }
            } else {
                // User already exists
                callback(400, {
                    Error: "A user with that phone number already exists.",
                });
            }
        });
    } else {
        callback(400, { Erro: "Missing Required fields." });
    }
};

// User - put
// Required data: phone
// Optional data: firstName, lastName, password (at least one must be specified)
handlers._users.put = (data, callback) => {
    // Collect the phone from request
    const phone =
        typeof data.payload.phone == "string" &&
        data.payload.phone.trim().length == 9 ?
        data.payload.phone.trim() :
        false;

    if (phone) {
        // Collect other optional data
        const firstName =
            typeof data.payload.firstName == "string" &&
            data.payload.firstName.trim().length > 0 ?
            data.payload.firstName.trim() :
            false;
        const lastName =
            typeof data.payload.lastName == "string" &&
            data.payload.lastName.trim().length > 0 ?
            data.payload.lastName.trim() :
            false;
        const password =
            typeof data.payload.password == "string" &&
            data.payload.password.trim().length > 0 ?
            data.payload.password.trim() :
            false;

        // Read the user data with the given phone
        _data.read("users", phone, (err, userData) => {
            if (!err && userData) {
                // Update the user according to the specified field
                userData.firstName = firstName || userData.firstName;
                userData.lastName = lastName || userData.lastName;
                userData.hashedPassword =
                    helpers.hash(password) || userData.hashedPassword;

                // Store the new user data
                _data.update("users", phone, userData, (err) => {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, { Error: "Could not update the user" });
                    }
                });
            } else {
                callback(404, { Error: "This user does not exist " });
            }
        });
    }
};

// User - get
// Required data: phone
// Optional data: none
// @TODO    only allow authenticated users to read their own data
handlers._users.get = (data, callback) => {
    const phone =
        typeof data.queryStringURL.get("phone") == "string" &&
        data.queryStringURL.get("phone").trim().length == 9 ?
        data.queryStringURL.get("phone") :
        false;
    // Lookup the user
    if (phone) {
        _data.read("users", phone, (err, data) => {
            if (!err && data) {
                // We remove the hashed password
                delete data.hashedPassword;
                callback(200, data);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, { Error: "Missing required field" });
    }
};

// User - delete
// Required data: phone
// Optional data: none
// @TODO    only authenticated users can delete their own data
//          ...
handlers._users.delete = (data, callback) => {
    // Collect user phone from the queryStringURL
    const phone =
        typeof data.queryStringURL.get("phone") == "string" &&
        data.queryStringURL.get("phone").trim().length == 9 ?
        data.queryStringURL.get("phone").trim() :
        false;

    if (phone) {

        // Read the user
        _data.read('users', phone, (err, data) => {
            if (!err && data) {
                // Delete this user
                _data.delete('users', phone, (err) => {
                    if (!err) {
                        // ...
                        callback(200);
                    } else {
                        callback(500, { 'Error': 'Could not delete the specified user.' });
                    }
                })
            } else {
                callback(404, { 'Error': 'Could not read this user.' });
            }
        })
    } else {
        callback(404, { 'Error': 'Missing required field' });
    }
};

// Sample handler
handlers.ping = (data, callback) => {
    // Callback a http status code and a payload object
    callback(200);
};

// Not found handler
handlers.notFound = (data, callback) => {
    callback(404);
};

// Export handlers as module
module.exports = handlers;