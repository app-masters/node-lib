/* global test, expect, jest, jasmine, */


const express = require('express');
const passport = require('passport');
const packag = require('../package');
const envs = require('./src/testConfig');
const app = express();
const moment = require('moment');

const apiBootstrap = require('../lib/apiBootstrap');
const connectionData = require('./src/connectionData');
const ModelMongoose = require('../lib/modelMongoose');
const UserSchema = require('./src/userMongooseSchema');
const RoleSchema = require('./src/roleMongooseSchema');

require('./src/userSchema');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;



class Role extends ModelMongoose {}

class RoleInstance {
    static getTitle () {
        return this.title;
    };
}

class User extends ModelMongoose {
    static getActives () {
        return this.find({active: true}, 'role', 'name');
    }
}

class UserInstance {
    static activate () {
        this.active = true;
    };

    static getName () {
        return this.name;
    };
}

test('ApiBootstrap node-lib', () => {
    let result = apiBootstrap.setup(app, envs, packag, passport);
    apiBootstrap.listen(app);
    expect(result).toBe(true);
});

test('Create connection', async () => {
    let db = connectionData.createConnectionAndSchemas();
    expect(db).not.toBeNull();
});


test('[Mongoose] Model setup', () => {
    User.setup('user', UserSchema, UserInstance);
    Role.setup('role', RoleSchema, RoleInstance);
    expect(true).toBe(true);
});

let user = null;
let role = null;
test('[Mongoose] User create', async () => {
    role = await Role.create({title: 'user'});
    const userObj = {
        name: ['José', 'João', 'Maria', 'Carolina', 'Ana', 'Karen', 'Paulo', 'Breno'][Math.floor(Math.random() * 6)],
        role: role._id,
        age: Math.floor(Math.random() * 7) + 20,
        height: Number((Math.floor(Math.random() * 35) / 100).toFixed(2)) + 1.55,
        active: false,
        gender: ['male', 'female'][Math.floor(Math.random() * 2)]
    };
    user = await User.create(userObj);
    expect(user).not.toBe(null);
    expect(typeof user).toBe('object');
});

test('[Mongoose] User findByID', async () => {
    user = await User.findById(user.id);
    expect(user).not.toBe(null);
    expect(typeof user).toBe('object');
});

test('[Mongoose] User findOne', async () => {
    user = await User.findOne({'_id': user.id});
    expect(user).not.toBe(null);
    expect(typeof user).toBe('object');
});

test('[Mongoose] User findByID populated', async () => {
    console.log(user);
    user = await User.findById(user._id, 'role');
    console.log(user);
    expect(user.role.title).toBe('user');
});

test('[Mongoose] User findOne populated', async () => {
    user = await User.findOne({'_id': user._id}, 'role');
    expect(user.role.title).toBe('user');
});

test('[Mongoose] User class method / find', async () => {
    const actives = await User.getActives();
    expect(typeof actives).toBe('object');
});

test('[Mongoose] User instance method', async () => {
    expect(user.active).toBe(false);
    user.activate();
    expect(user.active).toBe(true);
    expect(user.getName()).toBe(user.name);
});

test('[Mongoose] User update', async () => {
    const updated = await User.update({'_id': user._id}, {active: true});
    expect(updated).toBe(true);
});

test('[Mongoose] User delete', async () => {
    const deleted = await User.delete({'_id': user._id});
    expect(!!deleted).toBe(true);
});