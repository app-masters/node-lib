var restful = require('node-restful');
var CronJob = require('cron').CronJob;
var mongoose = restful.mongoose;

var AMMailing = require('./am-mailing');

class AMInvite {
    static setup (config) {
        // Config
        AMInvite.config = config;
        AMInvite.model = mongoose.model('invitefriend');
        // Initialize queue
        AMInvite.queue = [];
        // AMInvite cron
        AMInvite.cron = new CronJob({
            cronTime: '00 30 11 * * 1-7',
            onTick: () => AMInvite.createQueue(),
            start: true,
            timeZone: 'America/Los_Angeles',
            runOnInit: true
        });
    }

    static createQueue () {
        AMInvite.model.find({inviteSent: {$exists: false}, error: {$exists: false} })
        .then(result =>{
            console.log(result);
            AMInvite.sendEmailInQueue(result);
        })
    }

    static updateModel (where, attribute) {
        return AMInvite.model.update(where, attribute);
    }

    static async sendEmailInQueue (queue) {
        for (let i = 0; i < queue.length; i++) {
            let person = queue[i];
            console.log('sending email to: ', person.email);
            const MESSAGE = 'Baixe agora o app Emagreça Já';
            const HTML = `<h1>Emagreça já</h1> <p>venha conferir nosso app</p> <a href="http://localhost:3000/api/invitation/${person._id}">Emagreça já</a>`;
            try {
                let success = await AMMailing.sendEmail(AMInvite.config.mail.from, person.email, 'convite', MESSAGE, HTML);
                /* console.log('----------------------------------------');
                console.log(success);
                console.log('----------------------------------------'); */

                await AMInvite.updateModel({email: person.email, inviteSent: {$exists: false}}, {inviteSent: new Date()});
                console.log('email sent to: ', person.email);
                console.log('emails left to be sent: ', queue.length - (i + 1));
            } catch (err) {
                console.log('AMInvite.sendEmailInQueue', err.message)

                if (err.message === 'No recipients defined') {
                    await AMInvite.updateModel({email: person.email}, {error: err.message});
                } else {
                    throw new Error(err);
                }
            }
        }
        console.log('All emails were sent');
    }
}
AMInvite.config =null;

module.exports = AMInvite;
