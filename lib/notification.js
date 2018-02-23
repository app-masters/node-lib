const restful = require('node-restful');
const mongoose = restful.mongoose;

const admin = require("firebase-admin");

class Notification {
    /**
     *
     * @param config
     * @returns {boolean}
     */
    static setup(config){
        this.config = config;
        this.setCredentials();
        return true;
    }

    /**
     *
     * @returns {*}
     */
    static getModel () {
        return mongoose.model('notification');
    }

    /**
     * sets firebase-admin credentials and security
     */
    static setCredentials () {
        admin.initializeApp({
            credential: admin.credential.cert(this.config.credential),
            databaseURL: this.config.databaseURL
        });
    }

    /**
     *
     * @param tokens
     * @param payload
     */
    static send (tokens, payload) {
        if(typeof tokens === 'string'){
            tokens = [tokens];
        }
        console.log(tokens);
        tokens.map((token, i) => {
            admin.messaging().sendToDevice(token, payload)
                .then(function (response) {
                    // console.log("Successfully sent message:", response);
                    // save to the db
                })
                .catch(function (error) {
                    throw new error;
                });
        });
    }

    static async createNotification (title, body, interactionType, user, content) {
        let nofifyModel = Notification.getModel();
        return nofifyModel.create({title, body, interactionType, user, content});
    }

    static async newNotification (notification) {
        let nofifyModel = Notification.getModel();
        return nofifyModel.create(notification);
    }

    static getUserNotifications (userID) {
        const notifyModel = Notification.getModel();
        const notifications = notifyModel.find({ "user": userID });
        return notifications;
    }

    static getCountUserUnseenNotifications (userID) {
        const notifyModel = Notification.getModel();
        const unseenNotifications = notifyModel.count({ "user": userID, "seen": null });
        return unseenNotifications;
    }
}

Notification.config = {
    credentials: null,
    databaseURL: null
};

module.exports = Notification;
