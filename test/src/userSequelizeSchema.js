const {INTEGER, STRING, REAL, BOOLEAN, DATE} = require('sequelize');
const sequelize = require('./bootstrap');

const schema = {
    id: {type: INTEGER, primaryKey: true, autoIncrement: true},
    roleId: {type: INTEGER, defaultValue: 1},
    name: STRING,
    age: {type: INTEGER},
    height: {type: REAL},
    active: {type: BOOLEAN, defaultValue: false},
    gender: {type: STRING},
    createdAt: {type: DATE, field: 'created_at'},
    updatedAt: {type: DATE, field: 'updated_at'}
};

const model = sequelize.define('user', schema);
model.sync({force: false}); // force: true - drop the table if already exists

module.exports = model;