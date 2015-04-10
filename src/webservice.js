var http    = require('http'),
    path    = require('path'),
    express = require('express'),
    DataProvider = require('./data_provider');

var app     = express(),
    server  = http.createServer(app);
    
var defaultProvider = new DataProvider(),
    verbose = false;

function providerMiddleware(provider, verbose) {
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
        provider.callMethod(req.params.func, req, res);
    });
    
    router.get('*', function(req, res) {
        res.set({ 'Content-Type': 'application/json' });
        res.status(200).send(provider.data);
    });
    
    return router;
}

exports.start = function(port) {
    app.use(providerMiddleware(defaultProvider, verbose));
    
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
    app.use(mountPoint, providerMiddleware(provider));
};

exports.setVerbose = function(verbose) {
    verbose = verbose;
};

// Deprecated!
// These functions are in place for backward compatibility reason and might be removed any time
exports.set = defaultProvider.set.bind(defaultProvider);
exports.setDefaults = defaultProvider.setDefaults.bind(defaultProvider);
exports.get = defaultProvider.get.bind(defaultProvider);
