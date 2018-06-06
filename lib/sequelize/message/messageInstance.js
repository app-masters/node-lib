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
    toMail: string;
    subject: string;

    constructor(obj: ?MessageObj): Message {
        console.log('>>>>', Messages);
        super(obj, Messages);
        // this.setBodyHtml(obj.bodyText);
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

    async send(): Promise<MessageObj> {
        // Validate this
        if (!this.toMail || !this.subject || !this.bodyHtml || !this.bodyText) {
            console.log(this);
            throw new Error("Message must have toMail, subject, bodyHtml and bodyText, to be sent");
        }
        try {
            await AMMailing.sendEmail(this.toMail, this.subject, this.bodyText, this.bodyHtml, this._mailConfig);
            this.dateSent = new Date();
        } catch (error) {
            global.rollbar && global.rollbar.error(error);
            console.error('failed to send mail:', error);
        }
        console.log('mail sent!')
        await this.save();

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
