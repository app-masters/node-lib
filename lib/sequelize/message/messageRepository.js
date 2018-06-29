const Repository = require('../repository');

console.log("LOADED");

class Messages extends Repository {

    static getToSend() {
        return this.find({'dateSent': null}, '', 'createdAt');
    }
}

module.exports = Messages;
