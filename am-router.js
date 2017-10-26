var restful = require('node-restful');

class AMRouter {
    constructor () {
        this.resource = null;
    }

    registerModelMethods (app, route, modelName, schema, methods) {
        this.modelName = modelName;

        this.resource =
            app.resource =
                restful.model(modelName, schema).methods(methods);
        this.resource.shouldUseAtomicUpdate = false;
        this.resource.register(app, route);
        return this.resource;
    }

    getModel () {
        return this.modelName;
    }

    beforeAll (before) {
        this.resource.before('get', before)
            .before('post', before)
            .before('put', before)
            .before('del', before);
        return this;
    }

    afterPost (before) {
        this.resource.after('post', before);
        return this.resource;
    }

    afterGet (after) {
        this.resource.after('get', after);
        return this.resource;
    }

    beforeGet (before) {
        this.resource.before('get', before);
        return this.resource;
    }

    beforeChange (before) {
        this.resource.before('post', before)
            .before('put', before)
            .before('del', before);
        return this.resource;
    }

    beforePost (before) {
        this.resource.before('post', before);
        return this;
    }

    beforeDelete (before) {
        this.resource.before('delete', before);
        return this;
    }

    afterDelete (after) {
        this.resource.after('delete', after);
        return this;
    }

    beforePostPut (before) {
        this.resource
            .before('post', before)
            .before('put', before);
        return this;
    }

    beforePut (before) {
        this.resource.before('put', before);
        return this;
    }

    afterPut (after) {
        this.resource.after('put', after);
        return this;
    }
}

module.exports = AMRouter;
