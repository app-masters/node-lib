const Repository = require('../repository');

class Messages extends Repository {

    /**
     * Return emails to be sent
     * @returns {*}
     */
    static getToSend () {
        return this.find({'dateSent': null, 'error': null}, '', 'createdAt');
    }

    /**
     * Find a message by hash
     * @param hashedId - md5 of it's _id
     * @returns {*}
     */
    static findByHash (hashedId) {
        return this.queryOne(`select _id from message where md5(message._id) = '${hashedId}'`);
    }

    /**
     * Find a message and set as read
     * @param: hashedId - md5 of it's _id
     * @returns {*}
     */
    static async setReadByHash (hashedId) {
        const message = await this.findByHash(hashedId);
        if (message) {
            await message.setRead();
        }
        return message;
    }
}

module.exports = Messages;
