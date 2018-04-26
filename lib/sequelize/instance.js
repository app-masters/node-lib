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

        this.repository = repository;
        this.spreadProperties(obj);
    }

    spreadProperties (obj) {
        // console.log('spreading...', obj);
        for (let key in obj) {
            this[key] = obj[key];
        }
    }

    async save () {
        let item = await this.repository.save(this);
        this.spreadProperties(item);
    }

    async delete () {
        const deleted = await this.repository.delete(this);
        if (deleted) {
            delete this;
        }
        return item;
    }

}

module.exports = Instance;