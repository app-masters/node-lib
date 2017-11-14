const envs = {};

let rollbar = {
    accessToken: "someToken",
    logOnDev: false
};

let denyAccess = {
    admin: ['user'],
    mobile: []
};


var mail = {
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

envs.development = {
    database: {
        url: "local"
    },
    rollbar: rollbar,
    security: {
        disabledOnDev: false,
        secret: "someSecret",
        denyAccess
    },
    mail: mail
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
