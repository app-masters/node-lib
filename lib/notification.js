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
        if(!config){
            throw new Error('Notification.setup: missing config on setup');
        }
        if(!config.databaseURL){
            throw new Error('Notification.setup: missing databaseURL. Expecting some Firebase errors');
        }
        if(!config.credential){
            throw new Error('Notification.setup: Notification.config.credential does not exists. Expecting some Firebase errors');
        }
        if(!config.credential.private_key){
            throw new Error('Notification.setup: missing private_key on serviceAccountKey.json. Expecting some Firebase errors');
        }
        this.config = config;
        this.setCredentials();
        this.model = mongoose.model('notification');
        return true;
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
     * @param users
     * @param payload
     */
    static async send (users, payload) {
        if(!users || !payload){
            throw new Error('Notification.send: missing user(s) and/or payload');
        }
        if(!Array.isArray(users)){
            users = [users];
        }
        try {
            users.map((user, i) => {
                admin.messaging().sendToDevice(user.token, payload)
                    .then((response) => {
                        const notification = {
                            payload,
                            user: user._id,
                            sent: new Date(),
                            messageId: response.results[0].messageId
                        };
                        this.saveToDb(notification);
                    })
                    .catch((error) => {
                        const notification = {
                            payload,
                            user: user._id,
                            failed: new Date(),
                            errorMessage: error.message
                        };
                        this.saveToDb(notification);
                        throw error;
                    });
            });
        }catch(err){
            throw err;
        }
    }

    /**
     *
     * @param notification
     */
    static saveToDb(notification){
        this.model.create(notification, (err, newMessage) => {
            if (err){
                throw err;
            }
        });
    }

    static getUserNotifications (userId) {
        const notifyModel = Notification.getModel();
        const notifications = notifyModel.find({ "user": userId });
        return notifications;
    }

    static getCountUserUnseenNotifications (userId) {
        const notifyModel = Notification.getModel();
        const unseenNotifications = notifyModel.count({ "user": userId, "seen": null });
        return unseenNotifications;
    }
}

Notification.model = null;
Notification.config = {
    credentials: null,
    databaseURL: null
};

module.exports = Notification;
