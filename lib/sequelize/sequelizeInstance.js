const Sequelize = require('sequelize');
const {Op} = Sequelize;

class SequelizeInstance {

    /**
     * Try to connect
     */
    static async setup(url, options) {
        // Validate url
        if (!url)
            throw new Error("SequelizeInstance.setup must have a url");

        SequelizeInstance.options = options;

        SequelizeInstance.instance = new Sequelize(url, {
            dialect: 'postgres',
            dialectOptions: {
                ssl: true
            },
            operatorsAliases: Op,
            logging: options.logging || false,
        });

        Sequelize.Promise.onPossiblyUnhandledRejection(() => console.log('onPossiblyUnhandledRejection - Catched in local'));
        SequelizeInstance.instance.Promise.onPossiblyUnhandledRejection(() => console.log('onPossiblyUnhandledRejection - Catched in local'));

        try{
            const auth = await SequelizeInstance.instance.authenticate();
            SequelizeInstance.connected = true;
            return SequelizeInstance.instance;
        } catch(e){
            console.error(e.message);
            SequelizeInstance.connected = false;
            return false;

        }
        // console.log("auth",auth);

        // .then(() => {
        //     console.log('Connection has been established successfully.');
        //     SequelizeInstance.connected = true;
        // })
        //     .catch(err => {
        //         console.error('Unable to connect to the database:', err);
        //         SequelizeInstance.connected = false;
        //     });

        // Not working. Must work.

        return SequelizeInstance.instance;
    }

    static getInstance() {
        if (!SequelizeInstance.instance)
            throw new Error("SequelizeInstance.setup never called");

        return SequelizeInstance.instance;
    }

    static isConnected() {
        return SequelizeInstance.connected === true;
    }
}

SequelizeInstance.instance = null;
SequelizeInstance.options = {};
SequelizeInstance.connected = false;

module.exports = SequelizeInstance;
