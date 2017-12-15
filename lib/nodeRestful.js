const restful = require('node-restful');

class nodeRestful {
    // Register multiple
    static registerMultipleRoutes(app, router, routes) {
        routes.map((route) => {
            nodeRestful.registerRoute(app, router, route);
        });
    }

    // Register single route
    static registerRoute(app, router, route) {
        // console.log("registerRoute", route);
        let resource = app.resource = restful.model(route.modelName, route.schema).methods(['get', 'post', 'put', 'delete']).updateOptions({'new': true});
        resource.shouldUseAtomicUpdate = false;

        if (route.exposeModelMethods) {
            // console.log("route.exposeModelMethods");
            for (let method of route.exposeModelMethods) {
                resource.route(method, {detail: true, handler: (req,res,next)=>{nodeRestful.callMethod(req,res,next,route.modelName)}});
            }
        }

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
    }

    static async callMethod(req, res, next, modelName) {
        try {

            // console.log("modelName",modelName);
            console.log(req.originalUrl);
            let method = req.originalUrl.split("/").splice(-1);
            console.log("    method: "+method);
            // console.log(req);

            console.log("callMethod - model, method", modelName, method);

            const model = restful.model(modelName);
            // console.log("model", model);
            let call = null;
            let param = null;
            let record = null;
            let result;

            // Check for method on model first
            if ((typeof model[method]) === "function") {
                // console.log("1");
                result = await model[method](req.params.id);
            } else {
                // console.log("2");
                record = await model.findOne({_id: req.params.id});
                if ((typeof record[method]) === "function") {
                    result = await record[method]();
                }
            }

            if (!result) {
                throw new Error("No method found to " + method);
            }

            // console.log("test", test);
            res.send(result);
        } catch (e) {
            next(e, req, res, next);
        }
    }
}

module.exports = nodeRestful;