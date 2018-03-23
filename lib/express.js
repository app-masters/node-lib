const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');



module.exports = (envConfigs) => {
    const {corsOptions} = envConfigs;

    const app = express();
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cookieParser());
    app.use(methodOverride());
    app.use(passport.initialize());
    app.use(cors(corsOptions));

    return app;
}
