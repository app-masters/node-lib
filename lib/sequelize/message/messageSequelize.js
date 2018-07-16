// @flow

let MessageInstance;

class MessageSequelize {
    static transportConfig: Object;
    static messagesConfig: Object;
    static template: Object;

    static setup(transportConfig: Object, messagesConfig: Object): void {
        if (transportConfig)
            this.setTransportConfig(transportConfig);
        if (messagesConfig)
            this.setMessagesConfig(messagesConfig);
        this.setupSchemaModel();
    }

    static setTransportConfig(transportConfig) {
        // Validate
        if (!transportConfig.host)
            throw new Error("First MessageSequelize param must just transportConfig. Received:" + JSON.stringify(transportConfig));
        // Set it
        MessageSequelize.transportConfig = transportConfig;
    }

    static setMessagesConfig(messagesConfig) {
        // Validate
        if (messagesConfig.host || messagesConfig.mail)
            throw new Error("Secong MessageSequelize param must have just messages, not the merged with transportConfig. Received: " + JSON.stringify(messagesConfig));
        // Set it
        MessageSequelize.messagesConfig = messagesConfig;
    }

    static setTemplate(template: Object): void {
        MessageSequelize.template = template;
    }


    /**
     * It must be called lazilly, because lib starts before sequelize and other things
     * Setup will happen just when really needed
     */
    static setupSchemaModel() {
        require('./messageSchema');
        MessageInstance = require('./messageInstance');
    }


    /**
     * Add a HTML message to database and send it using transportConfig
     * @param toMail
     * @param subject
     * @param bodyHtml
     * @param fromUserId
     * @param replaceFields
     * @param transportConfig
     * @returns {Promise.<*>}
     */
    static async sendHtmlMessage(toMail, subject, bodyHtml, fromUserId, replaceFields, transportConfig) {
        if (!transportConfig)
            throw new Error('A transportConfig must be passed on MessageSequelize.sendHtmlMessage forth parameter');
        if (!toMail || !subject || !bodyHtml)
            throw new Error('You must pass toMail, subject and bodyHtml on MessageSequelize.sendHtmlMessage');

        // Construct bodyHtml with template
        bodyHtml = this.applyTemplate(bodyHtml, replaceFields);

        const messageInstance = new MessageInstance({
            toMail,
            subject: MessageSequelize.parseString(subject, replaceFields),
            fromUserId,
        });
        messageInstance.setBodyHtml(MessageSequelize.parseString(bodyHtml, replaceFields, true));
        await messageInstance.send(transportConfig);
        return messageInstance;
    }


    /**
     * Add a Object message (converted to HTML) to database and send it using transportConfig
     * @param messageKey
     * @param toMail
     * @param fromUserId
     * @param replaceFields
     * @param transportConfig
     * @returns {Promise.<*>}
     */
    static async sendObjectMessage(messageKey: string, toMail: string, fromUserId, replaceFields, transportConfig: Object) {
        if (!transportConfig)
            throw new Error('A transportConfig must be passed on MessageSequelize.sendHtmlMessage forth parameter');
        if (!messageKey)
            throw new Error('You must pass messageKey to MessageSequelize.sendHtmlMessage');

        const messageConfig = MessageSequelize.getMessageConfig(messageKey);
        if (!messageConfig) {
            throw new Error('messageKey not found: ' + messageKey);
        }

        let bodyHtml = MessageSequelize.objToHtml(messageConfig.content, {
            ...messageConfig,
            fields: {...messageConfig.fields,...replaceFields}
        });

        // Construct bodyHtml with template
        bodyHtml = this.applyTemplate(bodyHtml, replaceFields, messageConfig.actions);

        const messageInstance = new MessageInstance({
            toMail: toMail || messageConfig.toMail,
            subject: MessageSequelize.parseString(messageConfig.subject, replaceFields),
            fromUserId,
        });
        messageInstance.setBodyHtml(MessageSequelize.parseString(bodyHtml, replaceFields, true));
        await messageInstance.send(transportConfig);
        return messageInstance;
    }


    /**
     * Load a messageKey from messages
     * @param messageKey
     * @returns {Object}
     */
    static getMessageConfig(messageKey: string | Object): Object {
        if (typeof messageKey === 'string') {
            // config must be in the MessageSequelize.config fields!
            const config = MessageSequelize.messagesConfig[messageKey];
            if (!config) {
                throw new Error(`Config ${messageKey} not found!`);
            }
            return config;
        } else if (typeof messageKey === 'object') {
            return messageKey;
        }

        throw new Error('MessageConfig not found');
    }

    /**
     * Receives a HTML and return it with template (it defined)
     * @param toMail
     * @param bodyHtml
     * @param replaceFields
     * @param actions
     * @returns {*}
     */
    static applyTemplate(bodyHtml: String, replaceFields: Object, actions: Array<Object>): String {
        if (MessageSequelize.template) {
            const button = MessageSequelize.getButtonFromTemplate(actions, MessageSequelize.template.buttonTemplate);
            const mustParse = {
                ...replaceFields,
                upperText: bodyHtml,
                button
            };
            bodyHtml = MessageSequelize.parseString(MessageSequelize.template.layout, mustParse);
        }
        return bodyHtml;
    }

    /**
     * Turn a object into a HTML
     * @param content
     * @param config
     * @returns {*}
     */
    static objToHtml(content: Object | string, config: Object) {
        content = content || config.content;
        // console.log('content1', content);
        if (typeof content === "object") {
            return MessageSequelize.objectTostring(content, config);
        }
        // console.log('content2', content);
        if (typeof content === 'string') {
            return MessageSequelize.parseString(content, config.fields);
        }
    }

    /** Helper to objToHtml **/
    static parseString(value: string, fields: Object, shouldCleanHtml: boolean) {
        return value.split(/{{([\s\S]*?)}}/).map((t, i) => (i % 2) !== 0 ? (fields[t] || (shouldCleanHtml ? '' : '{{'+t+'}}')) : t).join('');
    }

    /** Helper to objToHtml **/
    static objectTostring(obj: Object, config: Object) {
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
                : '';
            parsedText += `${newKey} ${text}<br/>`;
        });
        return parsedText;
    }

    /**
     * Create buttons from template
     * @param actions
     * @param buttonTemplate
     * @returns {string}
     */
    static getButtonFromTemplate(actions: Array<Object>, buttonTemplate: string): string {
        return (actions || []).map(act => MessageSequelize.parseString(buttonTemplate, act)).join('');
    }

    static async getToSend() {
        const MessageRepository = require('./messageRepository');
        return await MessageRepository.getToSend();
    }

}

module.exports = MessageSequelize;