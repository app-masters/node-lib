const envs = {};

let rollbar = {
    accessToken: "someToken",
    logOnDev: false
};

let denyAccess = {
    admin: ['user'],
    mobile: []
};

envs.development = {
    database: {
        url: "local"
    },
    rollbar: rollbar,
    security: {
        disabledOnDev: false,
        secret: "someSecret",
        denyAccess
    }
};

envs.test = envs.development;

envs.production = {
    database: {
        url: "mongo"
    },
    rollbar: rollbar,
    security: {
        secret: "someSecret",
        denyAccess
    }
};

envs.staging = envs.production;

module.exports = envs;
