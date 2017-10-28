const mongoose = require('mongoose');
const AMCache = require('@app-masters/mongoose-it').amCache;

class AMModel {
    constructor (modelName, cacheAll) {
        // console.log("AMModel > constructor > " + modelName);
        this.modelName = modelName;
        // this.useCache = useCache === true;
        // TEST to check it the model was created before here

        try {
            this.model = mongoose.model(this.modelName);
        } catch (e) {
            if (e.name === "MissingSchemaError") {
                throw new Error("Haven't registered the model '" + modelName + "'. You must do require(youSchemaFile) on your model class");
            }
            throw e;
        }
        if (!this.model) {
            throw new Error("Havent a model on " + modelName);
        }
        // check for mongooseit
        if (typeof this.getModel().findIt === "undefined") {
            throw new Error("You must use mongooseit plugin on schema for model " + modelName);
        }
        // Check modelname
        if (modelName !== this.getModel().getModelName()) {
            throw new Error("Model name different on AMModel constructor of '" + modelName + "' and defined on mongooseit plugin at schema file. You copied it from '" + this.getModel().getModelName() + "' schema and don't change the string... you're a LAZY developer!");
        }

        if (cacheAll) {
            console.log("CACHE ALL on " + modelName);
            this.model.cacheAll();
        }
    }

    getModel () {
        // console.log("getModel called");
        return this.model;// mongoose.model(this.modelName);
    }

    async find (find, populate, sort) {
        // if (this.useCache) {
        //     return this.getModel().findItCache(find, populate, sort);
        // } else {
        return this.getModel().findIt(find, populate, sort);
        // }
    }

    async findItCache (find, populate, sort) {
        return this.getModel().findItCache(find, populate, sort);
    }

    async findItOneCache (find, populate, sort) {
        return this.getModel().findItOneCache(find, populate, sort);
    }

    async findItByIdCache (find, populate) {
        return this.getModel().findItByIdCache(find, populate);
    }

    async findItById (find, populate) {
        return this.getModel().findItById(find, populate);
    }

    async findOne (find, populate, sort) {
        return this.getModel().findItOne(find, populate, sort);
    }

    async findOneAndUpdate (find, data) {
        return this.getModel().findOneAndUpdate(find, data, {new: true});
    }

    async getAll (populate, sort) {
        return this.getModel().findIt({}, populate, sort);
    }

    async exists (find) {
        // console.log("this2", this);
        return this.getModel().exists(find);
    }

    async deleteAll () {
        return this.getModel().find({}).remove();
    }

    async update (find, data) {
        return this.getModel().findItAndUpdate(find, data);
    }

    async findOneAndUpdate (find, data) {
        return this.getModel().findItOneAndUpdate(find, data);
    }

    async findItOneAndUpdateCache (find, data) {
        let record = await this.getModel().findItOneAndUpdateCache(find, data);
        return record;
    }

    async updateOne (find, data) {
        return this.getModel().findItOneAndUpdate(find, data);
    }

    // Create methods

    async getAllCache (populate, sort) {
        return this.getModel().getAllCache(populate, sort);
    }

    async create (obj) {
        return this.getModel().create(obj, {new: true});
    }

    async insertMany (arr) {
        return this.getModel().insertMany(arr, {new: true});
    }

    // Cache methods

    /**
     * Return a cache name from a given objects
     * @TODO !!!!!!!!!!!!!!!!!!!!!!!1
     * Must sort atributes
     * @param param
     * @returns {*}
     */
    getCacheKey (param) {
        return param;
    }

    clearCache (key) {
        return AMCache.del(key);
    }

    setCache (key, value) {
        return AMCache.set(key, value);
    }
}

AMModel.modelName = undefined;
AMModel.model = undefined;
AMModel.useCache = false;

module.exports = AMModel;

/*
    Model classes that extends AMModel must implement:

    constructor() {
        super(yourmodelname);
    }

    static getInstance() {
        if (!this.instance)
            this.instance = new YourClass();
        return this.instance;
    }

    ... and exports like:

    module.exports = YourClass.getInstance();
 */
