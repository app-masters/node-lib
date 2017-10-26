const mongooseDelete = require('mongoose-delete');
// https://github.com/dsanel/mongoose-delete

module.exports = function (schema) {
    // If you find a Bug and need to remove the 'find', write the error here.
    // Also, call James and tell him what's happening (he'll forget later).
    schema.plugin(mongooseDelete, {deletedAt: true, overrideMethods: ['count', 'find']});

    schema.pre('remove', function (next, done) {
        console.log('pre remove');
        // console.log(this);
        this.delete(() => {
            console.log('delete');
            // next();
            done();
        });
    });
    schema.pre('findOneAndRemove', function (next, done) {
        console.log('pre findOneAndRemove');
        // console.log(this);
        // this.delete(() => {
        //     console.log('delete');
        //     // next();
        //     done();
        // });
        let err = new Error("Using softDelete, you must set shouldUseAtomicUpdate on route before register the resource");
        console.error(err);
        next(err);
    });
};
