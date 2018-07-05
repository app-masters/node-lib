const SequelizeInstance = require('./sequelizeInstance');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

class Session {
    static setup(app, config: Object): boolean {
        let sequelize = SequelizeInstance.getInstance();

        // Define session table
        const {TEXT, STRING, DATE} = require('sequelize');
        const schema = {
            sid: {
                type: STRING(32),
                primaryKey: true
            },
            expires: DATE,
            data: TEXT
        };
        sequelize.define('session', schema);

        // console.log("instance",instance);
        let store = new SequelizeStore({
            db: sequelize,
            table: 'session',
            disableTouch: true,
            extendDefaultFields: extendDefaultFields,
            checkExpirationInterval: 30 * 60 * 1000, //30 minutes
            expiration: 21 * 24 * 60 * 60 * 1000 //21 days
        });

        if (!store.sessionModel) {
            throw new Error("Session cannot find the session table");
        }

        store.sync();

        // app.set('trust proxy', 1); // trust first proxy
        app.use(session({
            secret: global.config.security.secret,
            resave: false,
            store: store,
            saveUninitialized: false,
            cookie: {secure: 'auto'}
        }));

        // Enable user to save session and await for it, using:
        // await req.saveSession()
        const saveSession = (req, res, next) => {
            return new Promise((resolve, reject) => {
                try {
                    req.session.save(() => {
                        resolve();
                    })
                } catch (e) {
                    reject(e);
                }
            });
        };
        app.use(saveSession);

        //
        // req.session.felipe = true;
        // req.session.touch();
        //
        // sessionSet("felipe", true);

        return true;
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