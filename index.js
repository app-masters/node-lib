module.exports = {
    amAuth: require('./lib/am-auth'),
    amBootstrap: require('./lib/am-bootstrap'),
    amController: require('./lib/am-controller'),
    amError: require('./lib/am-error'),
    amInvite: require('./lib/am-invite'),
    amLeadManager: require('./lib/am-leadManager'),
    amMailing: require('./lib/am-mailing'),
    amModel: require('./lib/am-model'),
    amRdStation: require('./lib/am-rdstation'),
    amRouter: require('./lib/am-router'),
    amSoftDelete: require('./lib/am-softDelete'),
    amSystem: require('./lib/am-system'),
    checkVersion: require('./lib/check-version'),
    dateTime: require('./lib/dateTime'),
    util: require('./lib/util'),
    apiBootstrap: require('./lib/apiBootstrap'),
    nodeRestful: require('./lib/nodeRestful'),
    stats: require('./lib/stats'),
    message: require('./lib/message'),
    notification: require('./lib/notification'),
    auth: require('./lib/sequelize/auth'),
    modelSequelize: require('./lib/sequelize/modelSequelize'),
    modelMongoose: require('./lib/modelMongoose'),
    jsonSchema: require('./lib/sequelize/sequelizeJSON'),
    apiBootstrapS: require('./lib/sequelize/apiBootstrapS'),
    express: require('./lib/express'),
    finaleRestful: require('./lib/sequelize/finaleRestful'),
    repository: require('./lib/sequelize/repository'),
    instance: require('./lib/sequelize/instance'),
    sequelizeInstance: require('./lib/sequelize/sequelizeInstance')
};