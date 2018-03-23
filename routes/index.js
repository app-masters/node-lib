const finaleRestful = require('../lib/finaleRestful')
const schemas = require('../resources/index');
const sequelize = require('../resources/schemas/sequelize');

module.exports = (app, configs) => {
    return finaleRestful.registerMultipleRoutes(app, schemas, sequelize, configs)
};
