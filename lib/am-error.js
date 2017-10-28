var express = require('express');
var Rollbar = require('rollbar');

// Configure the library to send errors to api.rollbar.com

// to specify payload options - like extra data, or the level - pass a custom object
// rollbar.error(e, request, {level: "info"});

// Use the rollbar error handler to send exceptions to your rollbar account
// app.use(rollbar.errorHandler());
var rollbar;

module.exports = function (app, config) {
    app.use(clientErrorHandler);
    app.use(defaultErrorHandler);

    // Error handlers
    if (process.env.NODE_ENV === 'production' && (!config.rollbar || !config.rollbar.accessToken)) {
        console.warn("!! No rollbar accessToken in config file !!");
    }
    if (config.rollbar && (process.env.NODE_ENV === 'production' || config.rollbar.logOnDev)) {
        rollbar = new Rollbar(
            {
                accessToken: config.rollbar.accessToken,
                environment: "api_" + process.env.NODE_ENV,
                handleUncaughtExceptions: true,
                handleUnhandledRejections: true
            }
        );
        rollbar.log("API initialized");

        app.use(rollbar.errorHandler());
        global.rollbar = rollbar;
    }

    process.on("unhandledRejection", function (reason, p) {
        console.error("------- unhandledRejection (am-error.js) ------- ");
        console.error("Unhandled reason.object", reason.object);
        console.error("Unhandled reason", reason);
        console.error("Unhandled p", p);

        if (rollbar) {
            console.error(' > send to rollbar ');
            rollbar.error(reason.Error, reason.object);
        } else {
            console.error(" > Whould be sent to Rollbar (!logOnDev)");
        }
    });

    process.on('uncaughtException', (err) => {
        console.error("------- uncaughtException (am-error.js) ------- ");
        console.error(err);

        if (rollbar) {
            console.error(' > send to rollbar ');
            rollbar.error(err);
        } else {
            console.error(" > Whould be sent to Rollbar (!logOnDev)");
        }
    });

    function clientErrorHandler (err, req, res, next) {
        console.error('-------  clientErrorHandler (am-error.js) ------- ');
        console.error('xhr', req.xhr);
        console.error('message', err.message);
        console.error('stack', err.stack);

        if (rollbar) {
            console.error(' > send to rollbar ');
            rollbar.error(err, req);
        } else {
            console.error(" > Whould be sent to Rollbar (!logOnDev)");
        }

        if (req.xhr) {
            res.status(500).send({error: 'Something failed!'});
        } else {
            next(err);
        }
    }

    function defaultErrorHandler (err, req, res, next) {
        console.error('-------  defaultErrorHandler (am-error.js) ------- ');
        console.error('message', err.message);
        console.error('stack', err.stack);
        // res.status(500).send('Something broke!');
        resError(res, 500, err.message);
    }

    function resError (res, status, message) {
        // res.writeHead(status, message, {'content-type': 'text/plain'});
        // res.end(message);
        // validation failed
        res.status(status).send(message);
    }

// 404
    app.use(function (req, res, next) {
        res.status(404).send('Just a 404');
    });
};
