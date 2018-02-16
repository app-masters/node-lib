const restful = require('node-restful');

const mongoose = restful.mongoose;
const ObjectId = mongoose.Schema.Types.ObjectId;
const AMAuth = require('../../lib/am-auth');

const mongooseIt = require('@app-masters/mongoose-it').mongooseIt;

const schema = {
    name: String,
    local: {
        email: String,
        password: String,
        newPassWordRequestHash: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    role: {
        type: String,
        enum: ['user', 'editor', 'admin'],
        default: 'user'
    },
    data: {
        gender: String
    },
    notification: {
        android: {
            token: [String],
            date: Date,
            denied: Boolean
        },
        web: {
            token: [String],
            date: Date,
            denied: Boolean
        },
        ios: {
            token: [String],
            date: Date,
            denied: Boolean
        }
    }
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

// Setup user security
mongooseSchema.plugin(mongooseIt, 'user');

mongooseSchema = AMAuth.setupUserSchema(mongooseSchema);

mongoose.model('user', mongooseSchema);

module.exports = mongooseSchema;
