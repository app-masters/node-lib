/* global test, expect, jest, jasmine, */
const express = require('express');
const axios = require('axios');

const host = 'ec2-54-204-45-43.compute-1.amazonaws.com';
const database = 'dbi1ijv2pstot1';
const user = 'wdwyogzyooqycm';
const port = 5432;
const password = 'ce5878abe136f63d6c7114b926d4654d5d8e2ce515b45cfa271e2c1a4b8cf784';
const url = `postgres://${user}:${password}@${host}:${port}/${database}`;

const envs = {
    development: {
        database: {
            url
        },
        security: {
            checkClientOnDev: false,
            secret: "6d717d8cd4fc71c6f3e8e2cc5b695eace7f372c1d8ae5ddb1bfcaacebf80f543",
        },
        server: {
            corsOptions: {
                origin: '*',
                methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
                preflightContinue: false,
                optionsSuccessStatus: 204,
                exposedHeaders: 'api-version, api-env, min-web-version, min-mobile-version, min-admin-version, user',
                allowedHeaders: 'content-type, Authorization, authorization, client, client-env, admin-version, mobile-version, web-version'
            },
            initialize: {
                base: '/api',
                updateMethod: 'PATCH'
            }
        },
        rollbar: {
            accessToken: 'bcf47e74943c4efa987c7eadaefc2a54'
        }
    },
};
;

const app = require('../dist/express')(envs['development']);

app.use('/not-protected', (req, res) => {
    throw new Error('Ugly error message');
});

app.use('/protected', (req, res) => {
    req.user = {
        id: 42,
        email: 'email@example.com',
        username: 'theuser'
    }
    throw new Error('Now it\'s personal!')
});

app.listen(8001, () => console.log('TEST API'))

const AMError = require('../dist/am-error');

global.config = envs['development'];
AMError.init(app);
AMError.listen(app);

test('Should get error on not-auth request', async () => {
    //Look for "Ugly error message" at rollbar items
    try {
        const res = await axios.get('http://localhost:8001/not-protected');
        expect(res).toBe(true)
    } catch (err) {
        expect(err.response.status).toBe(500);
    }
});

test('Should get an personal error', async () => {
    //Look for "Ugly error message" at rollbar items
    try {
        const res = await axios.get('http://localhost:8001/protected');
        expect(res).toBe(true)
    } catch (err) {
        expect(err.response.status).toBe(500);
    }
});
