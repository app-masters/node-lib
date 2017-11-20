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

# amInvite

Add invite key on api config file: 

```
envs.development = {
    invite: {
        singleUserLink: true,
        baseUrlAndRoute: 'http://publicurl.com/invite/',
        sendEmail: true
    }
};
```

If you want to know if some user accept an invite, call somewhere:

```
AMInvite.setAcceptCallback((invite=>{
    // invite have all data you need
}));

```

````
    http://emagrecaja.com.br/convite/0197039120321730918
    http://eisaquestao.ufjf.br/amigo/0197039120321730918
````



# Change Log

Check all changes on [changelog](CHANGELOG.md).