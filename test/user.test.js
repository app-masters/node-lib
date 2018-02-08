/* global test, expect, jest, jasmine, */

var express = require('express');
const amAuth = require('../lib/am-auth');
const passport = require('passport');
const packag = require('../package');
var envs = require('./src/testConfig');
var app = express();
const moment = require('moment');

const apiBootstrap = require('../lib/apiBootstrap');
const connectionData = require('./src/connectionData');
require('./src/userSchema');
require('./src/inviteSchema');
require('./src/messageSchema');
require('./src/progressionSchema');

const stats = require('../lib').stats;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

const oneMonthPeriod = (date) => {
    let initDate = moment(date, 'YYYY/MM/DD').startOf('month').format('YYYY-MM-DD');
    let endDate = moment(date, 'YYYY/MM/DD').endOf('month').format('YYYY-MM-DD');
    return {
        initDate,
        endDate
    };
}
const xDaysAgo = (x) => {
    let now = new Date(Date.now());
    return {
        startDate: new Date(moment(now, 'YYYY-MM-DD').utc().startOf('day').subtract(x, 'days')),
        endDate: new Date(moment(now, 'YYYY-MM-DD').utc().endOf('day'))
    };
}

test('ApiBootstrap node-lib', () => {
    let result = apiBootstrap.setup(app, envs, packag, passport);
    apiBootstrap.listen(app);
    expect(result).toBe(true);
});

test('Create connection', async () => {
    let db = connectionData.createConnectionAndSchemas();
    expect(db).not.toBeNull();
});

test('User active test', async () => {
    let payload = {
        _id: '5a5d358faf1a4c0014b75b97'
    }
    await amAuth._jwtStrategy(payload, (err, user) => {
        console.log(err, user);
        expect(user.lasAcessDate).not.toBeNull();    
    });
});
