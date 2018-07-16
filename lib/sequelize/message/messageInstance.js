const Instance = require('../instance');
const htmlToText = require('html-to-text');
const Messages = require('./messageRepository');
const AMMailing = require('../../am-mailing');

type MessageObj = $Exact<{
    ...{
        _id: number;
        fromUserId: number;
        bodyHtml: string;
        bodyText: string;
        object: Object;
        messageKey: string;
        dateSent: Date;
        dateError: Date;
        error: string;
        toMail: string;
        subject: string;
    }
}>

class Message extends Instance {
    _id: number;
    fromUserId: number;
    bodyHtml: string;
    bodyText: string;
    object: Object;
    messageKey: string;
    dateSent: Date;
    dateError: Date;
    error: string;
    toMail: string;
    subject: string;

    constructor(obj: ?MessageObj): Message {
        super(obj, Messages);
    }

    setBodyHtml(body: string): void {
        if (!body) {
            throw new Error('Body required');
        }

        this.bodyHtml = body;
        this.bodyText = htmlToText.fromString(body);
    }

    setFromUserId(userId: number): void {
        this.fromUserId = userId;
    }

    setMessageKey(messageKey: string): void {
        this.messageKey = messageKey;
    }

    setObject(object: Object): void {
        this.object = object;
        this.notExists = true;
    }

    async send(transportConfig: Object): Promise<MessageObj> {
        // Validate this
        if (!transportConfig) {
            throw new Error("MessageInstance.send must receive the transportConfig");
        }
        if (!this.toMail) {
            console.log(this);
            throw new Error("Message Instance must have toMail to be sent", this);
        }
        if (!this.subject) {
            console.log(this);
            throw new Error("Message Instance must have subject to be sent", this);
        }
        if (!this.bodyHtml) {
            console.log(this);
            throw new Error("Message Instance must have bodyHtml to be sent", this);
        }
        try {
            let info = await AMMailing.sendHtmlEmail(this.toMail, this.subject, this.bodyHtml, transportConfig);
            this.dateSent = new Date();
        } catch (error) {
            this.dateError = new Date();
            this.error = error.message;
            global.rollbar && global.rollbar.error(error);
            console.error('failed to send mail:', error);
        }
        console.log(' > Mail sent!');
        await this.save();
        console.log(this);

        return this;
    }

    setTo(toMail): void {
        this.toMail = toMail;
    }

    setSubject(subject): void {
        this.subject = subject;
    }
}

module.exports = Message;
