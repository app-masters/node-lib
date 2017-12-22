// Same file at mongoose-it and node-lib - keep sync
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

let dbUrl = "mongodb://127.0.0.1/node-lib_test_db";
let connection, Foo, Bar;

function createConnectionAndSchemas(plugin) {
    connection = mongoose.createConnection(dbUrl);
    let result = createSchemas(connection,plugin);
    result.connection = connection;
    return result;
}

function createSchemas(connection, plugin) {
    // Bar model
    let barSchema = Schema({name: String});
    if (plugin)
        barSchema.plugin(plugin);
    Bar = connection.model('bar', barSchema);
    // Foo model
    let fooSchema = Schema({name: String, age: Number, bar: {type: ObjectId, ref: 'bar'}});
    if (plugin)
        fooSchema.plugin(plugin);
    Foo = connection.model('foo', fooSchema);
    return {Foo, Bar};
}

// Create some test records
async function createRecords(number) {
    let records = [];
    for (let i = 0; i < number; i++) {
        // Bar
        let bar = new Bar({name: "Bar " + i + " " + new Date().toISOString()});
        let barRecord = await bar.save();
        // Foo
        let foo = new Foo(
            {
                name: "Foo " + i + " " + new Date().toISOString(),
                age: Math.floor((Math.random() * 100) + 1),
                bar: barRecord
            });
        let record = await foo.save();
        records.push(record);
    }
    return number === 1 ? records[0] : records;
}

// Create some test records
async function createUserRecords(number) {
    let records = [];
    let User = mongoose.model('user');
    for (let i = 0; i < number; i++) {
        let emailPassword = "user_" + i + "_" + new Date().toISOString() + "@gmail.com";
        let user = new User(
            {
                name: "User " + i + " " + new Date().toISOString(),
                'local.email': emailPassword, 'local.password': emailPassword
            }
        );
        console.log("USER before save", user);
        user = await User.create(user);
        console.log("USER after save", user);
        records.push(user);
    }
    return number === 1 ? records[0] : records;
}
// // Create some test records
// async function createUserRecords(number) {
//     let records = [];
//     let User = connection.model('user');
//     for (let i = 0; i < number; i++) {
//         let emailPassword = "user_" + i + "_" + new Date().toISOString() + "@gmail.com";
//         let user = new User(
//             {
//                 name: "User " + i + " " + new Date().toISOString(),
//                 'local.email': emailPassword, 'local.password': emailPassword
//             }
//         );
//         console.log("USER before save", user);
//         user = await User.create(user);
//         console.log("USER after save", user);
//         records.push(user);
//     }
//     return number === 1 ? records[0] : records;
// }

module.exports = {
    createConnectionAndSchemas: createConnectionAndSchemas,
    createSchemas: createSchemas,
    createRecords: createRecords,
    createUserRecords: createUserRecords
};