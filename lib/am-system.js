const mongoose = require('mongoose');

module.exports = function () {
    let result = {};

    result.env = {"NODE_ENV":process.env.NODE_ENV};
    result.config = global.config; //!!!!!! @todo Remove passwords
    result.node = {};
    result.mongoose = {};
    result.mongo = {};

    // Mongoose
    status.mongoose.readyState = mongoose.connection.readyState;

    // Mongo
    mongoose.connection.db.listCollections().toArray((err, names) => {
        let collections = [];
        names.map(col => {
            let name = col.name;
            // console.log(name);
            mongoose.connection.db.collection(col.name).count().then(count => {
                // console.log('count',count);
                let obj = {collection: name, records: count};
                collections.push(obj);
                if (collections.length == names.length) {
                    status.mongo.collections = collections;
                    res.send(status);
                }
            });
        });
    });
};