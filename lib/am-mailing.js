// @flow
const nodemailer = require('nodemailer');
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
            throw new Error("No AWS and no mail config on AMMAiling setup");
        }
        return true;
    }

    static async sendEmail (to, subject, text, html) {
        if (!AMMailing.config)
            throw new Error("You must call AMMailing setup first");
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
            if (global.rollbar)
                global.rollbar.error(error);
            else
                console.error(error);
        }
    }

    static async SendSMS (phone, text) {
        if (!AMMailing.sns)
            throw new Error("You must call AMMailing setup first");
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
