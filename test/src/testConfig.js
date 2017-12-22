const envs = {};

let rollbar = {
    accessToken: "someToken",
    logOnDev: false
};

let denyAccess = {
    admin: ['user'],
    mobile: []
};

let port = 3456;

const mail = {
    from: 'noreply@appmasters.io',
    fromName: 'App Masters',
    host: 'mail.appmasters.io',
    port: 2525,
    auth: {
        user: 'noreply@appmasters.io',
        pass: 'XO}O3$kBH}Bc'
    },
    tls: {
        rejectUnauthorized: false
    }
};

const invite = {
    singleUserLink: true,
    baseUrlAndRoute: 'http://publicurl.com/invite/',
    sendEmail: true
};

envs.development = {
    database: {
        url: "mongodb://127.0.0.1/node-lib_test_db"
    },
    rollbar: rollbar,
    security: {
        disabledOnDev: false,
        secret: "someSecret",
        denyAccess,
        singleLoginSignup: true
    },
    mail: mail,
    invite,
    port
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
    },
    port
};

envs.staging = envs.production;

module.exports = envs;
