var restful = require('node-restful');
var mongoose = restful.mongoose;
const AMMailing = require('../lib/am-mailing');

class Message {
    static setup (config) {
        Message.model = mongoose.model('message');
        Message.config = config;
    }

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
        const html = parsedText;
        let message;
        message = {
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
    static saveToDb(message){
        if(config.saveToDb !== false){
            Message.model.create(message, (err, newMessage) => {
                if (err){
                    throw err;
                }
            });
        }
    }
    static sendEmail(to, subject, text, parsedText){
        return AMMailing.sendEmail(to, subject, text, parsedText);
    }
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
};
Message.config;
Message.model;
module.exports = Message;
