# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
