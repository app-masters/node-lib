const restful = require('node-restful');
const mongoose = restful.mongoose;
const AMAuth = require('../../lib/am-auth');

const mongooseIt = require('@app-masters/mongoose-it').mongooseIt;

const schema = {
    title: String
};

const options = {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    toObject: {virtuals: true},
    toJSON: {virtuals: true},
    new: true
};

let mongooseSchema = mongoose.Schema(schema, options);

mongoose.model('role', mongooseSchema);

module.exports = mongooseSchema;
