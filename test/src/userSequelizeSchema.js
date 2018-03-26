const {INTEGER, STRING, REAL, BOOLEAN, DATE} = require('sequelize');
const JSONSchema =  require ('../../lib/sequelizeJSON');

const schema = {
    id: {type: INTEGER, primaryKey: true, autoIncrement: true},
    local: JSONSchema({
       email: STRING,
       password: STRING
    }),
    roleId: {type: INTEGER, defaultValue: 1},
    name: STRING,
    data: JSONSchema({
        height: {type: REAL},
        active: {type: BOOLEAN},
        gender: {type: STRING},
        age: {type: INTEGER}
    }),
    createdAt: {type: DATE, field: 'created_at'},
    updatedAt: {type: DATE, field: 'updated_at'}
};

module.exports = schema;