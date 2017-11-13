# node-lib


# apiBootstrap

A short start to App Masters APIs:

```
// Requires for bootstrap
const express = require('express');
const app = express();
const envs = require('./config/config');
const packag = require('./package');
const passport = require('passport');
const userSchema = require('./app/model/userSchema');

const apiBootstrap = require('./apiBoostrap');

// 1 - Api Bootstrap tests
apiBootstrap.setup(app, envs, packag, passport);
// 2 - Include Routes
require('./app/routes')(app);
// 3 - Listen API
apiBootstrap.listen(app);
```


# Change Log

Check all changes on [changelog](CHANGELOG.md).