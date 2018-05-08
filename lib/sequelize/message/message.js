// @flow

const AMMailing = require('../../am-mailing');
const MessageInstance = require('./messageInstance');

require('./messageRepository');
require('./messageSchema');

class Message {
    static setup(config: object): void {
        Message.config = config;
    }

    static getConfig(optionalConfig: string | object): object{
        if (typeof optionalConfig === 'string'){
            // config must be in the Message.config fields!
            const config = Message.config[optionalConfig];
            if (!config){
                throw new Error(`Config ${optionalConfig} not found!`);
            }
            return config;
        }
        if (!optionalConfig) {
            throw new Error(`You must provide a config!`);
        }

        return optionalConfig;
    }
    /*
        obj : {},
        config: {
            label_contact: {
                toMail: string,
                subject: string,
                fields: [
                    label_contact: {
                        name: 'nome',
                        email: 'zararata'
                    }
                ]
            }
        }
    */
    static async sendEmail(obj: object, config: string | object, fromUserId): Promise<void> {
        const configObj = Message.getConfig(config);
        if (!configObj){
            throw new Error('A config must be setted up at Message!');
        }

        const messageInstance = new MessageInstance({toMail: configObj.toMail, subject: configObj.subject, fromUserId});

        // setFromUserId(userId: number): void {
        //     this.fromUserId = userId;
        // }
        //
        // setMessageKey(messageKey: string): void {
        //     this.messageKey = messageKey;
        // }
        //
        // setObject(object: Object): void {
        //     this.object = object;
        //     this.notExists = true;
        // }


        const html = Message.objToHtml(obj, configObj);

        messageInstance.setBodyHtml(html);
        return messageInstance.send();
    }

    static objToHtml(body, config) {
        let parsedText = '';
        console.log('body1', body);
        Object.keys(body).map((key) => {
            let newKey;
            const text = body[key].replace(/(?:\r\n|\r|\n)/g, '<br/>');
            if (config.fields[key]) {
                newKey = config.fields[key];
            } else {
                newKey = key.substring(0, 1).toUpperCase() + key.substring(1).toLowerCase();
            }
            parsedText += `<b>${newKey}:</b> ${text}<br/>`;
        });
        console.log('parsedText', parsedText);
        return parsedText;
    }
}

Message.setup({});
module.exports = Message;
