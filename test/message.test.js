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
require('./src/notificationSchema');

const message = require('../lib').message;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

test('ApiBootstrap node-lib', () => {
    let result = apiBootstrap.setup(app, envs, packag, passport);
    apiBootstrap.listen(app);
    expect(result).toBe(true);
});

test('Create connection', async () => {
    let db = connectionData.createConnectionAndSchemas();
    expect(db).not.toBeNull();
});

test('Sending Message and saving it to the schema', async () => {
    // to, subject, fields, body
    // simulates the req, res, next objects
    let req = {
        body: {
            name: 'Igor',
            gender: 'Masculino',
            text: 'Aplicativo muito sólido\nFunciona muito bem REALMENTE!\nTô realmente satisfeito'
        },
        user: {_id: '5a5d358faf1a4c0014b75b97'},
        params: {messageKey: 'feedback'}
    };
    message.sendMessage(req, {send: () => console.log('sended')}, {});
    // console.log(response);
    // expect(response).not.toBeNull();
});
