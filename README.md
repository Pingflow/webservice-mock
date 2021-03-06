Webservice-mock
===============

> Ultra simple key-value based webservice mock

[![npm version](https://badge.fury.io/js/webservice-mock.svg)](http://badge.fury.io/js/webservice-mock)

Use it as a command line tool
-----------------------------------------

You can install it with npm and serve content of a json file right away

    sudo npm install -g webservice-mock
    echo '{"a":1, "b":2, "c":[3, 4, 5]}' > abc.json
    webservice-mock abc.json
    
Then browse http://localhost:3000/abc. Notice that webservice-mock used the file name to create a route containing your sample data. This way you can add as many data sources as you want:

    webservice-mock my_directory/*.json
    
You can also get a specific value in your tree using `/get` route:

* http://localhost:3000/abc/get/a
* http://localhost:3000/abc/get/b
* http://localhost:3000/abc/get/c

### More command line options

* `--port=PORT`: choose which port/socket to listen to (default 3000)
* `--demo`: load sample data at /demo
* `--quiet`: Prevent the server to log every http request

Use it from your node js code
----------------------------

```javascript
var mock = require('webservice-mock');

// Load sample data
mock.setDefaults();

// Enable requests logging (disabled by default when using programmatically)
mock.setVerbose(true);

// Start the server
mock.start(1337);

// You can also load data after server start
mock.loadProvider('/my/dataset.json');
```
