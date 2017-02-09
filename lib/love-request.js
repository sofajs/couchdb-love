'use strict';

const Rp = require('request-promise');

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

exports.inspect = (err, result) => {

    const fs = require('fs');
    const Console = require('console').Console;
    const output = fs.createWriteStream('./log/stdout.log');
    const errorOutput = fs.createWriteStream('./log/stderr.log');

    // custom simple logger

    const logger = new Console(output, errorOutput);
    // // use it like console
    // const count = 5;
    // logger.log('count: %d', count);
    if (err) {
        logger.log('err: ' + JSON.stringify(err, 2, '\t'));
    }

    if (result) {
        logger.log('result: ' + JSON.stringify(err, 2, '\t'));
    }
    logger.log('>-----<');
};

