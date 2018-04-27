const {JSON} = require('sequelize');

const JSONSchema = (schema) => {
    const validKeys = Object.keys(schema);
    return {
        type: JSON,
        validate: {
            schema: (value) => {
                let isValid = true;
                for (const key of Object.keys(value)) {

                    // Is a declared key?
                    if (validKeys.indexOf(key) < 0) {
                        isValid = false;
                        throw new Error(`Invalid key '${key}' provided`);
                    }
                    if (schema[key].type) {
                        schema[key] = {...schema[key].type};
                    }

                    // Is the variable type correct?
                    const schemaType = schema[key].key;
                    const isTypeValid = validate[schemaType](value[key]);
                    if (!isTypeValid) {
                        isValid = false;
                        throw new Error(`Invalid value provided to '${key}'. Expected ${schemaType}`);
                    }

                }
                return isValid;
            }
        }
    };
};

const validate = {
    BOOLEAN: (value) => typeof(value) === 'boolean',
    INTEGER: Number.isInteger,
    STRING: (value) => typeof(value) === 'string',
    REAL: (value) => typeof(value) === 'number',
    DATE: (value) => (value instanceof Date && !isNaN(value.valueOf()))
};

module.exports = JSONSchema;