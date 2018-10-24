// @flow
const nodemailer = require('nodemailer');
var htmlToText = require('nodemailer-html-to-text').htmlToText;
const AWS = require('aws-sdk');

class AMMailing {
    static config: Object;
    static sns: Object;
    static transporter: Object;

    static setup (config: Object): boolean {
        // Config
        if (config.AWS) {
            // AWS setup as process environment
            process.env['AWS_ACCESS_KEY_ID'] = config.AWS.accessKeyId;
            process.env['AWS_SECRET_ACCESS_KEY'] = config.AWS.secretAccessKey;
            process.env['AWS_REGION'] = config.AWS.region;
            AMMailing.sns = new AWS.SNS();
        } else if (config.mail) {
            AMMailing.config = config.mail;
            AMMailing.transporter = nodemailer.createTransport(config.mail);
        } else {
            throw new Error('No AWS and no mail config on AMMAiling setup');
        }
        return true;
    }

    static async sendEmail (to: String, subject: String, text: String, html: String, config: Object): Promise<boolean> {
        config = config || AMMailing.config;
        if (!config)
            throw new Error('You must give AMMAiling a config either in setup or as fifth argument!');

        const transporter = nodemailer.createTransport(config);

        const {from, fromName} = config;
        const fromNameLong = fromName + '<' + from + '>';
        let message = {
            from: fromNameLong,
            to,
            subject,
            html
        };
        if (text && text.length > 0) {
            message.text = text;
        } else {
            transporter.use('compile', htmlToText());
        }
        console.log(' > Sending mail...', message.to, message.subject);
        try {
            // let info = await transporter.sendMail(message);
            // console.log("AMMailing.sendHtmlEmail info - success????",info);
            return transporter.sendMail(message);
        } catch (e) {
            console.error('AMMailing.sendHtmlEmail exception', e);
            throw e;
        }
    }

    /**
     * Last sendEmail method.. it receives HTML as content, and must receive config (transport) each call
     * @param to
     * @param subject
     * @param html
     * @param config
     * @returns {Promise.<*>}
     */
    static async sendHtmlEmail (to: String, subject: String, html: String, transporConfig: Object): Promise<boolean> {
        // config = config || AMMailing.config;
        if (!transporConfig)
            throw new Error('You must pass a config as forth argument!');
        if (!transporConfig.host || !transporConfig.from || !transporConfig.fromName)
            throw new Error('Config passed in sendHtmlEmail have not required parans. Check it:', transporConfig);

        const transporter = nodemailer.createTransport(transporConfig);

        transporter.use('compile', htmlToText());
        const {from, fromName} = transporConfig;
        const fromNameLong = fromName + '<' + from + '>';
        let message = {
            from: fromNameLong,
            to,
            subject,
            html
        };
        console.log(' > Sending mail...', message.to, message.subject);
        try {
            // let info = await transporter.sendMail(message);
            // console.log("AMMailing.sendHtmlEmail info - success????",info);
            return await transporter.sendMail(message);
        } catch (e) {
            console.error('AMMailing.sendHtmlEmail exception', e);
            throw e;
        }
    }

    static async SendSMS (phone, text) {
        if (!AMMailing.sns)
            throw new Error('You must call AMMailing setup first');
        try {
            const smsDr = {
                'Message': text,
                'PhoneNumber': `+55${phone}`
            };
            AMMailing.sns.publish(smsDr, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(data);
                }
            });
        } catch (error) {
            global.rollbar && global.rollbar.error(error);
        }
    };

    static async addEmail (to, subject, text, html) {
        // return AMMailing.transporter.sendMail(message)
    }
}

AMMailing.config = null;

module.exports = AMMailing;
