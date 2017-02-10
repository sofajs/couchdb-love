'use strict';

const Rp = require('request-promise');
const Configs = require('./config');

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


    // use it like console
    // const count = 5;
    // logger.log('count: %d', count);

    if (err) {
        logger.log('err: ' + JSON.stringify(err, 2, '\t'));
    }

    if (result) {
        logger.log('result: ' + JSON.stringify(err, 2, '\t'));
    }
    logger.log('>-----<done');
};


// exports.tail = (err, result, timeStart, timeEnd, totalTime, logpath, callback) => {
exports.tail = (checks, timeStamps, result, callback) => {

    // const existCheck = fs.existsSync(Configs.logpath)

    // if (!existCheck) {
    //     return callback(new Error('log path does not exist.'), null);
    // }

    // console.log('EXISTS: ' + existCheck);
    // 
    // const existCheck2 = fs.existsSync(Configs.logpath + '/stdout.log')

    // console.log('EXISTS: existCheck2 ' + existCheck2);

    for(let i = 0; i < checks.length; i++){

        if ((checks[i].name !== undefined) && (checks[i].name === 'Error')) {

            console.log('!!!FOUND ERROR!!!');
            // logger.log('');
            // logger.log('error', '{ status: error, timeinfo: { start: '+ timeStamps.start +', end: ' + timeStamps.end + ', total: '+ timeStamps.total + ' }, errorDetails: ' + JSON.stringify(checks[i]) +'}');

            return callback(checks[i], null);
            break;
        }
    }

    // logger.log('{ status: ok, timeinfo: { start: '+ timeStamps.start +', end: ' + timeStamps.end + ', total: '+ timeStamps.total + ' }, result: ' + JSON.stringify(result) +'}');
    console.log('DONE_TAIL');
    return callback( null, result);

    // / const fs = require('fs');
    // / const Console = require('console').Console;

    // / console.log('logpath: ' + logpath);
    // / const output = fs.createWriteStream('./log/stdout.log');
    // / const errorOutput = fs.createWriteStream('./log/stderr.log');

    // / // custom simple logger

    // / const logger = new Console(output, errorOutput);


    // use it like console
    // const count = 5;
    // logger.log('count: %d', count);

    // if (err) {
    //     logger.log(null, '{ status: error, output: ' + JSON.stringify(err));
    // }

    // if (result) {
    //     logger.log('{ status: success, output: ' + JSON.stringify(result) 
    //         + ' timeStart: ' + JSON.stringify(timeStart) + ','
    //         + ' timeEnd: ' + JSON.stringify(timeEnd) + ','
    //         + ' timeUsed: ' + JSON.stringify(totalTime));
    // }

};
