# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

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