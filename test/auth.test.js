/* global test, expect, jest, jasmine, */

const passport = require('passport');
const mockRes = require('jest-mock-express').response;
const ModelSequelize = require('../lib/sequelize/modelSequelize');
const UserSchema = require('./src/userSequelizeSchema');
const Auth = require('../lib/sequelize/auth');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

class User extends ModelSequelize {}

const config = {
    database: {
        drive: 'sequelize'

    },
    security: {
        disabledOnDev: false,
        secret: 'someSecret',
        denyAccess: {
            admin: ['user'],
            mobile: []
        },
        singleLoginSignup: true
    }
};

test('[Sequelize] Model setup', () => {
    User.setup('user', UserSchema);
    expect(true).toBe(true);
});

test('Auth setup sequelize', () => {
    passport.initialize();
    let result = Auth.setup(passport, config, User);
    expect(result).not.toBe(null);
});

const user = {email: 'user' + new Date().getTime() + '@email.com', password: '123123'};

const req = {headers: {client: 'admin'}, body: user};

test('Auth Sign up', async (done) => {
    const res = {
        send: (data) => {
            console.log('SIGN-RES');
            expect(data).not.toBe(null);
            expect(data.token).not.toBe(null);
            expect(data.token).not.toBe(undefined);
            expect(data.user._id).not.toBe(null);
            expect(data.user._id).not.toBe(undefined);
            expect(data.user.email).not.toBe(null);
            expect(data.user.email).not.toBe(undefined);
            console.log(data);
            done();
        }
    };
    const next = (data) => {
        console.log('ERROR', data);
        expect(false).toBe(true);
        done();
    };
    Auth.localSignup(req, res, next);
});

test('Auth Login', async (done) => {
    let res = mockRes();
    res.send = (data) => {
        console.log('LOGIN-RES');
        expect(data).not.toBe(null);
        expect(data.token).not.toBe(null);
        expect(data.token).not.toBe(undefined);
        expect(data.user._id).not.toBe(null);
        expect(data.user._id).not.toBe(undefined);
        expect(data.user.email).not.toBe(null);
        expect(data.user.email).not.toBe(undefined);
        done();
    };
    res.writeHead = (data) => { };
    res.end = (data) => {
        console.log('ERROR', data);
        expect(false).toBe(true);
        done();
    };
    req.login = (user, callback) => {
        if (user) {
            callback();
        }
    };
    const next = (data) => {
        console.log('ERROR', data);
        expect(false).toBe(true);
        done();
    };
    Auth.localLogin(req, res, next);
});