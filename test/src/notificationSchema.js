/*
Notification Schema, defines the user who will receive, what it is, type of interaction
if it was sended, received and seed - it has timestramp for all this fields.
*/
const restful = require('node-restful');
const softDelete = require('@app-masters/node-lib').amSoftDelete;
const mongoose = restful.mongoose;

const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = {
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    interactionType: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    sent: {
        type: Date
    },
    received: {
        type: Date
    },
    seen: {
        type: Date
    },
    schedule: {
        type: Date
    },
    user: {
        type: ObjectId,
        required: true,
        ref: 'user'
    },
    messageId: String
};

const options = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
};

const mongooseSchema = mongoose.Schema(schema, options);
mongooseSchema.plugin(softDelete);

const model = mongoose.model('notification', mongooseSchema);

module.exports = mongooseSchema;
