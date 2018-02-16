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

### Config

``` 
{
    security:{
        singleLoginSignup:true // will enable login and signup at same route: /login/
    }
}

# nodeRestful

Easy [node-restful](https://github.com/baugarten/node-restful) use with less code and more resources.

### registerRoute

Will register a route with node-restful. 

``` 
let route = {
    route: '/api/user',
    modelName: 'user',
    schema: mySchema,
};
    
nodeRestful.registerRoute(app, router, routeParams);
```

### registerMultipleRoutes

Do same as registerRoute, but receiving an array of routes.


## exposeModelMethods

Allow to call a model method directly from rest route. 

Eg: `http://myapi.com/user/5a3168e1f60a471f02fb92f5/sendGreetings` will call referred user `user.sendGreetings()`.

First it will check for `mongoose.model(yourModel).sendGreetings` method, if it found, well be called `mongoose.model(yourModel).sendGreetings(5a3168e1f60a471f02fb92f5)`.

If the method don't exists on mongoose model, will check on model instance, like `mongoose.model(yourModel).find(5a3168e1f60a471f02fb92f5).sendGreetings`, if it exists will be called without any parameter.

To all of this work you just need pass `exposeModelMethods` to registerRoute.

``` 
let route = {
    route: '/api/user',
    modelName: 'user',
    schema: mySchema,
    exposeModelMethods: ['sendGreetings','getMoreData','sendMoreSpam']
};
    
nodeRestful.registerRoute(app, router, routeParams);
```

# amMailing

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

# Development

```
npm install
```

# Change Log

Check all changes on [changelog](CHANGELOG.md).