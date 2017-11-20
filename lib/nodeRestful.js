const restful = require('node-restful');

class nodeRestful{
     // Register multiple
     registerMultipleRoutes(app, routes) {
        routes.map((route) => {
            let resource = app.resource = restful.model(route.modelName, route.schema).methods(['get', 'post', 'put', 'delete']);
            resource.shouldUseAtomicUpdate = true;
            if (route.beforeAll)
                resource.before('get', route.beforeAll)
                    .before('post', route.beforeAll)
                    .before('put', route.beforeAll)
                    .before('del', route.beforeAll);
            resource.register(app, route.route);
        });
    }
}

module.exports = nodeRestful;