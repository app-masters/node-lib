const AMAuth = require('./am-auth');
const AMError = require('./am-error');
const AMMailing = require('./am-mailing');
const AMInvite = require('./am-invite');
const Message = require('./message');
const Notification = require('./notification');

// Mass requires
const cors = require('cors');
const morgan = require('morgan');
const restful = require('node-restful');
const mongoose = restful.mongoose;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const Rollbar = require('rollbar');

// Where to put it?
//require('@app-masters/node-lib').checkVersion(packag);

function setup(app, envs, packag, passport) {
    // Validate params
    if (!app) {
        throw new Error("You must pass app as first parameter to amBootstrap");
    }
    if (!envs) {
        throw new Error("You must pass envs as second parameter to amBootstrap");
    }
    if (!packag) {
        throw new Error("You must pass packag as third parameter to amBootstrap");
    }

    // 1 = Envs and config
    if (process.env.NODE_ENV === undefined) {
        if (process.env.NODE && ~process.env.NODE.indexOf("heroku")) {
            throw new Error("API cannot run on heroku without NODE_ENV defined. You must set it!");
        } else {
            console.warn("Running local. Forcing 'development' environment on NODE_ENV");
            process.env.NODE_ENV = 'development';
        }
    }

    // Load config by env
    let config;
    if (envs.development) {
        if (!envs[process.env.NODE_ENV] || envs[process.env.NODE_ENV].length === 0) {
            throw new Error("Missing config for '" + process.env.NODE_ENV + "' env in config.js");
        }
        config = envs[process.env.NODE_ENV];
    } else {
        console.warn("You shold pass the complete 'envs' objects as second paramater to amBootstrap, not more 'config'. Bootstrap will load the right env config.");
        config = envs;
    }

    global.config = config;

    AMError.init(app);

    // Auth
    AMAuth.setup(passport);

    // Cors
    const corsOptions = {
        "origin": "*",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "preflightContinue": false,
        "optionsSuccessStatus": 204,
        exposedHeaders: "api-version, api-env, min-web-version, min-mobile-version, min-admin-version, user",
        allowedHeaders: "content-type, Authorization, authorization, client, client-env, admin-version, mobile-version, web-version"
    };
    app.use(cors(corsOptions));

    // Inform API version on every result
    let apiVersion = packag.version;
    console.log('API Version: ' + apiVersion);
    let minWebVersion = packag.minWebVersion;
    let minMobileVersion = packag.minMobileVersion;
    let minAdminVersion = packag.minAdminVersion;
    // if (!minWebVersion) { console.warn("!! You must set minWebVersion in package.json"); }
    // if (!minMobileVersion) { console.warn("!! You must set minMobileVersion in package.json"); }
    // if (!minAdminVersion) { console.warn("!! You must set minAdminVersion in package.json"); }
    app.use((req, res, next) => {
        // console.log('Version', packag.version);
        res.setHeader('api-version', apiVersion);
        res.setHeader('api-env', process.env.NODE_ENV);
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
                throw new Error("Are you my client?");
            } else if (["admin", "web", "mobile", "client"].indexOf(req.headers.client) < 0) {
                throw new Error("Are you really my client?");
            } else {
                next();
            }
        });
    }

    // Start RdStation
    if (config.rdStation && (process.env.NODE_ENV !== 'development' || config.rdStation.sendOnDev)) {
        let LeadManager = require('@app-masters/node-lib').amLeadManager;
        LeadManager.setRdToken(config.rdStation.privateToken, config.rdStation.token);
    }

    // Mail config
    if(config.mail){
        AMMailing.setup(config.mail);
    }

    // Invite config
    if (config.invite){
        AMInvite.setup(config.invite);
    }

    // Message config
    if(config.message){
        Message.setup(config.message);
    }

    if(config.notification){
        Notification.setup(config.notification);
    }

    // Mass uses
    app.use(bodyParser({limit: '50mb'}));
    app.use(bodyParser.urlencoded({'extended': 'true'}));
    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(passport.initialize());

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

function listen(app) {

    AMError.listen(app);

    // 404
    app.use(function (req, res, next) {
        res.status(404).send('Just a 404');
    });

    // Start the server
    const port = process.env.PORT || global.config.port || 3000;
    console.log("Starting at NODE_ENV: " + process.env.NODE_ENV);
    app.listen(port, function () {
        console.log('listening on port: ' + port);
        // Move monogoose bootstrap to somewhere?
        // Start connection
        // Timeout? Retry connect? How to handle it?
        // console.log("PPPPPP", global.Promise);
        mongoose.Promise = global.Promise;
        let mongoDbUri = global.config.database.url;

        let options = {
            useMongoClient: true,
            keepAlive: 1, connectTimeoutMS: 30000,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 1000
        };

        mongoose.connect(mongoDbUri, options).catch((err) => {
            console.error('Mongoose error:');
            console.error(err);
            Rollbar.error(err);
            Rollbar.log(err);
            //{ MongoError: failed to connect to server [ds143362.mlab.com:43362] on first connect [MongoError: connect ETIMEDOUT 54.196.80.31:43362]
        });
        let db = mongoose.connection;

        // mongodb error
        db.on('error', (err) => {
            console.error('Connection error:');
            console.error(err);
            Rollbar.error(err);
            Rollbar.log(err);
            // Reconnect?
        });

        // Connection open
        db.once('open', () => {
            console.log(`Connected to Mongo at: ${new Date()}`)
        });

        // Disconnected
        db.on('disconnected', function () {
            console.error(`Mongoose default connection disconnected at: ${new Date()}`);
            // Reconnect?
        });
    });

    return true;
}

module.exports = {
    setup,
    listen
};
