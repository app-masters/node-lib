let envs = require('./testConfig');

// Sequelize database config
const config = {
    driver: 'sequelize',
    host: 'tiago-ec2-54-204-45-43.compute-1.amazonaws.com',
    port: 5432,
    database: 'tiago-dbi1ijv2pstot1',
    user: 'tiago-wdwyogzyooqycm',
    password: 'tiago-ce5878abe136f63d6c7114b926d4654d5d8e2ce515b45cfa271e2c1a4b8cf784',
    dialect: 'postgres',
    operatorsAliases: false,
    logging: true,
    dialectOptions: {
        ssl: true
    }
};

// Force to Sequelize
envs.test.database = config;
envs.development.database = envs.test.database;
// Clear some atributes
const databaseSequelizeClear = JSON.parse(JSON.stringify(config));
databaseSequelizeClear.host = null;
databaseSequelizeClear.port = null;
databaseSequelizeClear.database = null;
databaseSequelizeClear.user = null;
databaseSequelizeClear.password = null;
envs.production.database = databaseSequelizeClear;
envs.staging.database = databaseSequelizeClear;

// const sequelize = new Sequelize(database, user, password, config);
module.exports = envs;