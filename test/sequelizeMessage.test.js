// @flow
/* global test, expect, jest, jasmine, */

const SequelizeInstance = require('../lib/sequelize/sequelizeInstance');
const AMMailing = require('../lib/am-mailing');

let Message;// = require('../lib/sequelize/message');
let Messages; // = require('../lib/sequelize/message/messageRepository');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;


describe('Sequelize setup and connection', () => {
    let sequelize = null;

    let response;
    const config = require('./src/testConfig');
    config.development.mail.auth.pass += 'c';
    AMMailing.setup(config.development);


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
            forceSync: true, // Force database to be recreated
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

    it('Setup Message Repository', async (done) => {
        Message = require('../lib/sequelize/message');
        // Messages = require('../lib/sequelize/message/messageRepository');
        // require('../lib/sequelize/message/messageSchema');

        // await Messages.flush();
        done(expect(true).toBe(true));
    });
});

const mailConfig = {
    label_contact: {
        toMail: 'piubello_bass@hotmail.com',
        subject: 'subject',
        fields: {
            name: 'nome',
            email: 'zararata'
        }
    }
};

describe('Create a message and send', () => {

    test('Setup Message', async () => {
        Message.setup(mailConfig);
        return expect(Message.config).not.toBeNull();
    });
    test('Send Message without forcing config', async () => {
        try {
            const userId = 1;
            const res = await Message.sendEmail({
                name: 'hello',
                email: 'blabla',
                coisa: 'yes'
            }, 'label_contact', userId);
            expect(res.fromUserId).toBe(userId);
            expect(res._id).toBeTruthy();
            expect(res.createdAt).toBeTruthy();
            expect(res.toMail).toBeTruthy();
            expect(res.dateSent).toBeTruthy();
        } catch (e) {
            expect(e).toBeFalsy();
        } finally {

        }
    });

    test('Send Message forcing config', async () => {
        try {
            const userId = 1;
            const res = await Message.sendEmail({name: 'hello', email: 'blabla', coisa: 'yes'}, {
                toMail: 'piubello_bass@hotmail.com',
                subject: 'subject',
                fields: {
                    name: 'name2',
                    email: 'email2'
                }
            }, userId);
            expect(res.fromUserId).toBe(userId);
            expect(res._id).toBeTruthy();
            expect(res.createdAt).toBeTruthy();
            expect(res.toMail).toBeTruthy();
            expect(res.dateSent).toBeTruthy();
        } catch (e) {
            expect(e).toBeFalsy();
        } finally {

        }
    });

    test('Send Message forcing config with template', async () => {
        try {
            const userId = 1;
            const res = await Message.sendEmail("tiago@tiagogouvea.com.br","Teste com HTML","Olá amigo!","<p>Olá amigo!</p>");
            expect(res.fromUserId).toBe(userId);
            expect(res._id).toBeTruthy();
            expect(res.createdAt).toBeTruthy();
            expect(res.toMail).toBeTruthy();
            expect(res.dateSent).toBeTruthy();
        } catch (e) {
            expect(e).toBeFalsy();
        } finally {

        }
    });
});
