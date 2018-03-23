const {UsersSchema} = require('./schemas');
const {UsersMiddleware} = require('./middlewares');

module.exports = {
    Users: {
        schema: UsersSchema,
        restMiddleware: UsersMiddleware,
    }
};
