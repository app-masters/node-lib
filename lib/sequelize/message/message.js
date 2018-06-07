// @flow

const AMMailing = require('../../am-mailing');

class Message {
    static config: Object;
    static template: Object;

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

    static getButtonFromTemplate(actions: Array<Object>, buttonTemplate: string): string{
        return (actions || []).map(act => Message.parsestring(buttonTemplate, {fields: act})).join('');
    }

    static setTemplate(template: Object): void{
        Message.template = template;
    }


    // content and subject are optional if they are in the config
    // content is optional if there's upperText in template obj

    static async sendEmailFinal(toMail:string, content: string | Object = '', subject: string, template: Object = {}, config: Object | string = {}, mailConfig: Object, fields: Object = {}, fromUserId: string): Promise<void> {
        const configObj = Message.getConfig(config);
        if (!configObj){
            throw new Error('A config must be setted up at Message!');
        }
        /*  
            template: {
                background, // template basico. pode conter {{button}}, {{lowerText}}, {{upperText}}, {{styles}}, {{unsubscribeURL}}, {{labelAddress}} em seu conteudo (será substituido pelos valores)
                lowerText,
                upperText,
                styles,
                buttonTemplate, // template de um botao. deve conter {{buttonText}} e {{buttonTarget}}
                actions, // array de acoes. ex: [{buttonText: 'Clique aqui', buttonTarget: 'www.google.com'}]
                unsubscribeURL,
                labelAddress
            },
            config: {
                content: {} (ou uma string!),
                fields: {},
                subject: ''
            }
        */
        template = {...Message.template, ...template};
        const button = Message.getButtonFromTemplate(template.actions, template.buttonTemplate || Message.template.buttonTemplate );
        const upperText = (content || config.content) ? Message.objToHtml(content || config.content, {...configObj, fields: {...configObj.fields, ...fields}}) : template.upperText;
    
        return Message.sendEmail(toMail, template.background, {
            subject: subject || configObj.subject,
            fields: {
                    ...template,
                    button: button || '',
                    lowerText: template.lowerText || '',
                    upperText: upperText || ''
                }
        }, mailConfig, {}, fromUserId);
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

    static sendEmailTemplated(template: Object,toMail:string, subject: string, mailConfig: Object, fromUserId: string): Promise<void> {
        /*  
            template: {
                background, // template basico. pode conter {{button}}, {{lowerText}}, {{upperText}}, {{styles}}, {{unsubscribeURL}}, {{labelAddress}} em seu conteudo (será substituido pelos valores)
                lowerText,
                upperText,
                styles,
                buttonTemplate, // template de um botao. deve conter {{buttonText}} e {{buttonTarget}}
                actions, // array de acoes. ex: [{buttonText: 'Clique aqui', buttonTarget: 'www.google.com'}]
                unsubscribeURL,
                labelAddress
            }
        */
        template = {...Message.template, ...template};
        const button = Message.getButtonFromTemplate(template.actions, template.buttonTemplate || Message.template.buttonTemplate );
        return Message.sendEmail(toMail, template.background, {
            subject,
            fields: {
                    ...template,
                    button: button || '',
                    lowerText: template.lowerText || '',
                    upperText: template.upperText || ''
                }
        }, mailConfig, {}, fromUserId);
    }

    static objectTostring(obj: Object, config: Object){
        let parsedText = '';
        Object.keys(obj).map((key) => {
            let newKey;
            const text = obj[key].replace(/(?:\r\n|\r|\n)/g, '<br/>');
            if (config.fields[key]) {
                newKey = config.fields[key];
            } else {
                newKey = key.substring(0, 1).toUpperCase() + key.substring(1).toLowerCase();
            }
            newKey = (key.toLowerCase() !== 'uppertext' && key.toLowerCase() !== 'lowertext') 
            ? `<b> ${newKey}: </b> `
            : ''
            parsedText += `${newKey} ${text}<br/>`;
        });
        return parsedText;
    }

    static parsestring(string: string, {fields}: Object){
        return string.split(/{{([\s\S]*?)}}/).map((t, i) => (i %2) !== 0 ? (fields[t] || ' ') : t).join('');
    }

    static objToHtml(content: Object | string, config: Object) {
        content = content || config.content;
        console.log('content1', content)
        if (typeof content === "object"){
            return Message.objectTostring(content, config);
        }
        console.log('content2', content)
        if (typeof content === 'string'){
            return Message.parsestring(content, config);
        }
    }
}

Message.setup({});
module.exports = Message;
