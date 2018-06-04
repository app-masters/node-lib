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
            console.warn("Schema without _id attribute: " + modelName + ". It's an error?");

        if (!modelOptions) modelOptions = {};
        // modelOptions.underscored = true;

        const forceSync = SequelizeInstance.options.forceSync || modelOptions.forceSync;
        if (forceSync) {
            console.warn("Model forcing database to sync schema '" + modelName + "'");
        }

        let model = sequelize.define(modelName, schema, modelOptions);
        model.sync(
            {
                force: forceSync, // force: true - drop the table if already exists
                logging: SequelizeInstance.options.syncLogging ? console.log : false
            }
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

    defaultCatch(exception) {
        console.log("modelSequelize defaultCatch");
        console.dir(exception);
        console.dir(exception.errors);
        throw exception;
    }

    async create(obj) {
        try {
            return this.model.create(obj);
        } catch (err) {
            return this.defaultCatch(err);
        }
    }

    async save(obj) {
        try {
            const result = (obj._id
                ? await this.updateOne({_id: obj._id}, obj)
                : await this.create(obj));

            return result.get({plain: true});
        } catch (err) {
            return this.defaultCatch(err);
        }
    }

    async find(where, include, order, limit) {
        try {
            let options = {where};
            if (include) {
                let includeParam = include;
                if (include.split) includeParam = include.split(' ');
                options.include = includeParam;
            }
            if (order) {
                options.order = order.split ? order.split(' ') : order;
            }
            if (limit){
                options.limit = limit;
            }
            const items = await this.model.findAll(options);
            return items.map((item) => this.returnItemInstance(item));
        } catch (err) {
            return this.defaultCatch(err);
        }
    }

    async findById(id, include) {
        try {
            let options = {};
            if (include) {
                let includeParam = include;
                if (include.split) includeParam = include.split(' ');
                options.include = includeParam;
            }
            const item = await this.model.findById(id, options);
            return this.returnItemInstance(item);
        } catch (err) {
            return this.defaultCatch(err);
        }
    }

    async findByIdCache(id, include) {
        //TODO: make it work on cache
        try {
            let options = {};
            if (include) {
                let includeParam = include;
                if (include.split) includeParam = include.split(' ');
                options.include = includeParam;
            }
            const item = await this.model.findById(id, options);
            return this.returnItemInstance(item);
        } catch (err) {
            return this.defaultCatch(err);
        }
    }

    async findOne(where, include) {
        try {
            let options = {where};
            if (include) {
                let includeParam = include;
                if (include.split) includeParam = include.split(' ');
                options.include = includeParam;
            }
            const item = await this.model.find(options);
            return this.returnItemInstance(item);
        } catch (err) {
            return this.defaultCatch(err);
        }
    }

    async update(where, obj) {
        try {
            let options = {where, individualHooks: true};
            const response = await this.model.update(obj, options);
            return !!response[0];
        } catch (err) {
            return this.defaultCatch(err);
        }
    }

    async updateOne(where, obj) {
        try {
            let options = {where, returning: true, individualHooks: true};
            const response = await this.model.update(obj, options);
            if (response[0] !== 1) {
                console.warn("updateOne response to be verified (response[0]!==1)", response);
                return response;
            }
            return response[1][0];
        } catch (err) {
            return this.defaultCatch(err);
        }
    }

    async delete(wherez) {
        try {
            return await this.model.destroy({where, individualHooks: true});
        } catch (err) {
            return this.defaultCatch(err);
        }
    }

    async flush() {
        try {
            return await this.model.destroy({
                where: {},
                truncate: true,
                individualHooks: true
            });
        } catch (err) {
            return this.defaultCatch(err);
        }
    }
}

module.exports = ModelSequelize;
