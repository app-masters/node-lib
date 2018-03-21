const Model = require('./model');

class ModelSequelize extends Model {
    static setup (model, instance) {
        if(!model){
            throw new Error('You must setup a valid model no setup()');
        }
        this.model = model;
        if (instance) {
            const propertyNames = Object.getOwnPropertyNames(instance);
            propertyNames.map(name => {
                if (typeof instance[name] === 'function') {
                    this.model.prototype[name] = instance[name];
                }
            });
        }
    }

    static findById (id) {
        return this.model.findById(id);
    }

    static find (query, include, order) {
        console.log(typeof include);
        return this.model.findAll({where: query});
    }

    static findOne (query) {
        return this.model.find({where: query});
    }

    static create (obj) {
        return this.model.create(obj);
    }

    static update (query, obj) {
        return this.model.update(obj, {returning: true, where: query}).then(response => response[1]);
    }

    static getAll(){
        return this.model.findAll();
    }
}

module.exports = ModelSequelize;