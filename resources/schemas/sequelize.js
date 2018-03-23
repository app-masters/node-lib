const Sequelize = require('sequelize');
const {Op} = Sequelize;
const {url} = require('../../config/index')[process.env.NODE_ENV || 'development'].database;

module.exports = new Sequelize(url, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: true
    },
    operatorsAliases: Op,
    logging: false,
});
