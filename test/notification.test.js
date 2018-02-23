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
const notification = require('../lib/notification');


const connectionData = require('./src/connectionData');
//
// // Test data
// let emailToInvite = 'tiago@tiagogouvea.com.br';
// let phoneToInvite = '32988735683';
// let emailToInviteAndSignup = "tiago@appmasters.io";
// let personsToInvite = [
//     {email: 'email@email.com', phone: '99837495'},
//     {email: emailToInviteAndSignup, phone: '99833743'}
// ];
//
// let invite = null;
// let invites = null;
// let user = null;
// let newUser = null;
// let newUsers = null;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

// test('ApiBootstrap node-lib', () => {
//     let result = apiBootstrap.setup(app, envs, packag, passport);
//     apiBootstrap.listen(app);
//     expect(result).toBe(true);
// });
//
// test('Create connection and one user', async () => {
//     let db = connectionData.createConnectionAndSchemas();
//     await db.connection.model('user').find({}).remove();
//     user = await connectionData.createUserRecords(1);
//     expect(user).not.toBeNull();
// });

test('Send notification', async () => {
    const credential = require('./src/serviceAccountKey');
    let config = {credential, databaseURL: 'https://good-burger.firebaseio.com'};
    let result = notification.setup(config);
    expect(result).toBe(true);
    const users = {
        token: 'flHQT5RETSg:APA91bG3Go3LXcuV2V-ATLJFDLzeQ5z6mQA22JEuyRedWio1Jfj6VAXV7qbgoofu6TKZPWB86Li74PQT26Drth6pgwKKhtxr5-VQNui-iusvstcVHT7mtMv0arquyRWpNhAFWJAXUY_h'
    };
    let payload = {
        notification: {
            title: 'Teste',
            body: 'Teste de notificação'
        },
        data: {
            content: 'Only strings goes here',
            otherContent: 'Only string right?'
        }
    };
    notification.send(users, payload);
    // expect(result.successCount).toBe(1);
});


