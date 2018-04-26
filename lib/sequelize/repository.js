const ModelSequelize = require('./modelSequelize');

class Repository {
    static setup (modelName, schema, itemInstance, modelOptions) {
        if (typeof modelName!=='string') {
            console.warn("Repository.setup doesn't need sequelize as first param anymore");
            throw new Error("Repository.setup params changed to > setup(modelName, schema, itemInstance, modelOptions)");
        }

        if (itemInstance){
            const Instance = require('./instance');
            if (!(itemInstance.prototype instanceof Instance)){
                throw new Error("itemInstance must be of type Instance (singular) on `"+this.name+"` repository setup. `"+itemInstance.name+"` given.");
            }
        }

        // How to validate if itemInstance have the needed attributes?
        // console.warn(Object.keys(schema));
        // console.warn(Object.keys(itemInstance));
        // console.warn(itemInstance);

        this.modelName = modelName;
        this.model = new ModelSequelize();
        this.model.setup(modelName, schema, itemInstance, modelOptions);
        this.itemInstance = itemInstance;
    }

    static getModel () {
        return this.model.getModel();
    }

    static getItemInstance () {
        return this.itemInstance;
    }

    static async create (obj) {
        this.validateModel();
        return this.model.create(obj);
    }

    static async save (obj) {
        this.validateModel();
        return this.model.save(obj);
    }

    static find (where, include, order) {
        this.validateModel();
        return this.model.find(where, include, order);
    }

    static findById (id, include) {
        this.validateModel();
        return this.model.findById(id, include);
    }

    static findByIdCache (id, include) {
        this.validateModel();
        return this.model.findByIdCache(id, include);
    }

    static findOne (where, include) {
        this.validateModel();
        return this.model.findOne(where,include);
    }

    static update (where, obj) {
        this.validateModel();
        return this.model.update(where, obj);
    }

    static delete (where) {
        this.validateModel();
        return this.model.delete(where);
    }

    static flush () {
        this.validateModel();
        return this.model.flush()
    }

    static validateModel() {
        if (!this.model)
            throw new Error("Model not started at: "+this.modelName );
    }
}

module.exports = Repository;
