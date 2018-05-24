const Messages = require('./messageRepository');
const Message = require('./messageInstance');
const {INTEGER, STRING, DATE, JSON, TEXT} = require('sequelize');

const schema = {
    _id: {type: INTEGER, primaryKey: true, autoIncrement: true},
    fromUserId: {
        type: INTEGER,
        field: 'from_user_id',
    },
    messageKey: {
        type: STRING(64),
        field: 'message_key'
    },
    bodyText: {
        type: TEXT,
        field: 'body_text'
    },
    bodyHtml: {
        type: TEXT,
        field: 'body_html'
    },
    subject: STRING(128),
    toMail: {
        type: STRING(128),
        field: 'to_mail'
    },
    object: JSON,
    dateSent: {
        type: DATE,
        field: 'date_sent'
    },
    createdAt: {
        type: DATE,
        field: 'created_at'
    },
    updatedAt: {
        type: DATE,
        field: 'updated_at'
    }
};
Messages.setup('message', schema, Message);
module.exports = Messages.getModel();
