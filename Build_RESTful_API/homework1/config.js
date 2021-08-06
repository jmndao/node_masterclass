/*
 * Configuragion file for the server
 *
 */

// Container for environment variables
const env = {};

// Variables for production environment
env.production = {
    HTTP_PORT: 5000,
    HTTPS_PORT: 5001,
    mode: 'production',
    HTTPS: true
};

// Variables for staging environment (default)
env.staging = {
    HTTP_PORT: 3000,
    HTTPS_PORT: 3001,
    mode: 'staging',
    HTTPS: false
};

// Determine which environment has been choosen
const currentEnv = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : "";

// Check the currentEnv if it's among those defined  above
const envToExport = typeof env[currentEnv] === 'object' ? env[currentEnv] : env.staging;

// Export the module
module.exports = envToExport;