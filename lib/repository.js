const ModelSequelize = require('./modelSequelize');

class Repository {
    static setup (sequelize, modelName, schema, itemInstance, modelOptions) {
        if (itemInstance){
            const Instance = require('./instance');
            if (!(itemInstance.prototype instanceof Instance)){
                throw new Error("itemInstance must be of type Instance (singular) on `"+this.name+"` repository setup. `"+itemInstance.name+"` given.");
            }
        }

        this.model = new ModelSequelize();
        this.model.setup(sequelize, modelName, schema, itemInstance, modelOptions);
        this.itemInstance = itemInstance;
    }

    static getModel () {
        return this.model.getModel();
    }

    static getItemInstance () {
        return this.itemInstance;
    }

    static async create (obj) {
        return this.model.create(obj);
    }

    static async save (obj) {
        return this.model.save(obj);
    }

    static find (where, include, order) {
        return this.model.find(where, include, order);
    }

    static findById (id, include) {
        return this.model.findById(id, include);
    }

    static findByIdCache (id, include) {
        return this.model.findByIdCache(id, include);
    }

    static findOne (where, include) {
        return this.model.findOne(where,include);
    }

    static update (where, obj) {
        return this.model.update(where, obj);
    }

    static delete (where) {
        return this.model.delete(where);
    }
}

module.exports = Repository;
