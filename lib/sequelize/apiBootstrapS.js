const AMAuth = require('../am-auth');
const Auth = require('./auth');
const AMError = require('../am-error');
const AMMailing = require('../am-mailing');
const AMInvite = require('../am-invite');
const Message = require('../message');
const Notification = require('../notification');
const DotEnv = require('dotenv');
const SequelizeInstance = require('./sequelizeInstance');
const Session = require('./session');

// Mass requires
const morgan = require('morgan');

function setup(app, envs, packag) {
    // Validate params
    if (!app)
        return logThrowError('You must pass app as first parameter to amBootstrap');
    if (!envs)
        return logThrowError('You must pass envs as second parameter to amBootstrap');
    if (!packag)
        return logThrowError('You must pass packag as third parameter to amBootstrap');
    if (envs.production && envs.production.database && envs.production.database.url)
        return logThrowError('Database URL are not allowed in prod config anymore. Use heroku env DATABASE_URL to store it.');
    if (envs.staging && envs.staging.database && envs.staging.database.url)
        return logThrowError('Database URL are not allowed in staging config anymore. Use heroku env DATABASE_URL to store it.');
    if (!envs.development)
        return logThrowError('You should pass the complete \'envs\' objects as second parameter to amBootstrap, not more \'config\'. Bootstrap will load the right env config.');




    // 1 = Envs and config
    let nodeEnv = process.env.NODE_ENV;
    if (nodeEnv === undefined) {
        if (process.env.NODE && ~process.env.NODE.indexOf('heroku')) {
            return logThrowError('API cannot run on heroku without NODE_ENV defined. You must set it!');
        } else {
            console.warn('Running local. Forcing \'development\' environment on NODE_ENV');
            nodeEnv = 'development';
            process.env.NODE_ENV = 'development';
        }
    }

    // Get heroku env database url
    if (nodeEnv === 'production' || nodeEnv === 'staging') {
        console.log(nodeEnv, 'process.env', process.env.DATABASE_URL);
        if (!process.env.DATABASE_URL)
            return logThrowError('Enviroment variable DATABASE_URL are not set');
        envs.production.database = {url: process.env.DATABASE_URL};
    } else {
        DotEnv.config();
        if (process.env.DATABASE_URL) {
            console.log('Local .env successfully loaded');
        }
    }

    // Load config by env
    if (!envs[nodeEnv] || envs[nodeEnv].length === 0) {
        return logThrowError('Missing config for \'' + nodeEnv + '\' env in config.js');
    }
    const config = envs[nodeEnv];
    global.config = config;

    // Last validations
    if (!config.database.url)
        return logThrowError('config.database.url not set on current env "' + nodeEnv + '"');

    AMError.init(app);

    // Setup database
    databaseSetup(config.database);

    // Auth
    Auth.setup(config);

    // Inform API version on every result
    let apiVersion = packag.version;
    let minWebVersion = packag.minWebVersion;
    let minMobileVersion = packag.minMobileVersion;
    let minAdminVersion = packag.minAdminVersion;

    app.use((req, res, next) => {
        res.setHeader('api-version', apiVersion);
        res.setHeader('api-env', nodeEnv);
        if (minWebVersion) {
            res.setHeader('min-web-version', minWebVersion);
        }
        if (minMobileVersion) {
            res.setHeader('min-mobile-version', minMobileVersion);
        }
        if (minAdminVersion) {
            res.setHeader('min-admin-version', minAdminVersion);
        }
        next();
    });

    // Force "client" header to exists on every request received
    if (config.security.checkClientOnDev) {
        app.use((req, res, next) => {
            if (!req.headers.client) {
                throw new Error('Are you my client?');
            } else if (['admin', 'web', 'mobile', 'client'].indexOf(req.headers.client) < 0) {
                throw new Error('Are you really my client?');
            } else {
                next();
            }
        });
    }

    // Start RdStation
    if (config.rdStation && (nodeEnv !== 'development' || config.rdStation.sendOnDev)) {
        let LeadManager = require('@app-masters/node-lib').amLeadManager;
        LeadManager.setRdToken(config.rdStation.privateToken, config.rdStation.token);
    }

    // Mail and SMS config
    if (config.mail || config.AWS) {
        AMMailing.setup(config);
    }

    // Invite config
    if (config.invite) {
        AMInvite.setup(config.invite);
    }

    // Message config
    if (config.message) {
        Message.setup(config.message);
    }

    if (config.notification) {
        Notification.setup(config.notification);
    }


    // Morgan - log
    let morganTest = morgan(function (tokens, req, res) {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms'
        ].join(' ');
    });
    app.use(morganTest, function (req, res, next) {
        if (req.method === 'POST') {
            console.log('POST body', req.body);
        } else if (req.method === 'PUT') {
            console.log('PUT body', req.body);
        }
        next();
    });
    return true;
}


function databaseSetup(config) {

    const options = {
        forceSync: config.forceSync || false, // Force database to be recreated
        logging: config.logging || false, // Show SQL queries on terminal
        syncLogging: config.syncLogging || false // Show SQL queries used to sync
    };

    const sequelize = SequelizeInstance.setup(config.url, options);
}

function listen(app) {
    AMError.listen(app);

    if (global.config.session){
        Session.setup(app, global.config.session);
    }

    // 404
    app.use((req, res) => {
        res.status(404).json({notFound: true});
    });

    // Start the server
    const port = process.env.PORT || global.config.port || 3000;
    return app.listen(port, () => console.log(`App listening at ${port}`));
}

function logThrowError(message) {
    console.error(message);
    throw new Error(message);
}

module.exports = {
    setup,
    listen
};
