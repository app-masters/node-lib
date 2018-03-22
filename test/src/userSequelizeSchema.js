const {INTEGER, STRING, REAL, BOOLEAN, DATE} = require('sequelize');


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


module.exports = schema;