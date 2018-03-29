const finale = require('finale-rest');
const _ = require('lodash');

const getResource = (finale, resource) => {
    const fResource = finale.resource({
        model: resource.schema,
        endpoints: [`/${resource.schema.name.toLowerCase()}`, `/${resource.schema.name.toLowerCase()}/:_id`],
        actions: resource.actions,
        excludeAttributes: resource.excludeAttributes
    })
    fResource.use(resource.restMiddleware);
    return fResource;
}

// Create REST resources
const createResources = (finale, resources) => _.mapValues(resources, (resource, key) => getResource(finale, resource)[key.toLowerCase()])

const registerMultipleRoutes = (app, resources, sequelize, configs) => {
    const finaleConfigs = {app, sequelize, ...configs.server.initialize || {}};
    finale.initialize(finaleConfigs);
    createResources(finale, resources);
    return finale.app;
}

module.exports = {
    registerMultipleRoutes
};
