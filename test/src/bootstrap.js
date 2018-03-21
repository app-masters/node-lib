const Sequelize = require('sequelize');

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

const sequelize = new Sequelize(database, user, password, config);
module.exports = sequelize;