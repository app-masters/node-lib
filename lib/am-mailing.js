var restful = require('node-restful');
var nodemailer = require('nodemailer');
var Mustache = require('mustache');
var Rollbar = require('rollbar');
var CronJob = require('cron').CronJob;
var mongoose = restful.mongoose;

class AMMailing {
    static setup (config) {
        // Config
        AMMailing.smtpconfig = config.smtp;
        // AMMailing.message = config.mail.message;
        // Initialize queue
        AMMailing.transporter = nodemailer.createTransport(AMMailing.smtpconfig);
    }

    static async sendEmail (from, to, subject, text, html) {
        return new Promise((resolve, reject) => {
            let message = {
                from,
                to,
                subject,
                text,
                html
            };
           /*  message.replyTo = from;
            message.sender = from; */
            // console.log(message);
            AMMailing.transporter.sendMail(message, function (err, response) {
                if (err) {
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });
    }
};
module.exports = AMMailing;
