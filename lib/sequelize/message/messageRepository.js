const Repository = require('../repository');

class Messages extends Repository {

    static getToSend() {
        return this.find({'dateSent': null}, '', 'createdAt');
    }
}

module.exports = Messages;
