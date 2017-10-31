// load all  the things we need
const pass = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const _ = require('lodash');
// WebToken
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt2 = require('jsonwebtoken');

// Mongooge
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// const passport;
var jwt;

// const userModel;

class AMAuth {
    setup (passport) {
        // Validate
        if (!global.config){
            throw new Error("Config not found on global. Something wrong...");
        }
        let securityConfig = global.config.securityConfig;
        if (!passport || !securityConfig) {
            throw new Error("passport or securityConfig required for AMAuth");
        }
        let userSchema = mongoose.model('user').schema;
        if (typeof userSchema.methods.validPassword !== 'function') {
            throw new Error("user model din't called setupUserSchema before register model ");
        }
        // check for mongooseit
        if (typeof mongoose.model('user').findIt === "undefined") {
            throw new Error("You must use mongooseit plugin on schema for model " + modelName);
        }

        AMAuth.passport = pass;
        AMAuth.UserModel = mongoose.model('user');
        AMAuth.UserSchema = mongoose.model('user').schema;
        AMAuth.securityConfig = securityConfig;

        // Local signup
        let localSignupOptions = {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        };
        let localSignup = new LocalStrategy(localSignupOptions, this._localSignupStrategy);
        passport.use('local-signup', localSignup);

        // Local login
        let localLogionOptions = {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        };
        let localLogin = new LocalStrategy(localLogionOptions, this._localLoginStrategy);
        passport.use('local-login', localLogin);

        // WebToken
        var jwtOptions = {
            jwtFromRequest: ExtractJwt.fromAuthHeader(),
            secretOrKey: securityConfig.secret
        };
        jwt = new JwtStrategy(jwtOptions, this._jwtStrategy);
        passport.use(jwt);

        // used to serialize the user for the session
        passport.serializeUser(function (user, done) {
            done(null, user.id);
        });

        // used to deserialize the user
        passport.deserializeUser(function (id, done) {
            AMAuth.UserModel.findItByIdCache(id, function (err, user) {
                done(err, user);
            });
        });

        return this;
    }

    static register (passport, userModel, configSecurity) {
        return new AMAuth(passport, userModel, configSecurity);
    }

    _localSignupStrategy (req, email, password, done) {
        process.nextTick(function () {
            // Move it to model?
            AMAuth.UserModel.findOne({'local.email': email}, function (err, user) {
                if (err) {
                    console.error("local-signup err", err);
                    return done(err);
                }
                // check to see if theres already a user with that email
                if (user) {
                    return done(null, false, {message: 'That email is already taken.'});
                } else {
                    // First user? It will be the admin
                    AMAuth.UserModel.count({}, function (err, count) {
                        var newUser = new AMAuth.UserModel();
                        newUser.local.email = email;
                        newUser.local.password = password;
                        if (count == 0) {
                            newUser.role = 'admin';
                        }
                        newUser.save(function (err) {
                            // console.log("newuser", newUser);
                            if (err) {
                                throw err;
                            }

                            return done(null, newUser);
                        });
                    });
                }
            });
        });
    }

    _localLoginStrategy (req, email, password, done) {
        // console.log('_localLoginStrategy');

        process.nextTick(function () {
            // Move it to model?
            AMAuth.UserModel.findOne({'local.email': email}, function (err, user) {
                // console.log('err', err);
                // console.log('user', user);
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {message: 'No user found.', name: 'NoUserFound'});
                }

                // console.log('password', password);
                if (!user.validPassword(password)) {
                    return done(null, false, {message: 'Oops! Wrong password.', name: 'WrongPassword'});
                }

                return done(null, user);
            });
        });
    }

    _jwtStrategy (payload, done) {
        // console.log('_jwtStrategy');
        let init = new Date().getTime();
        AMAuth.UserModel.findItOneCache(payload._id).then(user => {
            // console.log('>>>>>>>>>> user', user);
            let end = new Date().getTime();
            console.log(' -> spend mls userFind on _jwtStrategy', end - init);
            // if (err) {
            //     return done(err, false);
            // } else
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    };

    // Called by route
    localSignup (req, res, next) {
        // console.log('localSignup');
        AMAuth.passport.authenticate('local-signup', function (err, user, info) {
            if (user) {
                return res.send(AMAuth.getUserData(user));
            }
            if (info) {
                res.writeHead(400, info.message, {'content-type': 'text/plain'});
                return res.end(info.message);
            }
            if (err) {
                return next(err);
            }
        })(req, res, next);
    }

    // Called by route
    localLogin (req, res, next) {
        // console.log('localLogin');
        // console.log(AMAuth.instance,AMAuth.instance);
        // console.log('this',this);
        // console.log('this.userModel 0',this.userModel);
        AMAuth.passport.authenticate('local-login', function (err, user, info) {
            // console.log('err', err);
            // console.log('user', user);
            // console.log('info', info);
            if (user) {
                AMAuth.allowAccess(AMAuth.securityConfig, req.headers, user).then((user) => {
                    let userData = AMAuth.getUserData(user);
                    req.logIn(user, function (err) {
                        if (err) {
                            return next(err);
                        }
                        return res.send(userData);
                    });
                }).catch(err => {
                    res.writeHead(401, err.message, {'content-type': 'text/plain'});
                    return res.end(err.message);
                });
            }
            if (info) {
                let message = info.name ? info.name : info.message;
                res.writeHead(400, message, {'content-type': 'text/plain'});
                return res.end(message);
            }
            if (err) {
                return next(err);
            }
        })(req, res, next);
    }

    static allowAccess (config, headers, user) {
        return new Promise((resolve, reject) => {
            if (!config.denyAccess) {
                resolve(user);
            } else if (config.denyAccess.admin && headers.client === 'admin' && config.denyAccess.admin.indexOf(user.role) < 0) {
                resolve(user);
            } else if (config.denyAccess.mobile && headers.client === 'mobile' && config.denyAccess.mobile.indexOf(user.role) < 0) {
                resolve(user);
            }
            reject(new Error("user is not authorized"));
        });
    }

    requireRole (roles) {
        return function (req, res, next) {
            if (AMAuth.securityConfig.disabledOnDev === true) {
                return next();
            }
            // console.log('requireRole',role);
            if (!req.user) {
                console.error('requireRole: No user on req, requireAuth must be called first');
                return;
            }
            if (roles.indexOf(req.user.role) > -1) {
                return next();
            }

            return res.status(401).json({error: 'You are not authorized to view this content'});
            // return next('Unauthorized');
        };
    }

    /// Facebook (first version) - #needrefactory #repeatedcode
    async facebookLogin (req, res, next) {
        console.log('facebookLogin');
        // console.log('facebookLogin req.body',req.body);

        if (!req.body.id || !req.body.token || !req.body.email || !req.body.name) {
            return next(new Error("id, token, email and name needed"));
        }

        // Search for that user
        let user = await AMAuth.UserModel.findItOneCache({'facebook.id': req.body.id});

        if (!user) {
            console.log("Facebook user not found");
            let facebook = {
                id: req.body.id,
                token: req.body.token,
                email: req.body.email,
                name: req.body.name
            };

            // User not found - search in local by email
            user = await AMAuth.UserModel.findItOneCache({'local.email': req.body.email});
            if (user) {
                // User found on local, update facebook attribute
                console.log("Facebook found on local by email, updating");
                user.facebook = facebook;
                AMAuth.UserModel.findByIdAndUpdate(user._id, user, {multi: false}, (err, user) => {
                    console.log("updated user", user);
                    // Repeated code from another class method
                    let userData = AMAuth.getUserData(user);
                    req.logIn(user, function (err) {
                        if (err) return next(err);
                        return res.send(userData);
                    });
                });
            } else {
                // User not found. Register.
                let user = new AMAuth.UserModel();
                user.name = req.body.name;
                user.local.email = req.body.email;
                user.facebook = facebook;
                AMAuth.UserModel.create(user).then(user => {
                    console.log("created user", user);
                    // Repeated code from another class method
                    let userData = AMAuth.getUserData(user);
                    req.logIn(user, function (err) {
                        if (err) return next(err);
                        return res.send(userData);
                    });
                });
            }
        } else if (user) {
            // User located by facebook id
            console.log("Facebook user found");
            // Repeated code from another class method
            let userData = AMAuth.getUserData(user);
            req.logIn(user, function (err) {
                if (err) return next(err);
                return res.send(userData);
            });
        }
    }

    // It will check it user are in the required role,
    // or if it is the self user
    requireSelfUserOrRole (roles) {
        return function (req, res, next) {
            if (AMAuth.securityConfig.disabledOnDev === true) {
                return next();
            }
            // / console.log('requireRole',role);
            if (!req.user) {
                console.error('requireSelfUserOrRole: No user on req, requireAuth must be called first');
                return;
            }
            var user = req.user;
            // Check role
            if (roles.indexOf(user.role) > -1) {
                return next();
            }

            // Check self user - JUST ON PUT
            // if (req.method !== 'PUT' && req.method !== 'GET') {
            //     throw new Error("requireSelfUserOrRole just work on PUT yeat");
            // }
            // console.log('req.params',req.params);
            if (!req.params.id) {
                throw new Error("No id on req.params");
            }
            // console.log('req.params',req.params);
            if (req.params.id === req.user._id.toString()) {
                return next();
            }

            return res.status(401).json({error: 'You are not authorized to view this content - requireSelfUserOrRole - Your id:' + req.user._id.toString()});
            // return next('Unauthorized');
        };
    }

    requireAuth (req, res, next) {
        // console.log('requireAuth');
        if (AMAuth.securityConfig.disabledOnDev === true) {
            console.log('AMAuth.securityConfig.disabledOnDev', true);
            return next();
        }

        // console.log('requireAuth');
        return AMAuth.passport.authenticate('jwt', {session: false}, function (err, user, info) {
            // console.log('err', err);
            // console.log('info', info);
            if (err) {
                return next(err);
            }
            // console.log('requireAuth user', user);
            if (user) {
                req.user = user;
                req.rollbar_person = {"id": user._id, "username": user.name, "email": user.local.email};
                return next();
            } else {
                return res.status(401).json({error: 'You must be authenticated'});
            }
        })(req, res, next);
    }

    static generateToken (user) {
        // console.log('AMAuth.jwt', AMAuth.jwt); s
        return jwt2.sign(user, AMAuth.securityConfig.secret, {
            expiresIn: '200d'
        });
    }

    static getUserData (user) {
        let userInfo = {
            _id: user._id,
            email: user.local.email,
            role: user.role,
            data: user.data,
            name: user.name
        };
        return {
            user: userInfo,
            token: 'JWT ' + AMAuth.generateToken(userInfo)
        };
    }

    /**
     Add password encryption and validation to user schema.
     It must be called after Schema and before model:
     var mongooseSchema = mongoose.Schema(schema, options);
     mongooseSchema = AMAuth.setupUserSchema(mongooseSchema); <<<<
     var model = mongoose.model('user', mongooseSchema);
     */
    setupUserSchema (UserSchema) {
        // checking if password is valid
        UserSchema.methods.validPassword = function (password) {
            return bcrypt.compareSync(password, this.local.password);
        };

        // Encrypt password
        UserSchema.pre('save', function (next) {
            var user = this;
            if (user.local.password != undefined && !user.isModified('local.password')) {
                return next();
            }
            user.local.password = bcrypt.hashSync(user.local.password, bcrypt.genSaltSync(8), null);
            next();
        });

        return UserSchema;
    }
}

AMAuth._passport = null;

// Export instance
var amAuth = new AMAuth();
module.exports = amAuth;
