
//   Requires
var express = require('express');
const packag = require('../package');
var envs = require('./testConfig');
var app = express();


test('Bootstrap node-lib', () => {
    let result = require('../lib/am-bootstrap')(app, envs, packag);
    expect(result).toBe(true);
});

test('AmError setup', () => {
    let result = require('../lib/am-error')(app);
    expect(result).toBe(true);
});

