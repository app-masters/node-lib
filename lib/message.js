var restful = require('node-restful');
var mongoose = restful.mongoose;
const AMMailing = require('../lib/am-mailing');

class Message {
    static setup (config) {
        Message.config = config;
    }

    static async send(messageKey, user, body) {
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
        const model = mongoose.model('message');        
        if(config.saveToDb !== false){
            message = {
                user: user._id,
                messageKey,
                values: body,
            };
            // must await to get the id of the new message aded on the schema
            await model.create(message, (err, newMessage) => {
                if (err){
                    throw err;
                }       
                message = newMessage;
            });
            message.emailSentAt = new Date();
        }
        AMMailing.sendEmail(config.to, subject, text, parsedText).then((email) => {
            if(message){
                model.updateOne({_id: message._id}, message).exec((err, newMessage) => {
                    if(err){
                        throw err;
                    }
                });
            }
        }).catch((error) => {
            throw error;
        });
        return true;
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
module.exports = Message;
