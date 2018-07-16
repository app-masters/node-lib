const Repository = require('../repository');

console.log("LOADED");

class Messages extends Repository {

    /**
     * Return emails to be sent
     * @returns {*}
     */
    static getToSend() {
        return this.find({'dateSent': null, 'error': null}, '', 'createdAt');
    }
}

module.exports = Messages;
