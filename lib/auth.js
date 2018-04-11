// load all  the things we need
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const AMMailing = require('./am-mailing');
const AMInvite = require('./am-invite');
// WebToken
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt2 = require('jsonwebtoken');

// Utils
const moment = require('moment');
const bcrypt = require('bcrypt-nodejs');
const md5 = require('md5');

let jwt;

class Auth {
    setup (config) {
        let securityConfig = config.security;
        if (!securityConfig) {
            throw new Error('passport or securityConfig required for Auth');
        }


        Auth.securityConfig = securityConfig;
        // const atributes = ['removedAt', 'lastAccessDate', 'initialClient', 'lastClient', 'initialClientVersion', 'lastClientVersion'];

        // Local signup
        let localSignupOptions = {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        };
        let localSignup = new LocalStrategy(localSignupOptions, Auth._localSignupStrategy);
        passport.use('local-signup', localSignup);

        // Local login
        let localLogionOptions = {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        };
        let localLogin = new LocalStrategy(localLogionOptions, Auth._localLoginStrategy);
        passport.use('local-login', localLogin);

        // WebToken
        const jwtOptions = {
            jwtFromRequest: ExtractJwt.fromAuthHeader(),
            secretOrKey: securityConfig.secret
        };
        jwt = new JwtStrategy(jwtOptions, this._jwtStrategy);
        passport.use(jwt);

        // used to serialize the user for the session
        passport.serializeUser(function (user, done) {
            done(null, user._id);
        });

        // used to deserialize the user
        passport.deserializeUser(function (id, done) {
            Auth.UserModel.findByIdCache(id).then(function (err, user) {
                done(err, user);
            });
        });
        passport.initialize();
        Auth.passport = passport;
        return this;
    }

    setUserModel(model){
        Auth.UserModel = model;
    }

    static register (passport, userModel, configSecurity) {
        return new Auth(passport, userModel, configSecurity);
    }

    static _localSignupStrategy (req, email, password, done) {
        Auth.sign({local: {email, password}}).then(user => {
            return done(null, user);
        });
    }

    _jwtStrategy (payload, done) {
        Auth.UserModel.findByIdCache(payload._id).then((user) => {
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    };

    // Called by route
    localSignup (req, res, next) {
        Auth.passport.authenticate('local-signup', function (err, user, info) {
            if (user) {
                return res.send(Auth.getUserData(user));
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

    async signup (email, password, cb) {
        Auth._localSignupStrategy(null, email.toLowerCase(), password, cb);
    }

    async signupUser (req, res, next) {
        let user = req.body.user;
        try {
            user = await Auth.sign(user);
            return res.send(Auth.getUserData(user));
        } catch (e) {
            return next(e);
        }
    }

    static async sign (user) {
        let find = {};
        // Validate data and create find object
        if (user.local.email) {
            user.local.email = user.local.email.trim().toLowerCase();
            // validate email
            find = {'local.email': user.local.email.toLowerCase()};
        }
        if ((user.local.email || user.local.phone) && !user.local.password)
            throw new Error('User must have password');
        const foundUser = await Auth.UserModel.findOne(find);
        // check to see if theres already a user with that email
        if (foundUser) {
            return foundUser;
        }
        // Create user
        user = await Auth.UserModel.create(user);
        // Have a Invite?
        if (AMInvite.isActive()) {
            AMInvite.checkInvite(user);
        }

        return user;
    }

    static _localLoginStrategy (req, email, password, done) {
        process.nextTick(function () {
            Auth.UserModel.findOne({'local.email': email.toLowerCase()}).then(function (err, user) {
                // console.log('err_', err);
                // console.log('user_', user);
                if (err) {
                    return done(err);
                }
                if (!user) {
                    // singleLoginSignup
                    if (Auth.securityConfig.singleLoginSignup === true) {
                        return Auth._localSignupStrategy(req, email.toLowerCase(), password, done);
                    } else {
                        return done(null, false, {message: 'No user found.', name: 'NoUserFound'});
                    }
                }

                // console.log('password', password);
                if (!user.validPassword(password)) {
                    return done(null, false, {message: 'Oops! Wrong password.', name: 'WrongPassword'});
                }

                return done(null, user);
            });
        });
    }

    // Called by route
    localLogin (req, res, next) {
        try {
            // console.log('> localLogin req', req.body);
            Auth.passport.authenticate('local-login', function (user, err, info) {
                if (user) {
                    if (user instanceof Error) {
                        return next(user);
                    }
                    Auth.allowAccess(Auth.securityConfig, req.headers, user).then((user) => {
                        let userData = Auth.getUserData(user);
                        req.login(user, function (err) {
                            if (err) {
                                return next(err);
                            }
                            return res.send(userData);
                        });
                    }).catch(err => {
                        console.log('ERRORHERE', err);
                        res.writeHead(401, err.message, {'content-type': 'text/plain'});
                        return res.end(err.message);
                    });
                }
                if (info) {
                    let message = info.name ? info.name : info.message;
                    res.writeHead(400, message, {'content-type': 'text/plain'});
                    return res.end(message);
                }
            })(req, res, next);
        } catch (err) {
            console.error('localLogin', err);
            next(err, req, res, next);
        }
    }

    static allowAccess (config, headers, user) {
        return new Promise((resolve, reject) => {
            if (!config.denyAccess || config.denyAccess.length === 0) {
                resolve(user);
            } else if (config.denyAccess.admin && headers.client === 'admin' && config.denyAccess.admin.indexOf(user.role) < 0) {
                resolve(user);
            } else if (config.denyAccess.mobile && headers.client === 'mobile' && config.denyAccess.mobile.indexOf(user.role) < 0) {
                resolve(user);
            }
            reject(new Error('user is not authorized'));
        });
    }

    requireRole (roles) {
        return function (req, res, next) {
            if (Auth.securityConfig.disabledOnDev === true) {
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
            return next(new Error('id, token, email and name needed'));
        }

        // Search for that user
        let user = await Auth.UserModel.findOne({'facebook.id': req.body.id});

        if (!user) {
            console.log('Facebook user not found');
            let facebook = {
                id: req.body.id,
                token: req.body.token,
                email: req.body.email ? req.body.email.toLowerCase() : null,
                name: req.body.name
            };

            // User not found - search in local by email
            user = await Auth.UserModel.findOne({'local.email': req.body.email.toLowerCase()});
            if (user) {
                // User found on local, update facebook attribute
                console.log('Facebook found on local by email, updating');
                user.facebook = facebook;
                Auth.UserModel.findByIdAndUpdate(user._id, user, {multi: false}, (err, user) => {
                    console.log('updated user', user);
                    // Repeated code from another class method
                    let userData = Auth.getUserData(user);
                    req.logIn(user, function (err) {
                        if (err) return next(err);
                        return res.send(userData);
                    });
                });
            } else {
                // User not found. Register. @TODO - must be in one place (invite use it)
                let user = new Auth.UserModel();
                user.name = req.body.name;
                user.local.email = req.body.email.toLowerCase();
                user.facebook = facebook;
                Auth.UserModel.create(user).then(user => {
                    console.log('created user', user);
                    // Repeated code from another class method
                    let userData = Auth.getUserData(user);
                    req.logIn(user, function (err) {
                        if (err) return next(err);
                        return res.send(userData);
                    });
                });
            }
        } else if (user) {
            // User located by facebook id
            console.log('Facebook user found');
            // Repeated code from another class method
            let userData = Auth.getUserData(user);
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
            if (Auth.securityConfig.disabledOnDev === true) {
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
                throw new Error('No id on req.params');
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
        if (Auth.securityConfig.disabledOnDev === true) {
            console.log('Auth.securityConfig.disabledOnDev', true);
            return next();
        }

        // console.log('requireAuth');
        return Auth.passport.authenticate('jwt', {session: false}, function (err, user, info) {
            // console.log('err', err);
            // console.log('info', info);
            if (err) {
                return next(err);
            }
            // console.log('-------->', user);
            if (user) {
                // console.log('-------->', user);
                req.user = user;
                req.rollbar_person = {'id': user._id, 'username': user.name, 'email': user.local.email};
                Auth.certifyLastAttributes(req.user, req.headers);
                return next();
            } else {
                return res.status(401).json({error: 'You must be authenticated'});
            }
        })(req, res, next);
    }

    /**
     * Method to certify the lastAccessDate, initialClient, initialClientVersion, lastClient,
     * lastClientVersion params
     * @author Igor Phelype Guimarães
     * @param {*} user
     * @param {*} headers
     * @returns {void}
     */
    static async certifyLastAttributes (user, headers) {
        let changed = false;
        if (!user.lastAccessDate || !moment(user.lastAccessDate).isSame(moment(), 'day')) {
            user.lastAccessDate = new Date();
            changed = true;
        }
        if (!user.initialClient || !user.initialClientVersion) {
            user.initialClient = headers['client'];
            user.initialClientVersion = headers[`${headers['client']}-version`];
            changed = true;
        }
        if (user.lastClient !== headers['client'] || user.lastClientVersion !== headers[`${headers['client']}-version`]) {
            user.lastClient = headers['client'];
            user.lastClientVersion = headers[`${headers['client']}-version`];
            changed = true;
        }
        if (changed) {
            const userUpdated = await Auth.UserModel.update({_id: user._id}, user);
            if(!userUpdated){
                console.error(`Fail to update user ${user._id} on Auth.certifyLastAttributes`);
            }
        }
    }

    static generateToken (user) {
        // console.log('Auth.jwt', Auth.jwt); s
        let nUser = {id: user._id, _id: user._id};
        return jwt2.sign(nUser, Auth.securityConfig.secret, {
            expiresIn: '700d'
        });
    }

    static getUserData (user) {
        const userID = user._id || user.id;
        let userInfo = {
            _id: userID,
            email: user.local.email ? user.local.email.toLowerCase() : null,
            role: user.role,
            data: user.data,
            name: user.name,
            notification: user.notification
        };
        return {
            user: userInfo,
            token: 'JWT ' + Auth.generateToken(userInfo)
        };
    }

    /**
     Add password encryption and validation to user schema.
     It must be called after Schema and before model:
     var mongooseSchema = mongoose.Schema(schema, options);
     mongooseSchema = Auth.setupUserSchema(mongooseSchema); <<<<
     var model = mongoose.model('user', mongooseSchema);
     */
    setupUserSchema (UserSchema) {
        if (typeof UserSchema.methods.validPassword === 'function') {
            throw new Error('You are calling setupUserSchema() twice. Check on your schemas to ensure that just userSchema call setupUserSchema');
        }

        // checking if password is valid
        UserSchema.methods.validPassword = function (password) {
            try {
                return bcrypt.compareSync(password, this.local.password);
            } catch (error) {
                throw new Error('Error validPassword password on UserSchema validPassword');
            }
        };

        // Encrypt password
        UserSchema.pre('save', function (next) {
            try {
                var user = this;
                if (user.local.password != undefined && !user.isModified('local.password')) {
                    return next();
                }
                user.local.password = bcrypt.hashSync(user.local.password, bcrypt.genSaltSync(8), null);
                next();
            } catch (error) {
                throw new Error('Error encrypting password on UserSchema pre save');
            }
        });

        // Cache user after save
        UserSchema.post('save', function () {
            try {
                // console.log("post save");
                // console.log(this.constructor.name);
                this.cacheIt();
            } catch (error) {
                console.error(error);
                throw new Error('Error caching user after save');
            }
        });

        return UserSchema;
    }

    /**
     * sends an email/sms to the user requesting the reset and sets the request in the db
     *
     * returns an code of success/error
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    async passwordRequestCode (req, res, next) {
        if (!req.query.email) {
            let message = 'Email inválido';
            res.writeHead(422, message, {'content-type': 'text/plain'});
            res.end(message);
        }
        try {
            let user = await Auth.UserModel.findOne({'local.email': req.query.email.toLowerCase()});
            if (user) {
                let max = 9999;
                let min = 1111;
                let code = Math.floor(Math.random() * (max - min)) + min;
                let hash = md5(code);

                // set the hash in the user
                user.local.newPassWordRequestHash = hash;
                await Auth.UserModel.findByIdAndUpdate(user._id, user, {multi: false});
                const msg = `Código para redefinir senha: ${code}`;
                const html = `<p>${msg}</p>`;
                const sendTo = user.local.email;

                // send email
                try {
                    await AMMailing.sendEmail(sendTo, 'Redefinir senha', msg, html);
                    let message = 'Código enviado para o email do usuário.';
                    return res.send({message});
                } catch (error) {
                    let message = 'Ocorreu um erro ao enviar o email';
                    res.writeHead(503, {message}, {'content-type': 'text/plain'});
                    if (global.rollbar) {
                        global.rollbar.log(error);
                    }
                    return res.end(message);
                }
            } else {
                let message = 'Usuário não encontrado.';
                res.writeHead(400, {message}, {'content-type': 'text/plain'});
                return res.end(message);
            }
        } catch (error) {
            console.error(error);
            next(req, res, next, error);
        }
    }

    /**
     * verifies if the code is correct.
     * receives a code in the body and an email in the req query
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    async passwordValidateCode (req, res, next) {
        let {email} = req.query;
        let {code} = req.body;
        if (!email || !code) {
            let message = 'Parametros invalidos';
            res.writeHead(422, message, {'content-type': 'text/plain'});
            res.end(message);
        } else {
            try {
                let user = await Auth.UserModel.findOne({'local.email': req.query.email.toLowerCase()});
                if (user) {
                    if (!user.local.newPassWordRequestHash) {
                        let message = 'Usuário sem código.';
                        res.writeHead(404, message, {'content-type': 'text/plain'});
                        res.end(message);
                    }
                    let hash = md5(Number(code));
                    if (hash === user.local.newPassWordRequestHash) {
                        let message = 'Código validado com sucesso.';
                        return res.send({message});
                    } else {
                        let message = 'Código inválido.';
                        res.writeHead(403, message, {'content-type': 'text/plain'});
                        res.end(message);
                    }
                } else {
                    let message = 'Usuário não encontrado.';
                    res.writeHead(400, message, {'content-type': 'text/plain'});
                    return res.end(message);
                }
            } catch (error) {
                next(req, res, next, error);
            }
        }
    }

    /**
     * verifies if the code is correct, and if the email is correct.
     * receives a code in the body and an email and newPassword in the req query
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    async passwordReset (req, res, next) {
        let {email} = req.query;
        let {code, newPassword} = req.body;
        if (!email || !code || !newPassword) {
            let message = 'Parâmetros inválidos.';
            res.writeHead(422, message, {'content-type': 'text/plain'});
            res.end(message);
        } else {
            try {
                let user = await Auth.UserModel.findOne({'local.email': req.query.email.toLowerCase()});
                if (user) {
                    if (!user.local.newPassWordRequestHash) {
                        let message = 'Usuário sem código.';
                        res.writeHead(403, message, {'content-type': 'text/plain'});
                        res.end(message);
                    }
                    let hash = md5(Number(code));
                    if (hash === user.local.newPassWordRequestHash) {
                        let newPasswordHash = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(8), null);
                        let local = user.local;
                        local.password = newPasswordHash;
                        local.newPassWordRequestHash = null;
                        user.local = local;
                        await Auth.UserModel.findByIdAndUpdate(user._id, user, {multi: false});

                        let message = 'Senha alterada com sucesso.';
                        return res.send({message});
                    } else {
                        let message = 'Código inválido.';
                        res.writeHead(403, message, {'content-type': 'text/plain'});
                        res.end(message);
                    }
                } else {
                    let message = 'Usuário não encontrado.';
                    res.writeHead(400, message, {'content-type': 'text/plain'});
                    res.end(message);
                }
            } catch (error) {
                next(req, res, next, error);
            }
        }
    }
}

Auth.passport = null;
Auth.UserModel = null;

// Export instance
const auth = new Auth();
module.exports = auth;
