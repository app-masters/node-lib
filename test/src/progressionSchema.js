var restful = require('node-restful');
var mongoose = restful.mongoose;
var ObjectId = mongoose.Schema.Types.ObjectId;

let schema = {
    user: {type: ObjectId, ref: 'user'},
    weight: Number,
    waist: Number,
    image: String
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
mongoose.model('progression', mongooseSchema);

module.exports = mongooseSchema;
