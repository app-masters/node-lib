const Sequelize = require('sequelize');
const {Op} = Sequelize;

class SequelizeInstance{

    static setup(url, options){
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

        // Not working. Must work.
        Sequelize.Promise.onPossiblyUnhandledRejection(() => console.log('onPossiblyUnhandledRejection - Catched in local'));
        SequelizeInstance.instance.Promise.onPossiblyUnhandledRejection(() => console.log('onPossiblyUnhandledRejection - Catched in local'));

        return SequelizeInstance.instance;
    }

    static getInstance(){
        if (!SequelizeInstance.instance)
            throw new Error("SequelizeInstance.setup never called");

        return SequelizeInstance.instance;
    }
}
SequelizeInstance.instance = null;
SequelizeInstance.options = {};

module.exports = SequelizeInstance;
