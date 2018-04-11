class Model {
    static findById(){
        const childName = Object.getPrototypeOf(this).name;
        throw new Error('\'findById\' is not specified in ' + childName);
    }

    static find(){
        const childName = Object.getPrototypeOf(this).name;
        throw new Error('\'find\' is not specified in ' + childName);
    }

    static findOne(){
        const childName = Object.getPrototypeOf(this).name;
        throw new Error('\'findOne\' is not specified in ' + childName);
    }

    static findOneAndUpdate(){
        const childName = Object.getPrototypeOf(this).name;
        throw new Error('\'findOneAndUpdate\' is not specified in ' + childName);
    }

    static getAll(){
        const childName = Object.getPrototypeOf(this).name;
        throw new Error('\'getAll\' is not specified in ' + childName);
    }

    static update(){
        const childName = Object.getPrototypeOf(this).name;
        throw new Error('\'update\' is not specified in ' + childName);
    }

    static create(){
        const childName = Object.getPrototypeOf(this).name;
        throw new Error('\'create\' is not specified in ' + childName);
    }
}

module.exports = Model;