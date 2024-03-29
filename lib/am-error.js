const Rollbar = require('rollbar');
let rollbar = null;

class AMError {
    static init(app) {
        const config = global.config;
        AMError.config = config;
        if (!config) {
            throw new Error('amBootstrap must be called before amError. Config are not loaded.');
        }
        // Error handlers
        if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test' && (!config.rollbar || !config.rollbar.accessToken)) {
            console.warn('!! No rollbar accessToken in config file !!');
            global.rollbarDisabled = true;
        }

        if (config.rollbar && (process.env.NODE_ENV !== 'development' || config.rollbar.logOnDev)) {
            rollbar = new Rollbar({
                accessToken: config.rollbar.accessToken,
                environment: 'api_' + process.env.NODE_ENV,
                handleUncaughtExceptions: true,
                handleUnhandledRejections: true,
                captureEmail: true,
                captureUsername: true
            });
            rollbar.log('API initialized');
            app.use(rollbar.errorHandler());
            global.rollbar = rollbar;
        } else {
            global.rollbar = {
                log: (message, obj) => {
                    console.log('> Should be sent to rollbar as log', message, obj);
                },
                error: (message, obj) => {
                    console.error('> Should be sent to rollbar as error', message, obj);
                },
                info: (message, obj) => {
                    console.info('> Should be sent to rollbar as info', message, obj);
                },
                warning: (message, obj) => {
                    console.warn('> Should be sent to rollbar as warning', message, obj);
                },
                warn: (message, obj) => {
                    console.warn('> Should be sent to rollbar as warn', message, obj);
                },
                debug: (message, obj) => {
                    console.warn('> Should be sent to rollbar as debug', message, obj);
                },
                critical: (message, obj) => {
                    console.warn('> Should be sent to rollbar as critical', message, obj);
                }
            };
        }

        process.on('unhandledRejection', (reason, p) => {
            console.error('------- unhandledRejection (am-error.js) ------- ');
            console.error('Unhandled reason.object', reason.object);
            console.error('Unhandled reason', reason);
            console.error('Unhandled p', p);
            console.error('reason.name', reason.name);
            console.error('reason.message', reason.message);

            let message = reason.name + ":" + reason.message;
            console.error('message', message);

            if (rollbar || (rollbar = global.rollbar)) {
                rollbar.critical(message, reason);
            } else {
                console.log("No global.rollbar");
            }
        });

        process.on('uncaughtException', err => {
            console.error('------- uncaughtException (am-error.js) ------- ');
            console.error(err);

            if (rollbar || (rollbar = global.rollbar)) {
                rollbar.critical(err);
            } else {
                console.log("No global.rollbar");
            }
        });

        return true;
    }

    static listen(app) {

        if (global.rollbarDisabled) {
            console.error('API on cannot run without rollbar token. Exiting start');
            process.exit(1);
            return false;
        }

        const clientErrorHandler = (err, req, res, next) => {
            console.error('-------  clientErrorHandler (am-error.js) ------- ');
            console.error('xhr', req.xhr);
            console.error('message', err.message);
            let stack = err.stack;
            if (stack.indexOf('IncomingMessage')){
                stack = stack.substring(0,stack.indexOf('IncomingMessage'));
            }
            console.error('stack', stack);
            console.error('--- after stack ----');

            if (global.rollbar && req.user && req.user.local) {
                req.rollbar_person = {'id': req.user._id, 'username': req.user.name, 'email': req.user.local.email};
                req.person = req.rollbar_person;
            }

            if (global.rollbar)
                global.rollbar.critical(err, req);

            if (req.xhr) {
                res.status(500).send({error: 'Something failed!'});
            } else {
                next(err);
            }
        }

        const defaultErrorHandler = (err, req, res, next) => {
            console.error('-------  defaultErrorHandler (am-error.js) ------- ');
            console.error('message', err.message);
            let stack = err.stack;
            if (stack.indexOf('IncomingMessage')){
                stack = stack.substring(0,stack.indexOf('IncomingMessage'));
            }
            console.error('stack', stack);
            // res.status(500).send('Something broke!');
            let status = 500;
            if (!isNaN(err.name)) {
                status = err.name;
            }
            resError(res, status, err.message);
        }

        function resError(res, status, message) {
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
