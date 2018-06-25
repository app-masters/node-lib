// @flow
// import type { ModelSequelize } from '@app-masters/node-lib';

class Instance {
    repository: Object;

    constructor (obj: Object, repository) {
        const Repository = require('./repository');
        if (repository) {
            if (!(repository.prototype instanceof Repository)) {
                throw new Error("repository must be instance of Repository on `" + this.constructor.name + "` instance declaration");
            }
        }
        // console.log('constructor', obj, model);

        this._repository = repository;
        this.spreadProperties(obj);
    }

    spreadProperties (obj) {
        // console.log('spreading...', obj);
        for (let key in obj) {
            this[key] = obj[key];
        }
    }

    async save () {
        let item = await this._repository.save(this);
        this.spreadProperties(item);
    }

    async delete () {
        const deleted = await this._repository.delete({_id: this._id});
        if (deleted) {
            delete this;
        }
    }

}

module.exports = Instance;