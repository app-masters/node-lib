const SequelizeInstance = require('./sequelizeInstance');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

class Session {
    static setup(config: Object): boolean {
        console.log(" S E S S I O N > setup");
        let sequelize = SequelizeInstance.getInstance();
        // console.log("instance",instance);
        let store = new SequelizeStore({
            db: sequelize,
            table: 'session',
            extendDefaultFields: extendDefaultFields
        });
        if (!store.sessionModel){
            throw new Error("Session cannot find the session table");
        }
        // store.sync();

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