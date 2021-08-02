/*
 *  Create and export configuration variables
 *
 */

// Container for all the environments
const environments = {};

// Staging (default) environment
environments.staging = {
    port: 3000,
    mode: "staging",
};

// Production environmnet
environments.production = {
    port: 5000,
    mode: "production",
};

// Determine which environment key was passed as a command-line argument
const currentEnvironment =
    typeof process.env.NODE_ENV == "string" ?
    process.env.NODE_ENV.toLowerCase() :
    "";

// Check that the current environment is one of the environment above, if not, default to staging
const environmentToExport =
    typeof environments[currentEnvironment] == "object" ?
    environments[currentEnvironment] :
    environments.staging;

// Export the module
module.exports = environmentToExport;