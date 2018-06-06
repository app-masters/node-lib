// @flow

const AMMailing = require('../../am-mailing');

class Message {
    static config: Object;
    static setup(config: Object): void {
        Message.config = {...Message.config || {}, ...config};
    }

    static getConfig(optionalConfig: string | Object): Object{
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

    static async sendEmail(toMail:string, content: Object, config: string | Object, mailConfig: Object, fields: Object, fromUserId: string): Promise<void> {
        require('./messageSchema');
        const MessageInstance = require('./messageInstance');
        const configObj = Message.getConfig(config);
        if (!configObj){
            throw new Error('A config must be setted up at Message!');
        }

        const messageInstance = new MessageInstance({toMail, subject: configObj.subject, fromUserId, _mailConfig: mailConfig});
        const html = Message.objToHtml(content, {...configObj, fields: {...configObj.fields, ...fields}});

        messageInstance.setBodyHtml(html);
        return messageInstance.send();
    }

    static getButtonFromTemplate(actions: Array<Object>, buttonTemplate: String): string{
        return actions.map(act => Message.parseString(buttonTemplate, {fields: act})).join('');
    }

    static sendEmailTemplated(template: Object,toMail:string, mailConfig: Object, fromUserId: string): Promise<void> {
        /*  
            template: {
                background, // template basico. pode conter {{lowerText}}, {{upperText}}, {{styles}}, {{unsubscribeURL}}, {{labelAddress}} em seu conteudo (será substituido pelos valores)
                lowerText,
                upperText,
                styles,
                buttonTemplate, // template de um botao. deve conter {{buttonText}} e {{buttonTarget}}
                actions, // array de acoes. ex: [{buttonText: 'Clique aqui', buttonTarget: 'www.google.com'}]
                unsubscribeURL,
                labelAddress
            }
        */
        const button = Message.getButtonFromTemplate(template.actions, template.buttonTemplate);
        return Message.sendEmail(toMail, template.background, {
            subject: 'subject',
            fields: {
                    ...template,
                    button
                }
        }, mailConfig, {}, fromUserId);

    }

    static objectToString(obj: Object, config: Object){
        let parsedText = '';
        Object.keys(obj).map((key) => {
            let newKey;
            const text = obj[key].replace(/(?:\r\n|\r|\n)/g, '<br/>');
            if (config.fields[key]) {
                newKey = config.fields[key];
            } else {
                newKey = key.substring(0, 1).toUpperCase() + key.substring(1).toLowerCase();
            }
            parsedText += `<b>${newKey}:</b> ${text}<br/>`;
        });
        return parsedText;
    }

    static parseString(string: String, {fields}: Object){
        return string.split(/{{([\s\S]*?)}}/).map((t, i) => (i %2) !== 0 ? (fields[t] || t) : t).join('');
    }

    static objToHtml(content: Object, config: Object) {
        content = content || config.content;
        console.log('content1', content)
        if (typeof content === "object"){
            return Message.objectToString(content, config);
        }
        console.log('content2', content)
        if (typeof content === 'string'){
            return Message.parseString(content, config);
        }
    }
}

Message.setup({});
module.exports = Message;
