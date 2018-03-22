const {INTEGER, STRING, DATE} = require('sequelize');

const schema = {
    id: {type: INTEGER, primaryKey: true, autoIncrement: true},
    title: STRING,
    createdAt: {type: DATE, field: 'created_at'},
    updatedAt: {type: DATE, field: 'updated_at'}
};


module.exports = schema;