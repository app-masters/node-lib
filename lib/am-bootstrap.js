var morgan = require('morgan');
var cors = require('cors');
let LeadManager = require('./am-leadManager');

module.exports = function (app, envs, packag) {
    // Validate params
    if (!app){
        throw new Error("You must pass app as first parameter to amBootstrap");
    }
    if (!envs){
        throw new Error("You must pass envs as second parameter to amBootstrap");
    }
    if (!packag){
        throw new Error("You must pass packag as third parameter to amBootstrap");
    }

    // Envs and config
    if (process.env.NODE_ENV === undefined) {
        if (process.env.NODE && ~process.env.NODE.indexOf("heroku")){
            throw new Error("API cannot run on heroku without NODE_ENV defined. You must set it!");
        } else {
            console.warn("Running local. Forcing 'development' environment on NODE_ENV");
            process.env.NODE_ENV = 'development';
        }
    }

    // Load config by env
    let config;
    if (envs.development){
        if (!envs[process.env.NODE_ENV] || envs[process.env.NODE_ENV].length === 0) {
            throw new Error("Missing config for '" + process.env.NODE_ENV + "' env in config.js");
        }
        config = envs[process.env.NODE_ENV];
    } else {
        console.warn("You shold pass the complete 'envs' objects as second paramater to amBootstrap, not more 'config'. Bootstrap will load the right env config.");
        config = envs;
    }

    global.config = config;

    // Cors
    const corsOptions = {
        "origin": "*",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "preflightContinue": false,
        "optionsSuccessStatus": 204,
        exposedHeaders: "api-version, api-env, min-web-version, min-mobile-version, min-admin-version, user",
        allowedHeaders: "content-type, Authorization, authorization, client, admin-version, mobile-version, web-version"
    };
    app.use(cors(corsOptions));

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
        if (minWebVersion) { res.setHeader('min-web-version', minWebVersion); }
        if (minMobileVersion) { res.setHeader('min-mobile-version', minMobileVersion); }
        if (minAdminVersion) { res.setHeader('min-admin-version', minAdminVersion); }
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
        LeadManager.setRdToken(config.rdStation.privateToken, config.rdStation.token);
    }

    return true;
};
