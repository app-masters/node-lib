const Sequelize = require('sequelize');
const sequelize = require('./sequelize');

module.exports = sequelize.define('users',{
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
    },
    roleId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'roles',
            key: 'id'
        }
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
