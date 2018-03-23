// Requires for bootstrap
const express = require('express');
const app = express();
const envs = require('./config');
const packag = require('./package.json');
const passport = require('passport');
// const userSchema = require('./app/model/userSchema');
//require('./app/model/notificationSchema');

const apiBootstrap = require('./lib').apiBootstrapS;

// 1 - Api Bootstrap tests
apiBootstrap.setup(app, envs, packag, passport);

// 2 - Include Routes
const newApp = require('./routes')(app, envs[process.env.NODE_ENV]);

// 3 - Listen API
apiBootstrap.listen(Object.assign(app,newApp));
