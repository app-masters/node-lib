// @flow
/* global test, expect, jest, jasmine, */

const SequelizeInstance = require('../lib/sequelize/sequelizeInstance');
const AMMailing = require('../lib/am-mailing');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 150000;

const config = require('./src/testConfig');
config.development.mail.auth.pass += 'c';

describe('Send a mail', () => {
    let sequelize = null;
    //
    // it('Send a valid mail', async () => {
    //     let info = await AMMailing.sendHtmlEmail(
    //         "tiago@tiagogouvea.com.br",
    //         "My great subject",
    //         "<p>A great html content</p>",
    //         config.development.mail);
    //     expect(info).not.toBe(null);
    // });
    //
    // it('Send not so valid mail', async () => {
    //     let info = await AMMailing.sendHtmlEmail(
    //         "notexists@appmasters.io",
    //         "My great subject",
    //         "<p>A great html content</p>",
    //         config.development.mail);
    //     expect(info).not.toBe(null);
    // });
    //
    // it('Send a invalid mail', async () => {
    //     try {
    //         let info = await AMMailing.sendHtmlEmail(
    //             "tiago@***.io",
    //             "My great subject",
    //             "<p>A great html content</p>",
    //             config.development.mail);
    //         expect(info).not.toBe(null);
    //     } catch (e){
    //         console.error(e);
    //         expect(e).toBeFalsy();
    //     }
    // });


    it('Send a invalid mail', async () => {
        try {
            let info = await AMMailing.sendHtmlEmail(
                "",
                "My great subject",
                "<p>A great html content</p>",
                config.development.mail);
            expect(info).not.toBe(null);
        } catch (e){
            console.error(e);
            expect(e).toBeFalsy();
        }
    });
});

