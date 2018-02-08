/* global test, expect, jest, jasmine, */

const express = require('express');
const passport = require('passport');
var app = express();
const moment = require('moment');
const MockReq = require('mock-req');
const mockRes = require('jest-mock-express').response;

const amAuth = require('../lib/am-auth');
const packag = require('../package');
const envs = require('./src/testConfig');
const apiBootstrap = require('../lib/apiBootstrap');
const connectionData = require('./src/connectionData');

require('./src/userSchema');
require('./src/inviteSchema');
require('./src/messageSchema');
require('./src/progressionSchema');

const stats = require('../lib').stats;

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

test('Certify last atributes', async () => {
    const user = {
        lastAccessDate: '2018-02-08T18:58:25.403Z',
        lastClient: 'admin',
        initialClientVersion: '2.0',
        initialClient: 'admin',
        lastClientVersion: '0.1.0',
        _id: '59d244902ea3190012a8ac87',
        updated_at: '2017-10-18T11:32:08.681Z',
        created_at: '2017-10-02T13:52:16.482Z',
        data: {
            level: '5983228639a8650011438c54',
            initialWeight: 125,
            physicalActivity: 'sedentary',
            alreadyOnLowCarb: false,
            age: 25,
            phone: '32984325051',
            gender: 'Male',
            waist: 0,
            desiredWeight: 90,
            weight: 200,
            favoriteRecipes: [],
            points: 70,
            healthProblem: [ '59831ee939a8650011438c4c', '59831ef939a8650011438c4e' ]
        },
        __v: 0,
        name: 'João Baraky',
        deleted: false,
        notification:{ 
            ios: { token: [] },
            web: { token: [] },
            android: { token: [] }
        },
        role: 'user',
        local: {
            password: '$2a$08$Jw6Z9ZZr5PEz8mesNqH7Ne7wIpC7vKX3DLFiDKM6uboqNb.8CJY.y',
            email: 'baraky@appmasters.io'
        },
        id: '59d244902ea3190012a8ac87'  
    };
    const token = '';
    const mockup = {
        req: new MockReq({
            method: 'POST',
            url: '/api/login',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'client': 'admin',
                'client-version': '0.1.0',
                'Authorization': token
            },
            user
        }),
        res: mockRes(),
        next: () => {console.log('next')}
    };
    console.log(mockup.req.headers);
    // mobile-version, admin-version, web-version
    // await amAuth.requireAuth(mockup.req, mockup.res, mockup.next);  
    amAuth.certifyLastAtributes(mockup.req.user, mockup.req.headers);  
});

test('User active test', async () => {
    let payload = {
        _id: '59d244902ea3190012a8ac87'
    }
    await amAuth._jwtStrategy(payload, (err, user) => {
        console.log(err, user);
        expect(user.lasAcessDate).not.toBeNull();    
    });
});
