var restful = require('node-restful');
var mongoose = restful.mongoose;
var ObjectId = mongoose.Schema.Types.ObjectId;
var Mixed = mongoose.Schema.Types.Mixed;

let schema = {
    user: {type: ObjectId, ref: 'user'},
    messageKey: String,
    values: Mixed
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
mongoose.model('message', mongooseSchema);

module.exports = mongooseSchema;
