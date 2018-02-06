var restful = require('node-restful');
var mongoose = restful.mongoose;
const AMMailing = require('../lib/am-mailing');
const testConfig = require('../test/src/testConfig');

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
        let parsedText = '';
        Object.keys(body).map((key) => {
            let newKey;
            if(config.fields[key]){
                newKey = config.fields[key];
            }else{
                newKey = key.substring(0, 1).toUpperCase() + key.substring(1).toLowerCase();
            }
            parsedText += `<b>${newKey}:</b> ${body[key]}<br/>`;
        });
        const subject = `[${AMMailing.config.fromName}] ${config.subject}`;
        const text = JSON.stringify(body);
        const html = parsedText;
        if(config.saveToDb !== false){
            const model = mongoose.model('message');
            const message = {
                user: user._id,
                messageKey,
                values: body
            };
            await model.create(message, (err, message) => {
                if (err){
                    console.log(err);
                }
            });
        }
        AMMailing.sendEmail(config.to, subject, text, parsedText);
        return true;
    }
};
Message.config;
module.exports = Message;
