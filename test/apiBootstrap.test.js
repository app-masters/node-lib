//   Requires
const express = require('express');
const passport = require('passport');
const packag = require('../package');
const envs = require('./src/testConfig');
const app = express();
const apiBootstrap = require('../lib/apiBootstrap');
// const AMMailing = require('../lib/am-mailing');
require('./src/userSchema');
require('./src/inviteSchema');
require('./src/notificationSchema');

test('ApiBootstrap node-lib', () => {
    let resultSetup = apiBootstrap.setup(app, envs, packag, passport);
    expect(resultSetup).toBe(true);
    // 3 - Listen API
    let resultListem = apiBootstrap.listen(app);
    expect(resultListem).toBe(true);
});

// test('SendEmail node-lib', async () => {
// const testEmail = 'baraky.appmasters@gmail.com';
//     const code = '123123123';
//     const HTML = `<h1>WILLIM</h1> <p>Código para redefinir senha: ${code}</p>`;
//     const MESSAGE = `Código para redefinir senha: ${code}`;
//     const sendTo = testEmail;
//
// // send email
//     let result = null
//     try {
//         result = await AMMailing.sendEmail(sendTo, 'Willim: redefinir senha', MESSAGE, HTML);
//         console.log(result);
//     } catch (error) {
//         console.log(error);
//     }
//     expect(!!result).toBe(true);
// });
