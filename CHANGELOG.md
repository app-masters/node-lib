# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.1.63] - 2018-11-22
### Fixes
- Accept secondary database (hotfix)

## [2.1.61] - 2018-10-24
### Changed
- `messageKey` fixed

## [2.1.61] - 2018-10-24
### Changed
- AMMailing now has default 1000 `intervalBetweenMessages` value

## [2.1.60] - 2018-10-24
### Changed
- AMMailing now accepts `intervalBetweenMessages` config

## [2.1.58] - 2018-10-24
### Changed
- AMMailing.sendMail now accept empty text

## [2.1.5] - 2018-09-19
### Added
- Babel fixes

## [2.1.4] - 2018-09-19
### Added
- Prepublish change to reinstall dependencies properly before publish

## [2.1.3] - 2018-09-19
### Added
- Changed script to prePublish and adapted to Babel 7

## [2.1.2] - 2018-09-19
### Added
- New Method at messageRepository

## [2.0.109/2.1.1] - 2018-09-17
### Fixed
- Exporting message repository again

## [2.0.108] - 2018-09-12
### Fixed
- Sequelize Repository now correctly reports missing model setup

## [2.0.107] - 2018-09-12
### Added
- Another way to find sent message (checkMessageWasSent)
## Fixed
- Changed Repository to correctly report not started models

## [2.0.106] - 2018-09-12
## Added
- Search messages by user and subject

## [2.0.101/2.0.104] - 2018-08-21
## Changes
- Changed Api Boostrap Sequelize to not log when GETing static files

## [2.0.101/2.0.104] - 2018-08-21
## Fixed
- Fix for logging on async callbacks on am-error

## [2.0.94/2.0.100] - 2018-08-21
## Fixed
- Fix unhandledErrorHandler

## [2.0.89/2.0.93] - 2018-07-30
### Added
- Hashed Id available on message replace fields
- Method for set a message read by it's hashed id
### Fixed
- Cast _id as varchar on findByHash
- MD5 of _id.toString()
- CamelCase on dateRead attribute

## [2.0.88] - 2018-07-18
### Changed
- Check name of socialLogin only on Facebook

## [2.0.85/2.0.87] - 2018-07-16
### Fixed
- Message now have dateError and error fields to register when something goes wrong

## [2.0.82/2.0.84] - 2018-07-12
### Added
- databaseObjectToInstance added to model

## [2.0.81] - 2018-07-11
### Added
- modelSequelize now exposes method "create" correctly

## [2.0.80] - 2018-07-05
### Added
- repository.exists({field:value});
- req.saveSession()

## [2.0.78] - 2018-07-05
### Fixed
- Auth socialLogin correctly throws errors

## [2.0.76/2.0.77] - 2018-07-03
### Added
- query and queryOne added to modelSequelize to suport raw queries

## [2.0.75] - 2018-07-02
### Changed
- Code cleaning
- Now {{forgotten}} markups are removed before sending mail

## [2.0.74] - 2018-07-02
### Changed
- Auth facebook login can receive another social network

## [2.0.73] - 2018-07-02
### Fixed
- Fix email and localEmail on first login object at amAuth

## [2.0.64/2.0.72] - 2018-06-29
### Changed
- Break changes in MessageSequelize and AmMailing

## [2.0.62/2.0.63] - 2018-06-26
### Changed
- Rollbar info on am-auth jwt payload

## [2.0.61] - 2018-06-25
### Changed
- Change on delete() in instance

## [2.0.60] - 2018-06-25
### Changed
- changed wherez to where on modelSequelize.delete()

## [2.0.59] - 2018-06-20
### Changed
- find() method now supports attributes field

## [2.0.58] - 2018-06-06
### Changed
- More adjustments on templating email to work with config....

## [2.0.57] - 2018-06-06
### Changed
- Adjusted mail and tests to work with templated mail

## [2.0.56] - 2018-06-04
### Changed
- adjusted find to work with limit while querying

## [2.0.55] - 2018-05-29
### Changed
- adjusted auth to work with password redefining

## [2.0.54] - 2018-05-28
### Changed
- rollbar_person is not required for send errors to Rollbar

## [2.0.48/2.0.53] - 2018-05-24
### Changed
- Rollbar only and always required on production
- Facebook login method separated from the route
- Facebook login method is not static

## [2.0.46/2.0.47] - 2018-05-23
### Changed
- Auth facebookLogin refactor for sequelize
- Rollbar required error only when rollbarToken is not defined

## [2.0.45] - 2018-05-21
### Changed
- disableTouch on session

## [2.0.43/2.0.44] - 2018-05-17
### Changed
- Getting auth errors on view
- Send name as status

## [2.0.42]
### Changed
- Remodelled sequelizeMessage


## [2.0.39/2.0.41]
### Changed
- Added sign public method
- Removing name from localSignup

## [2.0.37]
### Changed
- Added getUserData public method

## [2.0.36/2.0.38]
### Changed
- Added optional callback to sequelize/auth
- Added getUserData public method
- Removed optional callback to sequelize/auth

## [2.0.33/2.0.35] - 2018-05-04
### Fixed
- Finale now have a default include of Sequelize
- SequelizeModel can receive more than just a string
- SequelizeModel.find need a arrow function on instance creation
- Removing asCallback from Auth

## [2.0.32] - 2018-05-03
### Changed
- Fix person rollbar flow at AM-Error.

## [2.0.31] - 2018-05-03
### Changed
- Session fixes

## [2.0.30] - 2018-04-30
### Changed
- Schema check on save and update

## [2.0.14/2.0.29] - 2018-04-27
### Added
- postinstall on package to generate build folder
- modelOptions.freezeTableName default to true on all repository
- Added config.session and session control over API

## [2.0.11/2.0.13] - 2018-04-26
### Fixed
- Fix authentication with sequelize
### Changed
- Moved sequelize classes to "sequelize" folder on lib (WIP)
- Removed sequelize first parans in modem and instance setup (breaking change)
- Added flow to dependence on package

## [2.0.7/2.0.10] - 2018-04-20
### Fixed
- Old apiBootstrap to work just with mongoose, and force to set database drive on config
- Removed very old am-boostrap

## [2.0.6] - 2018-04-16
### Fixed
- ModelSequelize.save() only updates one register

## [2.0.2/2.0.5] - 2018-04-13
### Added
- updateOne method added to modelSequelize
- On dev, .env can load the DATABASE_URL

## [2.0.0/2.0.1] - 2018-04-11
### Added
- [New major] modelSequelize is now available
### Fixed
- Export on repository

## [1.1.77] - 2018-03-16
### Fixed
- AMMailing now saves the correct config

## [1.1.72/1.1.76] - 2018-03-14
### Fixed
- Adding the notification.notifyAll method to easily send notifications to everyone
- Adding the notification.notifyAdmin method to easily send notifications to all admins
- Changing the message on notifyAdmin method

- AMMailing getting the correct config
## [1.1.70/1.1.71] - 2018-03-13
### Fixed
- Setting NODE_ENV as 'development' on the bootstrap
- Database is now defined on env

## [1.1.69] - 2018-03-12
### Fixed
- Util isValidObjectId fix

## [1.1.68] - 2018-03-12
### Changed
- Fixing an error on the save user token, preventing injection and user token errors

## [1.1.59/1.1.67] - 2018-03-09
### Changed
- Forcing prod config, to not store sensible database url data on file

## [1.1.58] - 2018-03-06
### Changed
- Added a new error catcher on the notification.send method. Now it verifies if it has tokens.lenght > 0 before sending notifications

## [1.1.54/1.1.57] - 2018-03-05
### Changed
- Calling the getUserData on the save token method on notification
- deleting all console.log
- Fixed amAuth client-version

## [1.1.53] - 2018-03-02
### Changed
- Fixing promise issues on findOneAndUpdate
- Fixing errors on addUserToken
- AmAuth on login now returns the notification object

## [1.1.49/1.1.52] - 2018-03-01
### Added
- Notification.saveUserToken added
### Changed
- Notification.send changed to support the new way to save the tokens on the user schema
- Certifying if the 'notification.[platform].token' exists on Notification.setup calling the amauth.certifySchemaAttributes
- Fixed the static method call on Notification saveUserToken

## [1.1.45/1.1.48] - 2018-02-26
### Added
- Notification schema added
- Notification class to manage fcm messaging added

## [1.1.42/1.1.44] - 2018-02-16
### Changed
- AMMailing.sendEmail now throws error on a catch situation
- Message.send is the router method now. It receives req, res and next to follow the patterns.

## [1.1.36/1.1.41] - 2018-02-16
### Added
- sign method that accept the full user object

## [1.1.35] - 2018-02-08
### Added
- Message class, to easy send emails with custom fields, and store then on database
- Stats class, to quickly create dashboard data
- AMAuth.certifyLastAtributes added. This method certifies that the new added user atributes is correct
### Changed
- Fields added on User: lastAccessDate, initialClient, initialClientVersion, lastClient, lastClientVersion
- AMAuth.requireAuth now calls the AMAuth.certifyLastAtributes passing the headers and the actual user

## [1.1.32/1.1.34] - 2018-02-02
### Changed
- Fixed inviteSchema for tests
- AMInvite.getUserLink() little refactor
- AMInvite.addInvite() removed inviteUrl from body and added all the fields and now send the e-mail directly
- Catching errors of send e-mail

## [1.1.29/1.1.31] - 2018-01-03
### Added
- Fixing "missing password" on login
### Changed
- 'del' changed to 'delete'

## [1.1.27/1.1.28] - 2017-12-22
### Added
- config.security.singleLoginSignup added, to allow user to login/signup at login route

## [1.1.26] - 2017-12-20
### Added
- extraRoutes on nodeRestful

## [1.1.25] - 2017-12-18
### Changed
- token size limited

## [1.1.22/1.1.24] - 2017-12-15
### Added
- exposeModelMethods added to AMRouter and nodeResful

## [1.1.21] - 2017-12-14
### Changed
- User now cache itself after save

## [1.1.20] - 2017-12-6
### Fixed
- support body limit to 50 mb

## [1.1.19] - 2017-11-29
### Fixed
- shouldUseAtomicUpdate must be false to "pre" hooks work as expected

## [1.1.18] - 2017-11-27
### Fixed
- updateOptions added to registerMultipleRoutes

## [1.1.15 / 1.1.17] - 2017-11-21
### Fixed
- Morgan console log fixed

## [1.1.13 / 1.1.14] - 2017-11-20
### Added
- nodeRestful added with registerMultipleRoutes

## [1.1.11 / 1.1.12] - 2017-11-20
### Changed
- Changed AMError to have .init() and .listen() methods, to catch all errors during api lifetime

## [1.1.6] / [1.1.10] - 2017-11-14
### Added
- Am-Mailing in ApiBootstrap
- New Password request flow in am-auth
- md5 and am-mailing Import
- Fix in find and Update user

## [1.1.5] - 2017-11-13
### Added
- ApiBootstrap Added

## [1.1.4] - 2017-11-13
### Changed
- Added some try catch on user bcrypt

## [1.1.3] - 2017-11-6
### Changed
- Version on package (shame)

## [1.1.2] - 2017-11-6
### Added
- util.isValidObjectId added

## [1.1.1] - 2017-10-31
### Added
- 'client-env' added as headers accepted

## [1.1.0] - 2017-10-31
### Added
- This change log!

### Changed
- AMAuth will check if user model have mongoose plugin on it

### Removed
- Some old code (just to save this section here)
