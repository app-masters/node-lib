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

// test('Send notification', async () => {
//     const users = {
//         _id: '5980d6e14a54b900113ff905',
//         notification: {
//             web: {
//                  token: ['flHQT5RETSg:APA91bG3Go3LXcuV2V-ATLJFDLzeQ5z6mQA22JEuyRedWio1Jfj6VAXV7qbgoofu6TKZPWB86Li74PQT26Drth6pgwKKhtxr5-VQNui-iusvstcVHT7mtMv0arquyRWpNhAFWJAXUY_h']
//             }
//          }
//     };
//     let payload = {
//         notification: {
//             title: 'Olá',
//             body: 'Bem vindo!'
//         },
//         data: {
//             content: 'Only strings goes here',
//             otherContent: 'Only string right?'
//         }
//     };
//     notification.send(users, payload);
//     // expect(result.successCount).toBe(1);
// });

test('Add user token', async () => {
    // type: web, android, ios
    // value: token
    // vem no body
    // notification/token
    const req = {
        body: {
            type: 'web',
            value: 'fU3ajq_fFUo:APA91bGAFP9TIEddiRszvOreyGkkG5pzEiTKPnl8ctL9uQji05nJjywdM5Ugyt3D_amSPizA6_a8YzhTB4Cd_a5UdcTLpWNhkcl0SS3t84IJVXNXG60t4rTXbQEtg5WA3rFdhStytO7rsss\n'
        },
        // id do usuário 'baraky@appmasters.io'
        user: {
            _id: '59cf9ccd99fa324ffff06c14',
            notification: {
                android: { token: [] },
                web: {
                    token: [ 'fU3ajq_fFUo:APA91bGAFP9TIEddiRszvOreyGkkG5pzEiTKPnl8ctL9uQji05nJjywdM5Ugyt3D_amSPizA6_a8YzhTB4Cd_a5UdcTLpWNhkcl0SS3t84IJVXNXG60t4rTXbQEtg5WA3rFdhStytO7r\n' ]
                },
                ios: { token: [] } }
        },
        params: {}
    };
    notification.addUserToken(req, {send: () => console.log('sended')}, (error) => console.error(error));
});

