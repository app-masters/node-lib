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
    const users = {
        _id: '59cf9ca299fa324ffff06c13',
        notification: {
            ios: {
                token: []
            },
            web: {
                token: [
                    "doetStMdwvA:APA91bHf7wGssOwfkLi6FyNEnlXqEK1MXmM3f5rFMEUceUlWg7D9nb9M-XSJaGExhcDd59EmnE13KKoLGl74JIeW0-zTfAvnvZzKoSAwsybuxwCW4HZS8QsDeRTfuJPcY0nnYPgLeFHw",
                    "dJsfffhz4-U:APA91bGgfmUT2FFksmKJE98D0TxgTa1HRS29p-Sl8I14PI6iAWAoOeDmy-OI4EwXiNHxUdEJTrWfyufwK968ReF6zeF7JMky23d7Si8S4F4mQ6WjnjhfwFYQuVEF5rRJH65fz6PS3nyk"
                ]
            },
            android: {
                token: []
            }
        }
    };
    let payload = {
        notification: {
            title: '183.58333333333334 alocado na issue',
            body: 'Você ultrapassou o limite da issue!'
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
