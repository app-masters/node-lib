var express = require('express');
var Rollbar = require('rollbar');
var rollbar;

class AMError {
    static init(app){
        AMError.config = global.config;
        if (!AMError.config){
            throw new Error("amBootstrap must be called before amError. Config are not loaded.");
        }

        // Error handlers
        if (process.env.NODE_ENV !== 'development' && (!config.rollbar || !config.rollbar.accessToken)) {
            console.warn("!! No rollbar accessToken in config file !!");
        }
        if (config.rollbar && (process.env.NODE_ENV !== 'development' || config.rollbar.logOnDev)) {
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

        return true;
    }


    static listen(app){

        return true;

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

        app.use(clientErrorHandler);
        app.use(defaultErrorHandler);

        return true;
    }
}

AMError.config = null;

module.exports = AMError;
