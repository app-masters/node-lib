const _ = require('lodash')

module.exports = (object, fields) => _.pickBy(object, (element, key) => fields && fields.indexOf(key) !== -1)
