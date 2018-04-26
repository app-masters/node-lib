const Model = require('./sequelize/model');
const mongoose = require('mongoose');

class ModelMongoose extends Model {
    static setup (modelName, schema, instance) {
        if (!modelName) {
            throw new Error('You must setup a valid modelName on ModelMongoose.setup()');
        }

        // Set the instance methods
        if (instance) {
            const propertyNames = Object.getOwnPropertyNames(instance);
            propertyNames.map(name => {
                if (typeof instance[name] === 'function') {
                    console.log(name);
                    schema.methods[name] = instance[name];
                }
            });
        }
        this.model = mongoose.model(modelName, schema);
    }

    static create (obj) {
        return this.model.create(obj, {new: true});
    }

    static find (find, populate, sort) {
        return this.model.find(find).populate(populate || '').sort(sort || '');
    }

    static findById (id, populate) {
        return this.model.findOne({'_id': id}).populate(populate || '');
    }

    static findOne (find, populate) {
        return this.model.findOne(find).populate(populate || '');
    }

    static update (find, obj) {
        return this.model.update(find, obj).then(response => !!response.ok);
    }

    static delete (find) {
        return this.model.find(find).remove();
    }
}

const checkModel = (modelSequelize) => {
    if (modelSequelize.constructor === Array) {
        for (const modelItem of modelSequelize) {
            const modelName = Object.getPrototypeOf(modelItem).name;
            if (!modelName || modelName !== 'ModelMongoose') {
                throw new Error('Invalid model ' + modelName + ' provided to ModelMongoose');
            }
        }
    } else {
        const modelName = Object.getPrototypeOf(modelSequelize).name;
        if (!modelName || modelName !== 'ModelMongoose') {
            throw new Error('Invalid model ' + modelName + ' provided to ModelMongoose');
        }
    }
    return true;
};

module.exports = ModelMongoose;