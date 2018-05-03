/* global test, expect, jest, jasmine, */
const Repository = require('../lib/sequelize/repository');
const Instance = require('../lib/sequelize/instance');
const UserSchema = require('./src/userSequelizeSchema');
const RoleSchema = require('./src/roleSequelizeSchema');

const Sequelize = require('sequelize');

let sequelize = null;

test('Sequelize configuration', () => {
    const host = 'ec2-54-204-45-43.compute-1.amazonaws.com';
    const database = 'dbi1ijv2pstot1';
    const user = 'wdwyogzyooqycm';
    const port = 5432;
    const password = 'ce5878abe136f63d6c7114b926d4654d5d8e2ce515b45cfa271e2c1a4b8cf784';

    const config = {
        host: host,
        port: port,
        dialect: 'postgres',
        operatorsAliases: false,
        dialectOptions: {
            ssl: true
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    };

    sequelize = new Sequelize(database, user, password, config);
    expect(typeof sequelize).toBe('object');
});


jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

// class Roles extends Repository {}
//
// class Role extends Instance {
//     static getTitle () {
//         return this.title;
//     };
// }

class Users extends Repository {
    static getActives () {
        return this.find({'data.active': true}, '', 'name');
    }
}

class User extends Instance {
    constructor (obj) {
        super(obj, Users);
    }

    activate () {
        this.data.active = true;
    };

    getName () {
        return this.name;
    };
}

test('[Sequelize] Model setup', () => {
    // Roles.setup(sequelize, 'role', RoleSchema, Role);
    Users.setup( 'user', UserSchema, User);
    expect(true).toBe(true);
});

let user = null;
let role = null;

test('[Sequelize] User create', async () => {
    // role = await Roles.create({title: 'user'});
    const userObj = {
        name: ['José', 'João', 'Maria', 'Carolina', 'Ana', 'Karen', 'Paulo', 'Breno'][Math.floor(Math.random() * 6)],
        local: {
            email: 'user' + new Date().getTime() + '@email.com',
            password: (Math.random() * 100000).toFixed(0)
        },
        data: {
            age: Math.floor(Math.random() * 7) + 20,
            height: Number((Math.floor(Math.random() * 35) / 100).toFixed(2)) + 1.55,
            active: false,
            gender: ['male', 'female'][Math.floor(Math.random() * 2)]
        }

    };
    user  = new User(userObj);
    await user.save();
    // user = await Users.create(userObj);
    expect(user).not.toBe(null);
});

test('[Sequelize] User findByID', async () => {
    user = await Users.findById(user._id);
    expect(typeof user).toBe('object');
});

test('[Sequelize] User findOne', async () => {
    user = await Users.findOne({_id: user._id});
    expect(typeof user).toBe('object');
});

//
// test('[Sequelize] User findOne JSON', async () => {
//     const anotherUser = await Users.findOne({'local.email': user.local.email});
//     expect(anotherUser.id).toBe(user.id);
// });
//
// test('[Sequelize] User findOne fail', async () => {
//     const notUser = await Users.findOne({'local.email': user.local.email + 'x'});
//     expect(notUser).toBe(null);
// });

// test('[Sequelize] User findByID populated', async () => {
//     user = await Users.findById(user.id, 'role');
//     expect(user.role.getTitle()).toBe('user');
// });
//
// test('[Sequelize] User findOne populated', async () => {
//     user = await Users.findOne({id: user.id}, 'role');
//     expect(user.role.getTitle()).toBe('user');
// });

test('[Sequelize] User class method / find', async () => {
    const actives = await Users.getActives();
    expect(typeof actives).toBe('object');
});

test('[Sequelize] User instance method', async () => {
    expect(user.data.active).toBe(false);
    user.activate();
    expect(user.data.active).toBe(true);
    expect(user.getName()).toBe(user.name);
});
//
// test('[Sequelize] User update', async () => {
//     let newData = user.data;
//     newData.active = true;
//     const updated = await Users.update({id: user.id}, {data: newData});
//     expect(updated).toBe(true);
// });
//
// // test('[Sequelize] User delete', async () => {
// //     const deleted = await User.delete({id: user.id});
// //     expect(!!deleted).toBe(true);
// // });
