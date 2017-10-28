var morgan = require('morgan');
var cors = require('cors');
let LeadManager = require('./am-leadManager');

module.exports = function (app, config, packag) {
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
    if (!minWebVersion) { console.warn("!! You must set minWebVersion in package.json"); }
    if (!minMobileVersion) { console.warn("!! You must set minMobileVersion in package.json"); }
    if (!minAdminVersion) { console.warn("!! You must set minAdminVersion in package.json"); }
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
    if (process.env.NODE_ENV !== 'development' || config.security.checkClientOnDev) {
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
};
