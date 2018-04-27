const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const methodOverride = require('method-override');
const passport = require('passport');
const Rollbar = require('rollbar');

module.exports = (envConfigs) => {
    const {corsOptions, rollbar} = envConfigs;
    const app = express();

    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cookieParser());
    app.use(methodOverride());
    app.use(cors(corsOptions));
    app.use(passport.initialize());
    rollbar && app.use(new Rollbar(rollbar.accessToken).errorHandler());

    return app;
}
