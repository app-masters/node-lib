const restful = require('node-restful');
const mongoose = restful.mongoose;
const AMAuth = require('./am-auth');

const admin = require("firebase-admin");

class Notification {
    /**
     *
     * @param config
     * @returns {boolean}
     */
    static setup(config) {
        const userSchema = mongoose.model('user').schema;
        AMAuth.certifySchemaAtributes(userSchema, ['notification.web.token', 'notification.ios.token', 'notification.android.token']);
        if (!config) {
            throw new Error('Notification.setup: missing config on setup');
        }
        if (!config.databaseURL) {
            throw new Error('Notification.setup: missing databaseURL. Expecting some Firebase errors');
        }
        if (!config.credential) {
            throw new Error('Notification.setup: Notification.config.credential does not exists. Expecting some Firebase errors');
        }
        if (!config.credential.private_key) {
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
    static setCredentials() {
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
    static async send(users, payload) {
        if (!users || !payload) {
            throw new Error('Notification.send: missing user(s) and/or payload');
        }
        if (!Array.isArray(users)) {
            users = [users];
        }
        try {
            users.map((user, i) => {
                console.log('USERS ===>', user);
                let tokens = [];
                // i am pushing the user's token arrays to the same structure (it seems ugly but is nobel)
                user.notification.web ? tokens.push(...user.notification.web.token) : null;
                user.notification.android ? tokens.push(...user.notification.android.token) : null;
                user.notification.ios ? tokens.push(...user.notification.ios.token) : null;
                console.log('TOKENS ===>', tokens);
                admin.messaging().sendToDevice(tokens, payload)
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
        } catch (err) {
            throw err;
        }
    }

    /**
     *
     * @param user
     * @param token
     */
    static saveUserToken(user, token) {
        const userModel = mongoose.model('user');
        if (token.type && token.value) {
            if(user.notification) {
                if(user.notification[token.type].token.includes(token.value)){
                    // already includes this token, returning
                    return;
                }
                // push the new token to the array of tokens
                user.notification[token.type] ? user.notification[token.type].token.push(token.value) : user.notification[token.type].token = [token.value];
            }else {
                // else we will create the object from the scratch
                user.notification = {
                    [token.type]: {
                        token: new Array(token.value)
                    }
                }
            }
            userModel.findOneAndUpdate({_id: user._id}, user, {new: true}).then(console.log);
        }else{
            throw new Error('Missing body = {type, value} - Body object must be {type: string, value: string}');
        }
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    static addUserToken(req, res, next) {
        try {
            res.send(Notification.saveUserToken(req.user, req.body));
        } catch (error) {
            next(error);
        }
    }

    /**
     *
     * @param notification
     */
    static saveToDb(notification) {
        this.model.create(notification, (err, newMessage) => {
            if (err) {
                throw err;
            }
        });
    }

    static getUserNotifications(userId) {
        const notifyModel = Notification.getModel();
        const notifications = notifyModel.find({"user": userId});
        return notifications;
    }

    static getCountUserUnseenNotifications(userId) {
        const notifyModel = Notification.getModel();
        const unseenNotifications = notifyModel.count({"user": userId, "seen": null});
        return unseenNotifications;
    }
}

Notification.model = null;
Notification.config = {
    credentials: null,
    databaseURL: null
};

module.exports = Notification;
