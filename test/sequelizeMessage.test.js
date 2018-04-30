// @flow
/* global test, expect, jest, jasmine, */

const Repository = require('../lib/sequelize/repository');
const Instance = require('../lib/sequelize/instance');
const SequelizeInstance = require('../lib/sequelize/sequelizeInstance');

const AMMailing = require('../lib/am-mailing');

let sequelize = null;

test('Sequelize configuration', () => {
    const host = 'ec2-54-204-45-43.compute-1.amazonaws.com';
    const database = ';;;;dbi1ijv2pstot1';
    const user = ';;;;wdwyogzyooqycm';
    const port = 5432;
    const password = ';;;;ce5878abe136f63d6c7114b926d4654d5d8e2ce515b45cfa271e2c1a4b8cf784';
    const url = `postgres://${user}:${password}@${host}:${port}/${database}`;

    const options = {
        forceSync: false, // Force database to be recreated
        logging: false, // Show SQL queries on terminal
        syncLogging: false // Show SQL queries used to sync
    };

    sequelize = SequelizeInstance.setup(url, options);
    expect(typeof sequelize).toBe('object');
    const instance = SequelizeInstance.getInstance();
    expect(instance).toBe(sequelize);
    expect(instance.isConnected()).toBe(sequelize);
});


jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;


// Repository
class Messages extends Repository {

    static getToSend() {
        return this.find({'dateSent': null}, '', 'createdAt');
    }
}

// Instance Declaration
const htmlToText = require('html-to-text');

// Schema
// $FlowFixMe
const {INTEGER, STRING, DATE, JSON, TEXT} = require('sequelize');

const schema = {
    _id: {type: INTEGER, primaryKey: true, autoIncrement: true},
    fromUserId: {
        type: INTEGER,
        field: 'from_user_id',
    },
    messageKey: {
        type: STRING(64),
        field: 'message_key'
    },
    bodyText: {
        type: TEXT,
        field: 'body_text'
    },
    bodyHtml: {
        type: TEXT,
        field: 'body_html'
    },
    subject: STRING(128),
    toMail: {
        type: STRING(128),
        field: 'to_maill'
    },
    object: JSON,
    dateSent: {
        type: DATE,
        field: 'date_sent'
    },
    createdAt: {
        type: DATE,
        field: 'created_at'
    },
    updatedAt: {
        type: DATE,
        field: 'updated_at'
    }
};

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

    constructor(obj: ?MessageObj): this {
        super(obj, Messages);
    }

    // setBody(body:String){
    //     if(!body) {
    //         throw new Error('Body required');
    //     }
    //
    //     this.htmlBody = this.toHtml(body, config);
    //     this.textBody = htmlToText.fromString(body);
    // }

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

    async send(): Promise<boolean> {
        // Validate this
        if (!this.toMail || !this.subject || !this.bodyHtml || !this.bodyText) {
            console.log(this);
            throw new Error("Message must have toMail, subject, bodyHtml and bodyText, to be sent");
        }

        // Sent
        const r = await AMMailing.sendEmail(this.toMail, this.subject, this.bodyText, this.bodyHtml);
        // console.log("r", r);

        this.dateSent = new Date();
        await this.save();
    }

    setTo(toMail): void {
        this.toMail = toMail;
    }

    setSubject(subject): void {
        this.subject = subject;
    }
}

test('Setup Message Repository', () => {
    Messages.setup('message', schema, Message, /*{forceSync: true}*/);
    Messages.flush();
});

test('Create and save a message', async () => {
    // to, subject, fields, body
    // simulates the req, res, next objects
    let message = new Message();
    message.setObject({messageKey: 'feedback', another: 'oneAttribute'});
    message.setMessageKey('feedback');
    message.setBodyHtml('<h1>Feedback</h1><br><p>Aplicativo muito sólido<br/>Funciona muito bem REALMENTE!<br/>Tô realmente satisfeito</p>');
    message.setFromUserId(33);
    message.setTo('tiago@tiagogouvea.com.br');
    message.setSubject('Email test');
    try {
        await message.save();
    } catch (e) {
        global.rollbar.log(e);
        console.error(">>>>>>", e);
    }
    console.log(message._id);
    expect(message._id).not.toBeNull();
});


test('Setup AMAiling', () => {
    const config = require('./src/testConfig');
    config.development.mail.auth.pass += 'c';
    const result = AMMailing.setup(config.development);
    expect(result).toBe(true);
});

test('Send messages in queue', async () => {
    let messages = await Messages.getToSend();
    expect(messages.length).toBeGreaterThan(0);

    for (let message of messages) {
        message.name = "Tiago";
        await message.send();
    }

    messages = await Messages.getToSend();
    expect(messages.length).toBe(0);
});

