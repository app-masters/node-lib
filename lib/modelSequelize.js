const Model = require('./model');

class ModelSequelize extends Model {
    static setup (sequelize, modelName, schema, instance, relationArray) {
        if (!modelName) {
            throw new Error('You must setup a valid model on setup()');
        }
        let model = sequelize.define(modelName, schema);
        model.sync({force: false}); // force: true - drop the table if already exists

        if (!model) {
            throw new Error('Cannot define a model to provided schema on setup()');
        }

        // Set the instance methods
        if (instance) {
            const propertyNames = Object.getOwnPropertyNames(instance);
            propertyNames.map(name => {
                if (typeof instance[name] === 'function') {
                    model.prototype[name] = instance[name];
                }
            });
        }

        // Define relations
        if (relationArray) {
            for (const relation of relationArray) {
                if (checkModel(relation)) {
                    model.belongsTo(relation.model);
                }
            }
        }

        ModelSequelize.model = model;
    }

    static create (obj) {
        return ModelSequelize.model.create(obj);
    }

    static find (where, include, order) {
        let options = {where};
        if (include) {
            options.include = include.split(' ');
        }
        if (order) {
            options.order = order.split(' ');
        }
        return ModelSequelize.model.findAll(options);
    }

    static findById (id, include) {
        let options = {};
        if (include) {
            options = {include: include.split(' ')};
        }
        return ModelSequelize.model.findById(id, options);
    }

    static findByIdCache (id, include) {
        //TODO: make it work on cache
        let options = {};
        if (include) {
            options = {include: include.split(' ')};
        }
        return ModelSequelize.model.findById(id, options);
    }

    static findOne (where, include) {
        let options = {where};
        if (include) {
            options.include = include.split(' ');
        }
        return ModelSequelize.model.find(options);
    }

    static update (where, obj) {
        let options = {where};
        return ModelSequelize.model.update(obj, options).then(response => !!response[0]);
    }

    static delete (where) {
        let options = {where};
        return ModelSequelize.model.destroy(options);
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

ModelSequelize.model = null;

module.exports = ModelSequelize;