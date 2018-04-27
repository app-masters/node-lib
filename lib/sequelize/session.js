const SequelizeInstance = require('./sequelizeInstance');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

class Session {
    static setup(app, config: Object): boolean {
        console.log(" S E S S I O N > setup");
        let sequelize = SequelizeInstance.getInstance();

        // Define session table
        const {TEXT, STRING, DATE} = require('sequelize');
        const schema = {
            sid: {
                type: STRING(32),
                primaryKey: true
            },
            expires:DATE,
            data: TEXT
        };
        sequelize.define('session',schema);

        // console.log("instance",instance);
        let store = new SequelizeStore({
            db: sequelize,
            table: 'session',
            extendDefaultFields: extendDefaultFields
        });

        if (!store.sessionModel){
            throw new Error("Session cannot find the session table");
        }

        store.sync();

        // app.set('trust proxy', 1); // trust first proxy
        app.use(session({
            secret: global.config.security.secret,
            resave: false,
            store: store,
            saveUninitialized: true,
            cookie: {secure: 'auto'}
        }));
    }
}

const extendDefaultFields = (defaults, session) => {
    return {
        data: defaults.data,
        expires: defaults.expires,
        userId: session.userId
    };
};

module.exports = Session;