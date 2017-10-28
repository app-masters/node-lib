const mongoose = require('mongoose');

status = async function () {
    let result = {};

    result.env = {"NODE_ENV": process.env.NODE_ENV};
    result.config = global.config; //!!!!!! @todo Remove passwords
    result.node = {};
    result.mongoose = {};
    result.mongo = {};

    // Mongoose
    result.mongoose.readyState = mongoose.connection.readyState;

    // Mongo
    if (result.mongoose.readyState===1) {
        result.mongo.collectionsCount = {};
        let collections = await mongoose.connection.db.listCollections();
        let names = await collections.toArray();
        for (let col of names) {
            let name = col.name;
            let count = await mongoose.connection.db.collection(col.name).count();
            // console.log('count',count);
            let obj = {collection: name, records: count};
            result.mongo.collectionsCount[name] = count; //.push(obj);
        }
    }

    return result;
};

module.exports = {
    status: status
};