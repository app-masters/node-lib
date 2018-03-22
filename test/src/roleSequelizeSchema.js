const {INTEGER, STRING, DATE} = require('sequelize');
const sequelize = require('./bootstrap');

const schema = {
    id: {type: INTEGER, primaryKey: true, autoIncrement: true},
    title: STRING,
    createdAt: {type: DATE, field: 'created_at'},
    updatedAt: {type: DATE, field: 'updated_at'}
};

const model = sequelize.define('role', schema);
model.sync({force: false}); // force: true - drop the table if already exists

module.exports = model;