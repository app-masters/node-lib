// @flow
// import type { ModelSequelize } from '@app-masters/node-lib';

class Instance {

    constructor (obj, repository) {
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

    async getPropertiesById () {
        let item = await this.repository.findById(this._id);
        this.spreadProperties(item);
    }

}

module.exports = Instance;