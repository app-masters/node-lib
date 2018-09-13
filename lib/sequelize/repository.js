const ModelSequelize = require('./modelSequelize');

class Repository {
    static setup(modelName, schema, itemInstance, modelOptions) {
        if (typeof modelName !== 'string') {
            console.warn("Repository.setup doesn't need sequelize as first param anymore");
            throw new Error("Repository.setup params changed to > setup(modelName, schema, itemInstance, modelOptions)");
        }

        if (itemInstance) {
            const Instance = require('./instance');
            if (!(itemInstance.prototype instanceof Instance)) {
                throw new Error("itemInstance must be of type Instance (singular) on `" + this.name + "` repository setup. `" + itemInstance.name + "` given.");
            }
        }

        // Default model options
        if (!modelOptions)
            modelOptions = {};
        modelOptions.freezeTableName = true;

        // How to validate if itemInstance have the needed attributes?
        // console.warn(Object.keys(schema));
        // console.warn(Object.keys(itemInstance));
        // console.warn(itemInstance);

        this.modelName = modelName;
        this.schema = schema;
        this.model = new ModelSequelize();
        this.model.setup(modelName, schema, itemInstance, modelOptions);
        this.itemInstance = itemInstance;

        // Save Repository instance on repository static collection
        Repository.repositories[modelName] = {
            modelName: modelName,
            itemInstance: itemInstance
        };

    }

    static getModel() {
        return this.model.getModel();
    }

    static getItemInstance() {
        return this.itemInstance;
    }

    static async create(obj) {
        this.validateModel();
        this.validateObjectWithSchema(obj);
        return this.model.create(obj);
    }

    static async save(obj) {
        this.validateModel();
        this.validateObjectWithSchema(obj);
        return this.model.save(obj);
    }

    static find(where, include, order, limit, attr) {
        this.validateModel();
        return this.model.find(where, include, order, limit, attr);
    }

    static findById(id, include) {
        this.validateModel();
        return this.model.findById(id, include);
    }

    static findByIdCache(id, include) {
        this.validateModel();
        return this.model.findByIdCache(id, include);
    }

    static findOne(where, include) {
        this.validateModel();
        return this.model.findOne(where, include);
    }

    static async exists(where) {
        this.validateModel();
        return await this.model.findOne(where) !== null;
    }

    static query(sql) {
        this.validateModel();
        return this.model.query(sql, this.itemInstance);
    }

    static queryOne(sql) {
        this.validateModel();
        return this.model.queryOne(sql, this.itemInstance);
    }

    static update(where, obj) {
        this.validateModel();
        this.validateObjectWithSchema(obj);
        return this.model.update(where, obj);
    }

    static delete(where) {
        this.validateModel();
        return this.model.delete(where);
    }

    static flush() {
        this.validateModel();
        return this.model.flush()
    }

    static validateModel() {
        if (!this.model)
            throw new Error("Model not started at: " + this.name);
    }

    /**
     * Check if object use just schema attributes
     * @todo Run it just on dev
     * @param obj
     */
    static validateObjectWithSchema(obj) {
        for (let key in obj) {
            if (key.substr(0, 1) === "_")
                continue;
            // this[key] = obj[key];
            if (!this.schema[key]) {
                console.error("Trying to handle a attribute that don't exists on schema. Schema: " + this.modelName + " - attribute: " + key + " - value: " + obj[key]);
            }
        }
    }

    /**
     * Return a model by it's table name, like "my_happy_table"
     * @param tableName
     * @returns {null}
     */
    static getModelByTableName(tableName) {
        let model = Repository.repositories[tableName];
        if (model){
            return model.model;
        }
        return null;
    }

    /**
     * Transform a object from sequelize, from database to a Instance.
     * It change the fields "like_this" to "likeThis" too.
     * @param obj
     * @returns {{}}
     */
    static databaseObjectToInstance(obj) {
        this.schemaByFieldName = {};
        for (let keyField of Object.keys(this.schema)) {
            let fieldObj = this.schema[keyField];
            if (fieldObj.field){
                // console.log("fieldObj",keyField, fieldObj);
                this.schemaByFieldName[fieldObj.field] = fieldObj;
            } else {
                // Fields that have same name in schema and database
                this.schemaByFieldName[keyField] = {fieldName: keyField};
            }
        }

        // If it's a sequelize object, turn to plain
        if (typeof obj.get ==="function")
            obj = obj.get({plain:true});

        let resultObject = {};
        for (let key in obj) {
            // this[key] = obj[key];
            if (key.substr(0, 1) === "_" && key !== '_id')
                continue;
            if (typeof(key) !== 'string') {
                // console.log(key, typeof(key));
                continue;
            }
            let field = this.schemaByFieldName[key];
            // console.log(key + " ===== ", obj[key]);
            if (!field) {
                // May be another instance. Check by model name.
                // console.log(" >>>>>>>>>> another instance? type",typeof obj[key]);
                // console.log(" >>>>>>>>>> another instance? key",key);
                // console.log(" >>>>>>>>>> another instance? value",obj[key]);

                let model = Repository.getModelByTableName(key);
                if (model){
                    // console.log(" >>>>>>>>>> model",model);
                    resultObject[key] = model.databaseObjectToInstance(obj[key]);
                }

                // console.error("Trying to handle a attribute that don't exists on schemaByFieldName . Schema: " + this.modelName + " - attribute: " + key + " - value: " + obj[key]);
            } else {
                resultObject[field.fieldName] = obj[key];
            }
        }

        return resultObject;
    }
}

// Static collection of repositories
Repository.repositories = {};

module.exports = Repository;
