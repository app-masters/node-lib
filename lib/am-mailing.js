var restful = require('node-restful');
var nodemailer = require('nodemailer');
var Mustache = require('mustache');
var Rollbar = require('rollbar');
var CronJob = require('cron').CronJob;
var mongoose = restful.mongoose;
const AWS = require('aws-sdk');

class AMMailing {
    static setup (config) {
        // Config
        if (config.AWS) {
            // AWS setup as process environment
            process.env['AWS_ACCESS_KEY_ID'] = config.AWS.accessKeyId;
            process.env['AWS_SECRET_ACCESS_KEY'] = config.AWS.secretAccessKey;
            process.env['AWS_REGION'] = config.AWS.region;
            AMMailing.sns = new AWS.SNS();
        }
        if (config.mail) {
            AMMailing.config = config;
            AMMailing.transporter = nodemailer.createTransport(AMMailing.config);
        }
    }

    static async sendEmail (to, subject, text, html) {
        try {
            const from = AMMailing.config.fromName + '<' + AMMailing.config.from + '>';
            let message = {
                from,
                to,
                subject,
                text,
                html
            };
            const email = await AMMailing.transporter.sendMail(message);
            return email;
        } catch (error) {
            global.rollbar.error(error);
        }
    }

    static async SendSMS (phone, text) {
        try {
            var smsDr = {
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
};
module.exports = AMMailing;
