/* global test, expect, jest, jasmine, */

var express = require('express');
const passport = require('passport');
const packag = require('../package');
var envs = require('./src/testConfig');
var app = express();
const apiBootstrap = require('../lib/apiBootstrap');
const AMInvite = require('../lib/am-invite');
const AMAuth = require('../lib/am-auth');
require('./src/userSchema');
require('./src/inviteSchema');

const connectionData = require('./src/connectionData');

// Test data
let emailToInvite = 'jfbaraky@gmail.com';
let phoneToInvite = '32984325051';
let emailToInviteAndSignup = "baraky.appmasters@gmail.com";
let personsToInvite = [
    {email: 'email@email.com', phone: '99837495'},
    {email: emailToInviteAndSignup, phone: '99833743'}
];

let invite = null;
let invites = null;
let user = null;
let newUser = null;
let newUsers = null;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

test('ApiBootstrap node-lib', () => {
    let result = apiBootstrap.setup(app, envs, packag, passport);
    apiBootstrap.listen(app);
    expect(result).toBe(true);
});

test('Create connection and one user', async () => {
    let db = connectionData.createConnectionAndSchemas();
    await db.connection.model('user').find({}).remove();
    await db.connection.model('invite').find({}).remove();
    user = await connectionData.createUserRecords(1);
    expect(user).not.toBeNull();
});


test('Create user invite link', async () => {
    let inviteUrl = await AMInvite.getUserLink(user);
    console.log("inviteUrl",inviteUrl);
    expect(inviteUrl).not.toBeNull();
});

// Callback when someone accept a invite?

test('Invite one person', async () => {
    // console.log("user", user);
    invite = await AMInvite.addInvite(user, emailToInvite, phoneToInvite);
    // console.log("--invite--", invite);
    // console.log("--invite--", invite);
    expect(invite.user._id).toBe(user._id);
    expect(invite.email).toBe(emailToInvite);
});

test('Accept same invite by two users', async () => {
    newUser = await connectionData.createUserRecords(1);
    invite = await AMInvite.accept(invite, newUser);
    // console.log(invite);
    expect(invite.accepted).toBe(true);
    let anotherUser = await connectionData.createUserRecords(1);
    let anotherInvite = await AMInvite.accept(invite, anotherUser);
    // console.log("invite",invite);
    // console.log("anotherInvite",anotherInvite);
    expect(anotherInvite.accepted).toBe(true);
    expect(anotherInvite._id).not.toEqual(invite._id);
});

test('Invite multiple person', async () => {
    invites = await AMInvite.addInvites(user, personsToInvite);
    expect(invites.length).toBe(2);
});

test('Accept invite (user signup) with callback', async (done) => {
    AMInvite.setAcceptCallback((invite=>{
        console.log('___________________________________');
        console.log(invite);
        console.log('___________________________________');
        expect(invite.accepted).toBe(true);
        done();
    }));

    AMAuth.signup(emailToInviteAndSignup,"pass",(err, user)=>{
        expect(user).not.toBe(false);
        // console.log("err",err);
        // console.log("signup user",user);
        expect(user.local.email).toBe(emailToInviteAndSignup);
    });
    //
    // newUsers = await connectionData.createUserRecords(2);
    // for (let user of newUsers){
    //     let userInvite = invites.shift();
    //     // console.log("userInvite",userInvite);
    //     userInvite = await AMInvite.accept(userInvite, user);
    //     // console.log("userInvite accepted",userInvite);
    //     expect(userInvite.accepted).toBe(true);
    // }
});

//
// test('Invite many persons', () => {
//     expect(false).toBe(true);
// });

