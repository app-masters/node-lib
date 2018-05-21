const apiBootstrap = require('../../lib/sequelize/apiBootstrapS');
const sequelizeInstance = require('../../lib/sequelize/sequelizeInstance');

const dotEnvFile = __dirname + '/../../.env';

const fs = require('fs');
if (!fs.existsSync(dotEnvFile)) {
    throw new Error("You must have your own .env file on project root. (at " + dotEnvFile + ")");
}
require('dotenv').config({path: dotEnvFile});

const envs = {
    test: {
        database: {
            url: process.env.DATABASE_URL,
            driver: "sequelize",
            // logging: console.log
        },
        security: {
            checkClientOnDev: false,
            secret: "someSecretGoesHere"
        },
        server: {
            corsOptions: {
                origin: '*',
                methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
                preflightContinue: false,
                optionsSuccessStatus: 204,
                exposedHeaders: 'api-version, api-env, min-web-version, min-mobile-version, min-admin-version, user',
                allowedHeaders: 'content-type, Authorization, authorization, client, client-env, admin-version, mobile-version, web-version'
            },
            initialize: {
                base: '/api',
                updateMethod: 'PATCH'
            }
        }
    },
    development: {},
    production: {}
};

const app = require('../../lib/express')(envs.test);

const testPackage = {
    'name': 'bootstrap-test',
    'version': '0.0.1',
    'releaseDate': '02 de Abril de 2018',
    'minWebVersion': '0.0.0',
    'minAdminVersion': '0.0.1',
    'minMobileVersion': '0.0.1',
    'description': 'nodelib api-test',
    'main': 'index.js',
    'engines': {
        'node': '8.x'
    }
};

const bootstrapAPI = () => test('Should config the API', async (done) => {
    try {
        await apiBootstrap.setup(app, envs, testPackage);
        done();
    } catch (err) {
        expect(err).toBe(null);
    }
});

const setupSchemas = () => test('Should setup de Schemas', async (done) => {
    try {
        require('../schemas');
        setTimeout(() => done(), 500);
    } catch (err) {
        expect(err).toBe(null);
    }
});

const finishTests = () => test('Should finish the sequelize connection', async (done) => {
    try {
        await sequelizeInstance.getInstance().connectionManager.close();
        done();
    } catch (err) {
        expect(err).toBe(null);
    }
});

module.exports = {app, envs, bootstrapAPI, setupSchemas, finishTests};
