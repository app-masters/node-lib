/* global test, expect, jest, jasmine, */

var express = require('express');
const passport = require('passport');
const packag = require('../package');
var envs = require('./src/testConfig');
var app = express();
const apiBootstrap = require('../lib/apiBootstrap');
require('./src/userSchema');
require('./src/inviteSchema');

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

let notificationConfig = {
    serviceAccount: ''
};

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
    const notifiction = require('../lib/notification');

    // Setup
    const serviceAccount = require('./src/serviceAccountKey.json');
    let config = {serviceAccount};
    let result = notifiction.setup(config);
    expect(result).toBe(true);

    let body = {
        title: "Teste",
        body: "Teste de notificação",
        data: {
            content: "Anything goes here"
        }
    };
    result = await notifiction.send("fmPw7Ekytgo:APA91bGIQKnwNR8Or7IjDJ9E4_fzFi3Uqi4qDOUCYOe19NPcWHzWgZDWa8oBZzDKB_nKBow1GMG6MVSsm8TedUU-5v6UT2kOB1Wr2d7v9M2LimfOtuibKMfZ9CrMSjRoR8raPQh6OKfG",body);
    expect(result.successCount).toBe(1);
});


