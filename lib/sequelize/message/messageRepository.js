const Repository = require('../repository');
const Message = require('./messageInstance');

class Messages extends Repository {

    static getToSend() {
        return this.find({'dateSent': null}, '', 'createdAt');
    }
}

module.exports = Messages;
