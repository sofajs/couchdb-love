# couchdb-love

simple couchdb love client

* [request-promise](https://www.npmjs.com/package/request-promise)  centric
    * build requestOptions as for request-promise.

* cookie authentication
    * handles session management (creation & persistence) 
    * inserts sessionid into headers.
    * increased security     
    * must configure couchdb for [cookie authentication](http://docs.couchdb.org/en/2.0.0/intro/security.html#cookie-authentication)


* performance logging 
    * query performance info logged at:
        - {logpath}/stderr.log (error logging).
        - {logpath}/stdout.log 
    * log records are JSON objects.


### configurations

**local.ini**
```
[couch_httpd_auth]
allow_persistent_cookies = true
```

**config**
```
{
  host: 'http://localhost',
  port: 5984,
  username: 'username',
  password: 'password',
  logpath: __dirname + '/../log'
};
```
logpath: where peformance log statements are stored.

### 1 init couchdb-love
```
const CLove = require('../lib')(Config);
// or
const CLove2 = new require('../lib')(Config2);
```
**note** use "new" when muliple users.   


### 2 Build a request with a promise
```
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
```

request options must be built using a promise as illustrated above.
couchdb-love utilizes promises and generator functions to build a simple request lifecycle.
Lifecycle:
* generate session
* load requestOptions
* begin logging
* execute request
* tail - print log statements
* return result to user

If you do not use a promise to load requestOptions, the lifecycle will break.

### 3 next pass requestOptions to couchdb-love
```
    const CLove = require('couchdb-love')(Config);

    CLove.request(requestOptions, (err, result) => {

        expect(result.statusCode).to.equal(201);
        done(err);
    });
```

### 4 relax and make more request




### Tests

100% test coverage
node v6.9.4

depends on: 
* couchdb-session 
* itera 
* request
* request-promise
