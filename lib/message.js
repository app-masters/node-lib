var restful = require('node-restful');
var mongoose = restful.mongoose;
const AMMailing = require('../lib/am-mailing');

/**
 * Class to manage the message sending
 * @author Igor Phelype
 */
class Message {
    /**
     * Method to setup the message class with the giving config object
     * @author Igor Phelype
     * @param {*} config
     * @returns {void}
     */
    static setup (config) {
        Message.model = mongoose.model('message');
        Message.config = config;
    }

    /**
     * Method to do all the things at once (saving on the db, sending email, etc)
     * @author Igor Phelype
     * @param {String} messageKey
     * @param {*} user
     * @param {*} body
     * @returns {boolean}
     */
    static send(messageKey, user, body) {
        const config = this.config[messageKey];
        if(!config){
            throw new Error(`The message key ${messageKey} not found`);
        }
        if(!user || !body) {
            throw new Error('User and Body required');
        }
        if(!config.to || !config.subject){
            throw new Error('Target e-mail (to) and Subject required');
        }
        let parsedText = this.toHtml(body, config);
        const subject = `[${AMMailing.config.fromName}] ${config.subject}`;
        const text = JSON.stringify(body);
        let message = {
            user: user._id,
            messageKey,
            values: body
        };
        AMMailing.sendEmail(config.to, subject, text, parsedText).then((email) => {
            message.emailSentAt = new Date();
            Message.saveToDb(message);
        }).catch((error) => {
            Message.saveToDb(message);
            throw error;
        });
        return true;
    }
    /**
     * Method to save the message on the db
     * @author Igor Phelype
     * @param {*} message
     * @returns {void}
     */
    static saveToDb(message){
        if(config.saveToDb !== false){
            Message.model.create(message, (err, newMessage) => {
                if (err){
                    throw err;
                }
            });
        }
    }
    /**
     * Method to send the email
     * @author Igor Phelype
     * @param {*} to
     * @param {*} subject
     * @param {*} text
     * @param {*} parsedText
     * @returns {promise}
     */
    static sendEmail(to, subject, text, parsedText){
        return AMMailing.sendEmail(to, subject, text, parsedText);
    }
    /**
     * Method to convert the text to html approach
     * @author Igor Phelype
     * @param {*} body
     * @param {*} config
     * @returns {parsedText}
     */
    static toHtml(body, config){
        let parsedText = '';
        Object.keys(body).map((key) => {
            let newKey;
            const text = body[key].replace(/(?:\r\n|\r|\n)/g, '<br/>');
            if(config.fields[key]){
                newKey = config.fields[key];
            }else{
                newKey = key.substring(0, 1).toUpperCase() + key.substring(1).toLowerCase();
            }
            parsedText += `<b>${newKey}:</b> ${text}<br/>`;
        });
        console.log(parsedText);
        return parsedText;
    }
    static sendMessage(req, res, next){
        try{
            res.send(this.send(req.params.messageKey, req.user, req.body));
        }catch (error){
            next(error);
        }
    }
}
Message.config;
Message.model;
module.exports = Message;
