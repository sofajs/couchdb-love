'use strict';

const Rp = require('request-promise');
const Configs = require('./config');
const Fs = require('fs');

exports.request = (options) => {

    return new Promise((resolve, reject) => {

        // wrap request in promise because of UnhandledPromiseRejectionWarning
        // It throws an asplode of the application.

        Rp(options)
            .then((result) => {

                resolve(result);
            })
            .catch((err) => {

                const error = new Error(options.requestError);
                error.raw = err;
                reject(error);
            });
    });
};

// exports.inspect = (err, result) => {
//
//     if (err) {
//         console.log('inspect err: ' + JSON.stringify(err, 2, '\t'));
//     }
//
//     if (result) {
//         console.log('inspect result: ' + JSON.stringify(err, 2, '\t'));
//     }
// };


// exports.tail = (err, result, timeStart, timeEnd, totalTime, logpath, callback) => {
exports.tail = (checks, timeStamps, result, callback) => {

    // check for errors

    for (let i = 0; i < checks.length; ++i) {

        if ((checks[i].name !== undefined) && (checks[i].name === 'Error')) {

            // log error message

            const error = '{ status: error, timeinfo: { start: ' + timeStamps.start + ', end: ' + timeStamps.end + ', total: ' + timeStamps.total + ' }, errorDetails: ' + JSON.stringify(checks[i]) + '}';
            Fs.appendFileSync(Configs.logpath + '/stderr.log', error + '\n');

            return callback(checks[i], null);
        }
    }

    // log successfull request details

    const message = '{ status: ok, timeinfo: { start: ' + timeStamps.start + ', end: ' + timeStamps.end + ', total: ' + timeStamps.total + ' }, result: ' + JSON.stringify(result) + '}';
    Fs.appendFileSync(Configs.logpath + '/stdout.log', message + '\n');

    return callback( null, result);
};
