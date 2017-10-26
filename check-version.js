// Move it to a bootstrap lib
const semver = require('semver');
// Force package to have it defined? Yes. App Masters Rulez
module.exports = (packag) => {
    const version = packag.engines.node;
    if (!semver.satisfies(process.version, version)) {
        console.log(`Required node version ${version} not satisfied with current version ${process.version}.`);
        process.exit(1);
    }
};
