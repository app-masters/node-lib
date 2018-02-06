var restful = require('node-restful');
var nodemailer = require('nodemailer');
var Mustache = require('mustache');
var Rollbar = require('rollbar');
var CronJob = require('cron').CronJob;
var mongoose = restful.mongoose;

class AMMailing {
    static setup (config) {
        // Config
        AMMailing.config = config;
        // AMMailing.message = config.mail.message;
        // Initialize queue
        AMMailing.transporter = nodemailer.createTransport(AMMailing.config);
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
            if (global.rollbar) {
                global.rollbar.error(error);
            } else {
                console.error('Error on AM-Mailing and Rollbar is not defined. Error', error);
            }
        }

    }

    static async addEmail (to, subject, text, html) {
        // return AMMailing.transporter.sendMail(message)
    }
};
module.exports = AMMailing;
