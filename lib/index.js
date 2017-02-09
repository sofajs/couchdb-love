'use strict';

const CouchdbSession = require('couchdb-session');
const Rp = require('./love-request');
const Itera = require('itera');
const Configs = require('./config');

const internals = {};


module.exports = (configs) => {

    Configs.host = configs.host;
    Configs.port = configs.port;
    Configs.username = configs.username;
    Configs.password = configs.password;

    this.request = (optionsToLoad, callback) => {

        Itera(function * (cb) {

            const session = yield CouchdbSession(Configs);

            const options = yield optionsToLoad(session);

            const result = yield Rp.request(options);

            if ((result.name !== undefined) && (result.name === 'Error')) {

                // handle error
                // @todo log_error.
                return cb(result, null);
            }

            return cb(null, result);

        }, (err, result) => {

            Rp.inspect(err, result);

            if (err) {
                return callback(err, null);
            }

            return callback(null, result);
        });
    };

    return this;
};

