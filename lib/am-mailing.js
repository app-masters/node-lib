const nodemailer = require('nodemailer');

class AMMailing {
    static setup (config) {
        AMMailing.config = config;
        AMMailing.transporter = nodemailer.createTransport(AMMailing.config);
    }

    static async sendEmail (to, subject, text, html) {
        if(!global.rollbar){
            throw new Error('Rollbar is not defined')
        }
        try {
            const from = AMMailing.config.fromName + '<' + AMMailing.config.from + '>';
            let message = {
                from,
                to,
                subject,
                text,
                html
            };
            return await AMMailing.transporter.sendMail(message);
        } catch (error) {
            console.error('Error on AM-Mailing: ', error);
        }

    }
};
module.exports = AMMailing;
