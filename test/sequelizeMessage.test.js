// @flow
/* global test, expect, jest, jasmine, */

const SequelizeInstance = require('../lib/sequelize/sequelizeInstance');
const AMMailing = require('../lib/am-mailing');
const md5 = require('md5');
let Message;
let MessageSequelize;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;

const config = require('./src/testConfig');
config.development.mail.auth.pass += 'c';

describe('Sequelize setup and connection', () => {
    let sequelize = null;

    it('Sequelize connection', async (done) => {
        // banco dev Felipe
        const host = 'ec2-54-225-96-191.compute-1.amazonaws.com';
        const database = 'd1a9elst8fge1q';
        const user = 'yodcucpuzivmmj';
        const port = 5432;
        const password = 'f347ac2727cccac75273fc0d268153b63a702eccfebe1f6f1b0aa76b1d280f28';
        const url = `postgres://${user}:${password}@${host}:${port}/${database}`;

        /*
        // banco dev tiago
        const host = 'ec2-54-204-45-43.compute-1.amazonaws.com';
        const database = 'dbi1ijv2pstot1';
        const user = 'wdwyogzyooqycm';
        const port = 5432;
        const password = 'ce5878abe136f63d6c7114b926d4654d5d8e2ce515b45cfa271e2c1a4b8cf784';
        const url = `postgres://${user}:${password}@${host}:${port}/${database}`;
        */

        const options = {
            forceSync: false, // Force database to be recreated
            logging: false, // Show SQL queries on terminal
            syncLogging: false, // Show SQL queries used to sync
            dialectOptions: {
                ssl: true
            }
        };

        sequelize = await SequelizeInstance.setup(url, options);
        if (SequelizeInstance.isConnected()) {
            expect(typeof sequelize).toBe('object');
            const instance = SequelizeInstance.getInstance();
            expect(instance).toBe(sequelize);
        }

        done(expect(SequelizeInstance.isConnected()).toBe(true));
    });

    it('Setup MessageSequelize Repository', async (done) => {
        Message = require('../lib/sequelize/message/messageInstance');
        // Messages = require('../lib/sequelize/message/messageRepository');
        // require('../lib/sequelize/message/messageSchema');

        // await Messages.flush();
        done(expect(true).toBe(true));
    });
});


describe('Setup MessageSequelize (model, schema)', () => {

});


describe('Create a message and send', () => {

    // Some configs
    const transportConfig = config.development.mail;
    const messagesConfig = {
        label_contact: {
            subject: 'Message object subject',
            fields: {
                name: 'Nome'
            }
        }
    };

    const htmlTemplate = require('../lib/sequelize/message/htmlEmail');
    const toMail = "tiago@tiagogouvea.com.br";
    const emailHash = md5(toMail);
    const replaceFields = {
        labelAddress: "My house is your house",
        unsubscribeUrl: "http://www.appmasters.io/unsubscribe/"+emailHash+"/"
    };


    test('Setup model and schema - Messages', async () => {
        MessageSequelize = require('../lib/sequelize/message');
        MessageSequelize.setup(); // will start schema and model
    });
    //
    // test('Create a Message and sent it with transportConfig', async () => {
    //     try {
    //         Message = require('../lib/sequelize/message/messageInstance');
    //
    //         let message = new Message();
    //         message.toMail = "tiago@tiagogouvea.com.br";
    //         message.subject = "Another message";
    //         message.bodyHtml = "<p>We need must have <b>a body</b></p>";
    //         await message.send(transportConfig);
    //
    //         expect(message.dateSent).not.toBeNull();
    //     } catch (e) {
    //         console.error(e);
    //         expect(e).toBeFalsy();
    //     }
    // });
    //
    //
    // test('Create a Message with HTML over MessageSequelize and sent with transportConfig', async () => {
    //     try {
    //         Message = require('../lib/sequelize/message/messageInstance');
    //
    //         let message = await MessageSequelize.sendHtmlMessage(
    //             "tiago@tiagogouvea.com.br",
    //             "Great subject",
    //             "<p>You must see that <b>body</b> content</p>",
    //             null,
    //             transportConfig
    //         );
    //
    //         expect(message.dateSent).not.toBeNull();
    //     } catch (e) {
    //         console.error(e);
    //         expect(e).toBeFalsy();
    //     }
    // });
    //
    test('Create a Message with Object over MessageSequelize and sent with transportConfig', async () => {
        try {
            Message = require('../lib/sequelize/message/messageInstance');
            MessageSequelize.setTemplate(htmlTemplate);
            MessageSequelize.setMessagesConfig(messagesConfig);

            const contentObj = {
                name: "Tiago",
                city: "Juiz de Fora"
            };

            let message = await MessageSequelize.sendObjectMessage(
                "label_contact",
                "tiago@#.com.br",
                null,
                replaceFields,
                transportConfig
            );

            expect(message.dateSent).not.toBeNull();
        } catch (e) {
            console.error(e);
            expect(e).toBeFalsy();
        }
    });

    test('Create a Message with template and sent with transportConfig', async () => {
        try {
            Message = require('../lib/sequelize/message/messageInstance');
            MessageSequelize.setTemplate(htmlTemplate);

            let message = await MessageSequelize.sendHtmlMessage(
                toMail,
                "Email with template",
                "<p>This <b>is a email with</b> template.</p>",
                null,
                replaceFields,
                transportConfig
            );

            expect(message.dateSent).not.toBeNull();
        } catch (e) {
            console.error(e);
            expect(e).toBeFalsy();
        }
    });


});