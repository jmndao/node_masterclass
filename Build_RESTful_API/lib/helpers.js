// Helpers for various tasks

// Dependencies
const crypto = require('crypto');
const config = require('./config');

// Container
const helpers = {};

// Hash helpers
// Create a SHA256 hash
helpers.hash = (str) => {

    if (typeof str == 'string' && str.length > 0) {
        const _hash = crypto.createHmac('sha256', config.hashSecret).update(str).digest('hex');
        return _hash;
    } else {
        return false;
    }
};


// Parse data JSON to obj without throwing, in all cases
helpers.parseJSONtoObj = (str) => {
    try {
        const Obj = JSON.parse(str);
        return Obj;
    } catch (e) {
        return {}
    }
};


// Export the helpers module
module.exports = helpers;