const nodemailer = require('nodemailer');
const {nodeMailerUtils} = require('./utils')

class AMMailing {
    static setup(config) {
        try {
            if (!nodeMailerUtils.hasMailerConfigs(config)) {
                throw new Error('SMTP configurations are empty.')
            }
            AMMailing.config = config;
            AMMailing.transporter = nodemailer.createTransport(AMMailing.config);
        } catch (error) {
            console.error('Error on AM-Mailing: ', error.message || error);
        }
    }

    static async sendEmail(to, subject, text, html) {
        try {
            if (!global.rollbar) {
                throw new Error('Rollbar is not defined')
            }
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
            console.error('Error on AM-Mailing: ', error.message || error);
        }

    }
};
module.exports = AMMailing;
