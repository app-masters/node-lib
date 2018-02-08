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

test('Get new users', async () => {
    let period = xDaysAgo(1);
    let response = await stats.usersNew(period);
    // console.log(response, period);
    expect(response.usersNew).not.toBeNull();
    period = xDaysAgo(14);
    let response2 = await stats.usersNew(period);
    // console.log(response2, period);
    expect(response2.usersNew).not.toBeNull();
    expect(response2.usersNew).toBeGreaterThan(response.usersNew);
});

test('Get invites sent', async () => {
    let period = xDaysAgo(1);
    let response = await stats.invitesSent(period);
    // console.log(response, period);
    expect(response.invitesSent).not.toBeNull();
    expect(response.invitesAccepted).not.toBeNull();
    period = xDaysAgo(5);
    let response2 = await stats.invitesSent(period);
    // console.log(response2, period);
    expect(response2.invitesSent).not.toBeNull();
    expect(response2.invitesAccepted).not.toBeNull();
});

test('Get invites accepted', async () => {
    let period = xDaysAgo(1);
    let response = await stats.invitesAccepted(period);
    // console.log(response, period);
    expect(response.invitesAccepted).not.toBeNull();
    period = xDaysAgo(5);
    let response2 = await stats.invitesAccepted(period);
    // console.log(response2, period);
    expect(response2.invitesAccepted).not.toBeNull();
});

test('Get new progressions', async () => {
    let period = xDaysAgo(1);
    let response = await stats.progressionsNew(period);
    // console.log(response, period);
    expect(response.progressionsNew).not.toBeNull();
    period = xDaysAgo(14);
    let response2 = await stats.progressionsNew(period);
    // console.log(response2, period);
    expect(response2.progressionsNew).not.toBeNull();
    expect(response2.progressionsNew).toBeGreaterThan(response.progressionsNew);
});

test('Get users removed', async () => {
    let period = xDaysAgo(1);
    let response = await stats.usersRemoved(period);
    // console.log(response, period);
    expect(response.usersRemoved).not.toBeNull();
    period = xDaysAgo(14);
    let response2 = await stats.usersRemoved(period);
    // console.log(response2, period);
    expect(response2.usersRemoved).not.toBeNull();
    expect(response2.usersRemoved).toBeGreaterThan(response.usersRemoved);
});

test('Get users active', async () => {
    let period = xDaysAgo(1);
    let response = await stats.usersActive(period);
    // console.log(response, period);
    expect(response.usersActive).not.toBeNull();
    period = xDaysAgo(14);
    let response2 = await stats.usersActive(period);
    // console.log(response2, period);
    expect(response2.usersActive).not.toBeNull();
    expect(response2.usersActive).toBeGreaterThan(response.usersActive);
});

test('Get received messages', async () => {
    let period = xDaysAgo(1);
    let response = await stats.receveidMessages(period);
    // console.log(response, period);
    expect(response.receveidMessages).not.toBeNull();
    period = xDaysAgo(14);
    let response2 = await stats.receveidMessages(period);
    // console.log(response2, period);
    expect(response2.receveidMessages).not.toBeNull();
    expect(response2.receveidMessages).toBeGreaterThan(response.receveidMessages);
});
