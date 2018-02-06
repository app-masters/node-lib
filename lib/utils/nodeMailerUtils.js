const fieldChecker = require('./fieldChecker')

const nodemailerFields = ['auth','port','host']

const hasMailerConfigs = config => Object.keys(fieldChecker(config,nodemailerFields)).length >= nodemailerFields.length

module.exports = {hasMailerConfigs}
