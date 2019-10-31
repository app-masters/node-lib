var restful = require('node-restful');
const nodeRestful = require('./nodeRestful');

class AMRouter {
    constructor () {
        this.resource = null;
    }

    register(app, router, routeParams){
        return nodeRestful.registerRoute(app, router, routeParams);
    }

    registerModelMethods (app, route, modelName, schema, methods, exposeMethods) {
        let newRoute = {
            route: '/api/person',
            modelName: 'person',
            schema: schema,
            methods: methods,
            exposeModelMethods: exposeMethods
        };
        this.register(newRoute);
    }

    getModel () {
        return this.modelName;
    }


    beforeAll (before) {
        this.resource.before('get', before)
            .before('post', before)
            .before('put', before)
            .before('delete', before);
        return this;
    }

    afterPost (before) {
        this.resource.after('post', before);
        return this;
    }

    afterGet (after) {
        this.resource.after('get', after);
        return this;
    }

    beforeGet (before) {
        this.resource.before('get', before);
        return this;
    }

    beforeChange (before) {
        this.resource.before('post', before)
            .before('put', before)
            .before('delete', before);
        return this;
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
