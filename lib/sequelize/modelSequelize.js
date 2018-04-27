const Model = require('./model');
const SequelizeInstance = require('./sequelizeInstance');

class ModelSequelize extends Model {
    setup(modelName, schema, itemInstance, modelOptions) {
        if (typeof modelName !== 'string') {
            console.warn("ModelSequelize.setup doesn't need sequelize as first param anymore");
            throw new Error("ModelSequelize.setup parans changed to > setup(modelName, schema, itemInstance, modelOptions)");
        }

        const sequelize = SequelizeInstance.getInstance();
        if (!sequelize) {
            throw new Error('You must pass a sequelize instance on setup()');
        }
        if (!modelName) {
            throw new Error('You must setup a valid model on setup()');
        }
        if (!schema._id)
            console.warn("Schema without _id attribute: " + modelName + ". It's a error?");

        if (!modelOptions) modelOptions = {};
        // modelOptions.underscored = true;

        const forceSync = SequelizeInstance.options.forceSync || modelOptions.forceSync;
        if (forceSync){
            console.warn("Model forcing database to sync schema '"+modelName+"'");
        }

        let model = sequelize.define(modelName, schema, modelOptions);
        model.sync(
            {
                force: forceSync, // force: true - drop the table if already exists
                logging: SequelizeInstance.options.syncLogging ? console.log : false}
            );

        if (!model) {
            throw new Error('Cannot define a model to provided schema on setup()');
        }

        this.model = model;
        this.itemInstance = itemInstance;
    }

    getModel() {
        return this.model;
    }

    getItemInstance() {
        return this.itemInstance;
    }

    returnItemInstance(item) {
        if (!this.itemInstance || !item) {
            return item;
        } else {
            // Merge API results with Instance Class
            return new this.itemInstance(item.get({plain: true}));
        }
    }

    async create(obj) {
        return this.model.create(obj);
    }

    async save(obj) {
        try {
            let result;

            if (obj._id) {
                result = this.updateOne({_id: obj._id}, obj).then(item => item.get({plain: true})).catch(this.defaultCatch);
            } else {
                result = this.create(obj).then(item => item.get({plain: true})).catch(this.defaultCatch);
            }
            return result;
        } catch (e) {
            console.dir(e);
            console.dir(e.errors);
            return false;
        }
    }

    defaultCatch(exception) {
        console.log("modelSequelize defaultCatch");
        console.dir(exception);
        console.dir(exception.errors);
    }

    find(where, include, order) {
        let options = {where};
        if (include) {
            options.include = include.split(' ');
        }
        if (order) {
            options.order = order.split(' ');
        }
        return this.model.findAll(options).then(items => items.map((item) => this.returnItemInstance(item))).catch(this.defaultCatch);
    }

    findById(id, include) {
        let options = {};
        if (include) {
            options = {include: include.split(' ')};
        }
        return this.model.findById(id, options).then((item) => this.returnItemInstance(item)).catch(this.defaultCatch);
    }

    findByIdCache(id, include) {
        //TODO: make it work on cache
        let options = {};
        if (include) {
            options = {include: include.split(' ')};
        }
        return this.model.findById(id, options).then((item) => this.returnItemInstance(item)).catch(this.defaultCatch);
    }

    findOne(where, include) {
        let options = {where};
        if (include) {
            options.include = include.split(' ');
        }
        return this.model.find(options).then((item) => this.returnItemInstance(item)).catch(this.defaultCatch);
    }

    update(where, obj) {
        let options = {where};
        return this.model.update(obj, options).then(response => !!response[0]).catch(this.defaultCatch);
    }

    updateOne(where, obj) {
        let options = {where, returning: true};
        return this.model.update(obj, options).then(response => {
            if (response[0] !== 1) {
                console.warn("updateOne response to be verified (response[0]!==1)", response);
            }
            return response[1][0];
        });
    }

    delete(where) {
        let options = {where};
        return this.model.destroy(options);
    }

    flush(){
        return this.model.destroy({
            where: {},
            truncate: true
        });
    }
}

const checkModel = (modelSequelize) => {
    if (modelSequelize.constructor === Array) {
        for (const modelItem of modelSequelize) {
            const modelName = Object.getPrototypeOf(modelItem).name;
            if (!modelName || modelName !== 'ModelSequelize') {
                throw new Error('Invalid model ' + modelName + ' provided to ModelSequelize');
            }
        }
    } else {
        const modelName = Object.getPrototypeOf(modelSequelize).name;
        if (!modelName || modelName !== 'ModelSequelize') {
            throw new Error('Invalid model ' + modelName + ' provided to ModelSequelize');
        }
    }
    return true;
};

module.exports = ModelSequelize;
