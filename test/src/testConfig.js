const envs = {};

let rollbar = {
    accessToken: "someToken",
    logOnDev: false
};

let denyAccess = {
    admin: ['user'],
    mobile: []
};

const databaseMongoose = {
    driver: "mongoose",
    url: "mongodb://127.0.0.1/node-lib_test_db"
};

let port = 3456;

const message = {
    feedback: {
        to: "igor.phelype@gmail.com",
        subject: "Feedback de uso",
        saveToDb: true,
        fields: {name: 'Nome', gender: 'Sexo', text: 'Mensagem'}
    }
};

// notification config example
let notification = {
    credential: require('./serviceAccountKey'),
    databaseURL: 'https://good-burger.firebaseio.com'
};

const mail = {
    from: 'noreply@appmasters.io',
    fromName: 'App Masters',
    appName: 'App of Masters',
    host: 'mail.appmasters.io',
    port: 2525,
    auth: {
        user: 'noreply@appmasters.io',
        pass: 'XO}O3$kBH}B'
    },
    tls: {
        rejectUnauthorized: false
    },
    connectionTimeout: 3000,
    greetingTimeout: 3000,
};

const invite = {
    singleUserLink: true,
    baseUrlAndRoute: 'http://publicurl.com/invite', // Don't use / on the end
    sendEmail: true
};

envs.development = {
    database: databaseMongoose,
    rollbar: rollbar,
    security: {
        disabledOnDev: false,
        secret: "someSecret",
        denyAccess,
        singleLoginSignup: true
    },
    mail,
    invite,
    port,
    message,
    notification
};

envs.test = envs.development;

envs.production = {
    database: {
        driver: "mongoose",
        url: null
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
