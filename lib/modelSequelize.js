const Model = require('./model');

class ModelSequelize extends Model {
    setup(sequelize, modelName, schema, itemInstance, modelOptions) {
        if (!modelName) {
            throw new Error('You must setup a valid model on setup()');
        }
        let model = sequelize.define(modelName, schema, modelOptions);
        model.sync({force: false}); // force: true - drop the table if already exists

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
        if (!this.itemInstance) {
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
        if (obj._id) {
            return this.update({_id: obj._id}, obj).then(item => item.get({plain: true}));
        } else {
            return this.create(obj).then(item => item.get({plain: true}));
        }
    }

    find(where, include, order) {
        let options = {where};
        if (include) {
            options.include = include.split(' ');
        }
        if (order) {
            options.order = order.split(' ');
        }
        return this.model.findAll(options).then(items => items.map((item) => this.returnItemInstance(item)));
    }

    findById(id, include) {
        let options = {};
        if (include) {
            options = {include: include.split(' ')};
        }
        return this.model.findById(id, options).then((item) => this.returnItemInstance(item));
    }

    findByIdCache(id, include) {
        //TODO: make it work on cache
        let options = {};
        if (include) {
            options = {include: include.split(' ')};
        }
        return this.model.findById(id, options).then((item) => this.returnItemInstance(item));
    }

    findOne(where, include) {
        let options = {where};
        if (include) {
            options.include = include.split(' ');
        }
        return this.model.find(options).then((item) => this.returnItemInstance(item));
    }

    update(where, obj) {
        let options = {where};
        return this.model.update(obj, options).then(response => !!response[0]);
    }

    updateOne(where, obj) {
        let options = {where, returning: true};
        return this.model.update(obj, options).then(response => {
            console.log("updateOne response", response);
            return response[1][0];
        });
    }

    delete(where) {
        let options = {where};
        return this.model.destroy(options);
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
