var restful = require('node-restful');
var mongoose = restful.mongoose;
var ObjectId = mongoose.Schema.Types.ObjectId;
const mongooseIt = require('@app-masters/mongoose-it').mongooseIt;

let schema = {
    userInvite: {type: ObjectId, ref: 'user'},
    email: {type: String},
    phone: {type: String},
    accepted: Boolean,
    acceptedAt: Date,
    userAccepted:{type: ObjectId, ref: 'user'},
    invitedBy: {type: ObjectId}
};
let options = {
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
