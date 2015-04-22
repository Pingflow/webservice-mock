var http    = require('http'),
    path    = require('path'),
    express = require('express'),
    DataProvider = require('./data_provider');

var app     = express(),
    server  = http.createServer(app);
    
var defaultProvider = new DataProvider(),
    verbose = false,
    mountedPoints = [];

// Prevent caching of data
app.use(function(req, res, next) {
    res.header('cache-control', 'no-cache');
    res.header('pragma', 'no-cache');
    res.header('expires', '0');
    next();
});

app.get('/', function(req, res, next) {
    res.set({ 'Content-Type': 'application/json' });
    res.status(200).send({ routes: mountedPoints.map(function(point) { 
        return { route: point, full_url: req.protocol + '://' + req.get('host') + point };
    }) });
});
    
function providerMiddleware(provider) {
    var router = express.Router();
    
    if (verbose) {
        router.use(function(req, res, next) {
            console.log(req.method + ' ' + req.url);
            next();
        });
    }
    
    router.get('/get/:key', function(req, res) {
        var key = req.params.key;
        
        if (provider.data.hasOwnProperty(key)) {
            
            res.set({ 'Content-Type': 'application/json' });
            if (typeof(provider.get(key)) === 'object') {
                res.send(provider.get(key));
            } else {
                res.send({ value: provider.get(key) });
            }
        } else {
            res.status(404).send('not found');
        }
    });
    
    router.get('/functions/:func', function(req, res) {
        res.set({ 'Content-Type': 'application/json' });
        var result = provider.callMethod(req.params.func, req.query);
        
        if (typeof(result) === 'object') {
            res.send(result);
        } else {
            res.send({ value: result });
        }
    });
    
    router.get('/', function(req, res) {
        res.set({ 'Content-Type': 'application/json' });
        res.status(200).send(provider.data);
    });
    
    router.get('*', function(req, res) {
        res.status(404).send('Not found');
    });
    
    return router;
}

exports.start = function(port) {
    server.listen(port || 3000);
};

exports.loadProvider = function(filePath) {
    var provider = new DataProvider(),
        extension = path.extname(filePath),
        name = path.basename(filePath).replace(extension, ''),
        content = require(filePath);
    
    if (extension === '.json') {
        provider.data = content;
    } else if (extension === '.js') {
        Object.getOwnPropertyNames(content).forEach(function(field) {
            provider.set(field, content[field]);
        });
    } else {
        throw new Error('Cannot add content of %s in webservice-mock data', filePath);
    }
    
    exports.addProvider('/' + name, provider);
};

exports.addProvider = function(mountPoint, provider) {
    if (mountedPoints.indexOf(mountPoint) < 0) {
        mountedPoints.push(mountPoint);
    }
    app.use(mountPoint, providerMiddleware(provider));
};

exports.setVerbose = function(verbose) {
    verbose = verbose;
};

exports.setDefaults = function () {
    exports.loadProvider(__dirname + '/demo.json');
};

