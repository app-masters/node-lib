const express = require('express');
const passport = require('passport');
const app = express();
const envs = require('./src/databaseSequelizeConfig');
const packag = require('../package');
const apiBootstrap = require('../lib/apiBootstrap');


// Workaround
const path = require('path');
require(path.join(__dirname,'../node_modules/sequelize/lib/dialects/postgres/'));

test('ApiBootstrap sequelize', () => {
    let resultSetup = apiBootstrap.setup(app, envs, packag, passport);
    // 3 - Listen API
    // let resultListem = apiBootstrap.listen(app);
    expect(resultSetup).toBe(true);
    // expect(resultListem).toBe(true);
});