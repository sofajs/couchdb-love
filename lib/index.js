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
    Configs.logpath = configs.logpath;

    this.request = (optionsToLoad, callback) => {

        Itera(function * (cb) {

            const session = yield CouchdbSession(Configs);

            const options = yield optionsToLoad(session);

            const timeStart = Date.now();

            const result = yield Rp.request(options);

            const timeStop = Date.now();

            const checks = [session, options, result];

            const timeStamps = {
                start: timeStart,
                end: timeStop,
                total: (timeStop - timeStart)
            };

            //Rp.tail(checks, timeStamps, result, cb);

            if ((result.name !== undefined) && (result.name === 'Error')) {

                return cb(result, null);
            }

            return cb(null, result);

        }, (err, result) => {

            if (process.env.NODE_ENV === 'test') {
                Rp.inspect(err, result);
            }

            if (err) {
                return callback(err, null);
            }

            return callback(null, result);
        });
    };

    return this;
};

