const restful = require('node-restful');
const mongooseIt = require('@app-masters/mongoose-it').mongooseIt;
const mongoose = restful.mongoose;
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = {
    user: {type: ObjectId, ref: 'user'},
    main: Boolean,

    // If main, count the clicks on the link
    clickCount: {
        type: Number,
        min: 0,
        default: 0
    },
    clicks: [{type: Date}],

    // If not main, invite is linked to another person
    userAccepted: {type: ObjectId, ref: 'user'},
    name: {type: String},
    email: {type: String},
    phone: {type: String},
    accepted: Boolean,
    acceptedAt: {type: Date},
    inviteSent: {type: Date}
};

const options = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
};

var mongooseSchema = mongoose.Schema(schema, options);
mongooseSchema.plugin(mongooseIt);
mongoose.model('invite', mongooseSchema);

module.exports = mongooseSchema;
