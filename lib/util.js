const restful = require('node-restful');
const mongoose = restful.mongoose;

class util {
    // Save detail records from array, setting the masterKey on each record
    static saveDetailRecords (masterRecord, masterKey, detailRecords, modelName, masterAttribute) {
        return new Promise((fulfill, reject) => {
                // Save options
                // console.log('detailRecords', detailRecords);
            if (detailRecords) {
                let newRecords = detailRecords.filter(detail => {
                    return detail[masterKey] === undefined || detail[masterKey] === null;
                });
                let existingRecords = detailRecords.filter(detail => {
                    return newRecords.indexOf(detail) < 0;
                });

                    // console.log('saveDetailRecords.newRecords', newRecords.length);
                    // console.log('saveDetailRecords.existingRecords', existingRecords.length);

                let model = mongoose.model(modelName);

                    // Objetcts with masterKey, must be updated
                let updateRecords = new Promise((ok, err) => {
                    if (existingRecords.length === 0) {
                        ok();
                    } else {
                                // do update
                        let bulk = model.collection.initializeUnorderedBulkOp();
                        existingRecords.map(record => {
                            let id = new mongoose.Types.ObjectId(record._id);
                            let obj = {"_id": id};
                            delete record["_id"];
                            record[masterAttribute] = masterRecord[masterKey];
                            bulk.find(obj).updateOne({$set: record});
                        });
                        bulk.execute((err, bb) => {
                            if (err) {
                                console.log('err', err);
                                reject(err);
                            } else {
                                        // console.log('bb.nModified', bb.nModified);
                                        // console.log('bb.nMatched', bb.nMatched);
                                ok();
                            }
                        });
                    }
                }
                    );

                    // Objects without masterKey must be inserted
                let insertRecords = new Promise((ok, err) => {
                    if (newRecords.length === 0) {
                        ok();
                    } else {
                                // do insert
                                // each option must be linked to question
                        newRecords.forEach((detail) => {
                            detail[masterAttribute] = masterRecord[masterKey];
                        });
                                // console.log('newRecords', newRecords);
                        model.collection.insert(newRecords, (err, result) => {
                            if (result) {
                                if ((typeof result.hasWriteErrors) === 'function' && result.hasWriteErrors()) {
                                    console.log('RESULT', result.getWriteErrors().toString);
                                    console.log('typeof result.hasWriteErrors', typeof result.hasWriteErrors);
                                    console.log(result.getWriteErrorCount);
                                    console.log('saveDetailRecords - getWriteErrorCount');
                                    result.getWriteErrors().map(err => console.log(err.errmsg));
                                } else {
                                    console.log('RESULT', result);
                                    console.log('typeof result.hasWriteErrors', typeof result.hasWriteErrors);
                                }
                                ok(result);
                            }
                        });
                    }
                }
                    );

                Promise.all([updateRecords, insertRecords]).then(data => {
                        // console.log('data', data);
                    let records = [];
                    if (data && data.length > 0) {
                        data.map(prom => {
                            if (prom && prom.ops) {
                                prom.ops.map(record => {
                                    records.push(record._id);
                                });
                            }
                        });
                    }

                        // fulfill(data);
                    fulfill(records);
                });
            }
        }
        );
    }

    /**
     * Certify that given object exist on a collection.
     * Will return it if already exists, or create if not, and then return.
     * @param {String} modelName
     * @param obj
     * @param {String} keyAttribute
     * @param {String} findAttribute
     * @returns {Promise} The final object from database
     */
    static _certify (modelName, obj, keyAttribute, findAttribute) {
        // console.log('------------------ _certify ' + modelName + ' ------------');
        // console.log('obj', obj);
        // console.log('keyAttribute', keyAttribute);
        // console.log('findAttribute', findAttribute);

        return new Promise(async (fulfill, reject) => {
            let model = mongoose.model(modelName);

            // OBJ is a obsjet ot just a string?
            // It could be {_id: asas} and I don't will detect it...

            // obj must be a object
            if ((typeof obj) !== 'object') {
                // console.log('changing not object, to object');
                let oldObj = obj;
                obj = {};

                // It is a object id?
                if (util.isValidObjectId(oldObj)) {
                    // Then, it's in fact the keyAttribute value of the object
                    obj[keyAttribute] = new mongoose.Types.ObjectId(oldObj);
                    // console.log('was object it');
                } else {
                    // Just put to the object in findAttribute
                    obj[findAttribute] = oldObj;
                    // console.log('string to object');
                }
            }

            // Choose a good find aproach
            let find = {};
            if (obj[findAttribute]) {
                find[findAttribute] = obj[findAttribute];
            } else if (obj[keyAttribute]) {
                find[keyAttribute] = obj[keyAttribute];
            } else {
                console.error('!!!!!! _certify - Cannot create a valid find object. Params:');
                console.error('modelName', modelName);
                console.error('keyAttribute', keyAttribute);
                console.error('findAttribute', findAttribute);
                console.error('obj', obj);
                throw new Error("Cannot create a valid find object. ");
            }

            // Try to find (and update)
            let val;
            try{
                val = await model.findOneAndUpdate(find, obj, {new: true});
            } catch (e){
                console.error("Error on util.certify at findOneAndUpdate(find,obj)");
                console.error("find",find);
                console.error("obj",obj);
                throw new Error(e);
            }

            if (!val) {
                // not found
                // console.log('NOT found on database');

                return model.create(obj).then((val) => {
                    // console.log('created');
                    // console.log('====== final modelName =====');
                    // console.log(val);
                    // console.log('======');
                    fulfill(val);
                }).catch((err) => {
                    console.log(' IT NEVER CAN HAPPEN!!!!!!!! PANIC!');
                    if (err.code === 11000) {
                        model.findOne(find).then((val) => {
                            // console.log('catch err1', err);
                            // console.log('catch find', val);
                            fulfill(val);
                        });
                    } else {
                        console.log("monggooseUtils._certify err", err);
                        reject(err);
                    }
                });
            } else {
                // found
                // console.log('object FOUND on database');
                fulfill(val);
            }
        });
    }

    static _certifyFinding (model, obj, find) {
        // Find a email object with this address
        // Not found, insert
        // Found, get it
        // Return objectid
        // This method could be generic??

        return new Promise((fulfill, reject) => {
            if (!find) find = obj;
            // console.log('_certify');
            // console.log('obj', obj);
            // console.log('find', find);

            model.findOne(find, (err, val) => {
                // console.log('err', err);
                // console.log('val', val);
                if (!val) {
                    // console.log('criar');
                    model.create(obj).then(fulfill);
                } else {
                    // console.log('existia', val);
                    fulfill(val);
                }
            });
        });
    }


    /**
     * Check if passed val are a validObjectId
     * It could be ObjectID object, a string that match ObjectID pattern
     * ** Duplicated (node-lib/util and mongoose-it/util)
     * @param val
     * @returns {boolean}
     */
    static isValidObjectId (val) {
        let typeOf;
        let constructorName;
        if (val===undefined || val===null)
            return false;

        typeOf = typeof val;
        if (typeOf === "undefined") {
            throw new Error("getObjectId with undefined findOrId");
        }

        if (typeOf !== "String") {
            constructorName = val.constructor.name;
        }

        if (typeOf === 'object' && constructorName === "ObjectID") {
            return true;
        }
        if (typeOf === "String") {
            return new RegExp("^[0-9a-fA-F]{24}$").test(val);
        }

        return false;
    }

}

module.exports = util;
