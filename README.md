# couchdb-love

couchdb request builder.
Logs performance of every query.

### 1 init couchdb-love
```
const CLove = require('../lib')(Config);
```

Where **Config** is:
```
{
  host: 'http://localhost',
  port: 5984,
  username: 'username',
  password: 'password',
  logpath: __dirname + '/../log'
};
```

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

### 3 pass requestOptions to couchdb-love
```
    const CLove = require('couchdb-love')(Config);

    CLove.request(requestOptions, (err, result) => {

        expect(result.statusCode).to.equal(201);
        done(err);
    });
```

### 4 relax and make more request



depends on: 
* couchdb-session 
* itera 
* request
* request-promise
