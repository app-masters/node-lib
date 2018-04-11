/* global test, expect, jest, jasmine, */
const Sequelize = require('sequelize');

let sequelize = null;
let User = null;

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

test('Connection', async () => {
    try {
        const authentication = await sequelize.authenticate();
        expect(true).toBe(true);
    } catch (error) {
        expect(error.message).toBe(true);
    }
});

test('User Model', async () => {
    User = sequelize.define('user', {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        name: {
            type: Sequelize.STRING
        },
        age: {
            type: Sequelize.INTEGER
        },
        height: {
            type: Sequelize.REAL
        },
        active: {
            type: Sequelize.BOOLEAN
        },
        gender: {
            type: Sequelize.STRING
        },
        createdAt: {
            type: Sequelize.DATE,
            field: 'created_at'
        },
        updatedAt: {
            type: Sequelize.DATE,
            field: 'updated_at'
        }
    });
    expect(typeof User).toBe('function');
});

test('User Create', async () => {
    await User.sync({force: true}); // force: true - drop the table if already exists
    const userObj = {
        name: 'Baraky',
        age: 26,
        height: 1.90,
        active: true,
        gender: 'male'
    };
    const user = await User.create(userObj);
    console.log(user);
    console.log(user.getTableName());
    console.log(user.constructor);
    console.log(user.constructor.name);
    expect(typeof user).toBe('object');
});

test('User Query', async () => {
    const users = await User.findAll();
    expect(typeof users).toBe('object');
});