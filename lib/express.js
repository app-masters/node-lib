const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const methodOverride = require('method-override');
const passport = require('passport');

module.exports = (envConfigs) => {
    const {corsOptions} = envConfigs.server;
    const app = express();

    app.use(function(req, res, next) {
        if (req.get('x-amz-sns-message-type')) {
            req.headers['content-type'] = 'application/json';
        }
        next();
    });
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cookieParser());
    app.use(methodOverride());
    app.use(cors(corsOptions));
    app.use(passport.initialize());

    return app;
}
