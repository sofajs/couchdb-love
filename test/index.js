'use strict';

// Load modules

const Code = require('code');
const Lab = require('lab');

// const Config = { host: 'http://localhost', port: 5984, username: 'sociallocal', password: 'b14sT-0ffi' };
// const User = require('../lib')(Config);

// Declare internals

const internals = {};


// Test shortcuts

const lab = exports.lab = Lab.script();
const describe = lab.experiment;
// const before = lab.before;
const expect = Code.expect;
const it = lab.test;


const Config = require('../lib/config'); // custom path to config file.
const CLove = require('../lib')(Config);

describe('/couchdb-love',  { timeout: 4000 }, () => {


    it('config loading', (done) => {

        console.log('CONFIG ' + JSON.stringify(Config));
        done();
    });

    it('make db', (done) => {

        const requestOptions = (session) => {

            return new Promise((resolve, reject) => {

                const options = {
                    method: 'PUT',
                    uri: Config.host + ':' + Config.port + '/test_uuser',
                    headers: {
                        'X-Couchdb-WWW-Authenticate': 'Cookie',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Cookie': 'AuthSession=' + session.cookie
                    },
                    resolveWithFullResponse: true,
                    json: true, // Automatically parses the JSON string in the response
                    requestError: 'Failed to destroy database \"test_uuser\".'  // @note must have for error message.
                };

                resolve(options);
            });
        };

        CLove.request(requestOptions, (err, result) => {

            expect(result.statusCode).to.equal(201);
            done(err);
        });
    });


    it('delete db', (done) => {

        const requestOptions = (session) => {

            return new Promise((resolve, reject) => {

                const options = {
                    method: 'DELETE',
                    uri: Config.host + ':' + Config.port + '/test_uuser',
                    headers: {
                        'X-Couchdb-WWW-Authenticate': 'Cookie',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Cookie': 'AuthSession=' + session.cookie
                    },
                    resolveWithFullResponse: true,
                    json: true, // Automatically parses the JSON string in the response
                    requestError: 'Failed to destroy database \"test_uuser\".'  // @note must have for error message.
                };

                resolve(options);
            });
        };

        process.env.NODE_ENV = 'production'; // for coverage

        CLove.request(requestOptions, (err, result) => {

            process.env.NODE_ENV = 'test'; // lab default is 'test'
            expect(result.statusCode).to.equal(200);
            done(err);
        });
    });


    it('request fail', (done) => {

        const requestOptions = (session) => {

            return new Promise((resolve, reject) => {

                Config.port = '5989';

                const options = {
                    method: 'DELETE',
                    uri: Config.host + ':' + Config.port + '/test_uuser',
                    headers: {
                        'X-Couchdb-WWW-Authenticate': 'Cookie',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Cookie': 'AuthSession=' + session.cookie
                    },
                    resolveWithFullResponse: true,
                    json: true, // Automatically parses the JSON string in the response
                    requestError: 'Failed to destroy database \"test_uuser\".'  // @note must have for error message.
                };

                resolve(options);
            });
        };

        CLove.request(requestOptions, (err, result) => {

            Config.port = 5984;
            expect(err.name).to.equal('Error');
            expect(err.message).to.equal('Failed to destroy database \"test_uuser\".');
            // console.log('err.name ' + err.name);
            // console.log('err: ' + JSON.stringify(err));
            // console.log('result: ' + JSON.stringify(result));
            done();
        });
    });
});
