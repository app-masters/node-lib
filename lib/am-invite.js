var restful = require('node-restful');
var CronJob = require('cron').CronJob;
var mongoose = restful.mongoose;

var AMMailing = require('./am-mailing');
var messages = require('./messages');

/*
    @todo
    [ ] - Provide invite stats to admin
    [ ] - Check if email is already a user
 */

class AMInvite {
    static setup(config) {
        // Validate
        // Check for mongooseit
        if (process.env.NODE_ENV !== 'test' && typeof mongoose.model('invite').findIt === "undefined") {
            throw new Error("You must use mongooseit plugin on you \"invite\" schema");
        }
        // Config
        AMInvite.config = config;
        AMInvite.model = mongoose.model('invite');

        // Initialize queue
        // AMInvite.queue = [];
        // AMInvite cron
        // AMInvite.cron = new CronJob({
        //     cronTime: '00 30 11 * * 1-7',
        //     onTick: () => AMInvite.createQueue(),
        //     start: true,
        //     timeZone: 'America/Los_Angeles',
        //     runOnInit: true
        // });

        return true;
    }

    static isActive() {
        return AMInvite.config !== null;
    }

    static setAcceptCallback(cb) {
        AMInvite.acceptCallback = cb;
    }

    static async getUserLink(user) {
        let connection = mongoose.connection;
        const Invite = connection.model('invite');
        // Check if user have some invite
        let invite = await Invite.findOne({userInvite:user});
        // console.log("inv1",invite);
        if (!invite){
            // Invite it!
            invite = {
                userInvite: user
            };
            invite = await Invite.create(invite);
            // console.log("inv2",invite);
        }
        // console.log("inv3",invite);

        // singleUserLink: true,
        //     baseUrlAndRoute: http://publicurl.com/invite/

        let url = AMInvite.config.baseUrlAndRoute+invite._id.toString();

        return url;
    }

    static async addInvite(user, emailToInvite, phoneToInvite) {
        try {
            let connection = mongoose.connection;
            const Invite = connection.model('invite');

            // Check if email or phone already invited
            let existingInvite = await AMInvite.findInviteByEmailPhone(emailToInvite, phoneToInvite);
            // console.log(" >> invite << ",existingInvite);

            if (existingInvite)
                return existingInvite;

            // Check if email is already a user - @TODO

            // Invite it!
            let invite = {
                userInvite: user,
                email: emailToInvite,
                phone: phoneToInvite
            };

            invite = await Invite.create(invite);

            if (AMInvite.config.sendEmail && emailToInvite){
                console.log('adding email to: ', emailToInvite);
                let obj = {user};
                let message = messages.get(messages.INVITE,obj);
                console.log("message",message);
                let email = AMMailing.addEmail(emailToInvite,message.subject,message.text, message.html);
            }

            return invite;
        } catch (e) {
            console.error(e);
        }
    }

    static async addInvites(user, personsToInvite) {
        let invites = [];
        for (let person of personsToInvite) {
            invites.push(await AMInvite.addInvite(user, person.email, person.phone));
        }
        return invites;
    }

    /**
     * Check if user was invited, if true, do some things.
     */
    static async checkInvite(user) {
        let invite = await AMInvite.findInviteByEmailPhone(user.local.email);
        // console.log("invite",invite);
        if (invite) {
            AMInvite.accept(invite, user);
        }
    }

    static async findInviteByEmailPhone(email, phone) {
        let connection = mongoose.connection;
        const Invite = connection.model('invite');

        // Check if email already invited
        if (email) {
            let emailInvite = await Invite.findOne({email: email});
            if (emailInvite)
                return emailInvite;
        }

        // Check if phone already invited
        if (phone) {
            let phoneInvite = await Invite.findOne({phone: phone});
            if (phoneInvite)
                return phoneInvite;
        }

        return null;
    }

    static async accept(invite, newUser) {
        let connection = mongoose.connection;
        const Invite = connection.model('invite');

        let find = {'_id': invite};
        let obj = await Invite.findOne(find);

        if (obj.accepted) {
            // Another user accepted the invite. Create a new one.
            let invite = {
                userInvite: obj.userInvite
            };
            obj = await Invite.create(invite);
            find = {'_id': obj._id};
        }

        obj.accepted = true;
        obj.acceptedAt = new Date();
        obj.userAccepted = newUser;
        invite = await Invite.findItOneAndUpdate(find, obj);

        if (AMInvite.acceptCallback)
            AMInvite.acceptCallback(invite);

        return invite;
    }

    // static createQueue() {
    //     AMInvite.model.find({inviteSent: {$exists: false}, error: {$exists: false}})
    //         .then(result => {
    //             console.log(result);
    //             AMInvite.sendEmailInQueue(result);
    //         })
    // }
    //
    // static updateModel(where, attribute) {
    //     return AMInvite.model.update(where, attribute);
    // }
    //
    // static async sendEmailInQueue(queue) {
    //     for (let i = 0; i < queue.length; i++) {
    //         let person = queue[i];
    //         console.log('sending email to: ', person.email);
    //         const MESSAGE = 'Baixe agora o app Emagreça Já';
    //         const HTML = `<h1>Emagreça já</h1> <p>venha conferir nosso app</p> <a href="http://localhost:3000/api/invitation/${person._id}">Emagreça já</a>`;
    //         try {
    //             let success = await AMMailing.sendEmail(person.email, 'convite', MESSAGE, HTML);
    //             /* console.log('----------------------------------------');
    //             console.log(success);
    //             console.log('----------------------------------------'); */
    //
    //             await AMInvite.updateModel({
    //                 email: person.email,
    //                 inviteSent: {$exists: false}
    //             }, {inviteSent: new Date()});
    //             console.log('email sent to: ', person.email);
    //             console.log('emails left to be sent: ', queue.length - (i + 1));
    //         } catch (err) {
    //             console.log('AMInvite.sendEmailInQueue', err.message)
    //
    //             if (err.message === 'No recipients defined') {
    //                 await AMInvite.updateModel({email: person.email}, {error: err.message});
    //             } else {
    //                 throw new Error(err);
    //             }
    //         }
    //     }
    //     console.log('All emails were sent');
    // }



}

AMInvite.config = null;
AMInvite.model = null;

module.exports = AMInvite;
