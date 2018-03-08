/* global test, expect, jest, jasmine, */
const restful = require('node-restful');
const mongoose = restful.mongoose;
var express = require('express');
const passport = require('passport');
const packag = require('../package');
var envs = require('./src/testConfig');
var app = express();
const apiBootstrap = require('../lib/apiBootstrap');
require('./src/userSchema');
require('./src/inviteSchema');
require('./src/notificationSchema');
require('./src/messageSchema');

const notification = require('../lib/notification');


const connectionData = require('./src/connectionData');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

test('ApiBootstrap node-lib', () => {
    let result = apiBootstrap.setup(app, envs, packag, passport);
    apiBootstrap.listen(app);
    expect(result).toBe(true);
});

test('Create connection', async () => {
    let db = connectionData.createConnectionAndSchemas();
    expect(db).not.toBeNull();
});

test('Send notification', async () => {
    const userModel = mongoose.model('user');
    let user = null;
    await userModel.findOne({_id: '5a7ae1a0f9305b00145344f1'}).then((response) => user = response).catch(error => console.error(error));
    let payload = {
        notification: {
            title: 'My test - title',
            body: 'Body'
        }
    };
    notification.send(user, payload);
    // expect(result.successCount).toBe(1);
});

test('Add user token', async () => {
    const userModel = mongoose.model('user');
    let user = null;
    await userModel.findOne({_id: '5a7ae1a0f9305b00145344f1'}).then((response) => user = response).catch(error => console.error(error));
    // type: web, android, ios
    // value: token
    // vem no body
    // notification/token
    const req = {
        body: {
            type: 'web',
            value: 'fU3ajq_fFUo:APA91bGAFP9TIEddiRszvOreyGkkG5pzEiTKPnl8ctL9uQji05nJjywdM5Ugyt3D_amSPizA6_a8YzhTB4Cd_a5UdcTLpWNhkcl0SS3t84IJVXNXG60t4rTXbQEtg5WA3rFdhStytO7rsss\n'
        },
        user,
        params: {}
    };
    notification.addUserToken(req, {send: (response) => console.log(response)}, (error) => console.error(error));
});
