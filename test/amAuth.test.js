/* global test, expect, jest, jasmine, */

const express = require('express');
const passport = require('passport');
const packag = require('../package');
const envs = require('./src/testConfig');
const mongoose = require('mongoose');
const app = express();
const apiBootstrap = require('../lib/apiBootstrap');
const AMAuth = require('../lib/am-auth');

require('./src/userSchema');
require('./src/inviteSchema');
const mockRes = require('jest-mock-express').response;

const connectionData = require('./src/connectionData');

let user = null;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

test('ApiBootstrap node-lib', () => {
    let result = apiBootstrap.setup(app, envs, packag, passport);
    apiBootstrap.listen(app);
    expect(result).toBe(true);
});

test('Create connection and one user', async () => {
    let db = connectionData.createSchemas(mongoose);
    await mongoose.model('user').find({}).remove();
    await mongoose.model('invite').find({}).remove();
    user = await connectionData.createUserRecords(1);
    expect(user).not.toBeNull();
});

test('singleLoginSignup - login', async () => {
    const res = mockRes();
    // res.status(200).send();
    const done= (a,b,c) => {console.log("DONE > ",a,b,c)};
    const req = {body: {email: user.local.email, password: user.local.email}};
    AMAuth.localLogin(req, res, done);
    // expect(res.status).toHaveBeenCalledWith(200);
    // expect(res.send).toHaveBeenCalled();

    // AMAuth.(req, user.local.email, user.local.email, done);
});