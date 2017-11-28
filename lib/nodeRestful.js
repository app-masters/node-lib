const restful = require('node-restful');

class nodeRestful{
     // Register multiple
     static registerMultipleRoutes(app, router, routes) {
        routes.map((route) => {
            let resource = app.resource = restful.model(route.modelName, route.schema).methods(['get', 'post', 'put', 'delete']).updateOptions({'new': true});
            resource.shouldUseAtomicUpdate = true;

            if (route.subRoutes)
                router.use('/' + route.modelName, route.subRoutes);

            if (route.beforeAll)
                resource.before('get', route.beforeAll)
                    .before('post', route.beforeAll)
                    .before('put', route.beforeAll)
                    .before('del', route.beforeAll);     

            if (route.beforeChange)
                resource.before('post', route.beforeChange)
                    .before('put', route.beforeChange)
                    .before('del', route.beforeChange);

            if (route.afterChange)
                resource.before('post', route.afterChange)
                    .before('put', route.afterChange)
                    .before('del', route.afterChange);

            if (route.afterGet) resource.after('get', route.afterGet);
            if (route.afterPost) resource.after('post', route.afterPost);
            if (route.afterPut) resource.after('put', route.afterPut);
            if (route.afterDelete) resource.after('del', route.afterDelete);
           
            if (route.beforeGet) resource.before('get', route.beforeGet);
            if (route.beforePost) resource.before('post', route.beforePost);
            if (route.beforePut) resource.before('put', route.beforePut);
            if (route.beforeDelete) resource.before('del', route.beforeDelete);

            resource.register(app, route.route);
        });
    }
}

module.exports = nodeRestful;