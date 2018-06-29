const format = require("string-template");

class Messages {


    static get(key, params) {
        let message = null;
        if (messages[key])
            message = messages[key];


        console.log("msg1", message);
        console.log("params", params);
        if (message) {
            message.subject = format(message.subject, params);
            message.html = format(message.html, params);
            return message;
        }
        else
            throw new Error("MessageSequelize not found on Messages: " + key);
    }
}

Messages.INVITE = 'invite';

var messages = {
    invite: {
        subject: "Você acaba de receber um convite!",
        html: `Seu amigo {user.name} te convidou para usar o App XPTO.`
    }
};

module.exports = Messages;
