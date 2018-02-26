/* global test, expect, jest, jasmine, */

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
    const users =
        {
            _id: '5980d6e14a54b900113ff905',
            token: 'flHQT5RETSg:APA91bG3Go3LXcuV2V-ATLJFDLzeQ5z6mQA22JEuyRedWio1Jfj6VAXV7qbgoofu6TKZPWB86Li74PQT26Drth6pgwKKhtxr5-VQNui-iusvstcVHT7mtMv0arquyRWpNhAFWJAXUY_h'
        };
    let payload = {
        notification: {
            title: 'Olá',
            body: 'Bem vindo!'
        },
        data: {
            content: 'Only strings goes here',
            otherContent: 'Only string right?'
        }
    };
    notification.send(users, payload);
    // expect(result.successCount).toBe(1);
});

