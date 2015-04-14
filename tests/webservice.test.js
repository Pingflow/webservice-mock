var http         = require('http'),
    assert       = require('assert'),
    webservice   = require('../src/webservice'),
    DataProvider = require('../src/data_provider');

describe('Mock webservice test', function() {
    
    var port = 45678,
        target = 'http://localhost:' + port;
    
    it('should not respond to http requests while not started', function(done) {
        http.get(target, function(res) {
            throw new Error('webservice has responded although it should not have')}
        ).on('error', function(err) {
            assert.equal(err.code, 'ECONNREFUSED');
            done();
        });
    });
    
    it('should respond to http requests', function(done) {
        webservice.start(port);
        
        http.get(target, function(res) {
            assert.ok(res);
            done();
        }).on('error', function(err) {
            throw new Error('error when sending http request to webservice')
        });
    });
    
    it('should return 404 when route is unknown', function(done) {
        http.get(target + '/demo', function(res) {
            assert.equal(res.statusCode, 404);
            done();
        });
    });
    
    it('should load sample data if required', function(done) {
        webservice.setDefaults();
        http.get(target + '/demo', function(res) {
            assert.equal(res.statusCode, 200);
            assert.ok(res.headers['content-type'].indexOf('application/json') >= 0);
            assert.ok(res.headers['content-type'].indexOf('charset=utf-8') >= 0);
            
            res.on('data', function(chunk) {
                var result = JSON.parse(chunk.toString('utf8'));
                assert.equal(result.hello, 'World');
            }).on('end', done);
        });
    });
    
    it('should get complex objects with /get route', function(done) {
        http.get(target + '/demo/get/tree', function(res) {
            assert.equal(res.statusCode, 200);
            res.on('data', function(chunk) {
                var result = JSON.parse(chunk.toString('utf8'));
                assert.equal(result.name, 'oak');
            }).on('end', done);
        });
    });
    
    it('should get scalar types as json object', function(done) {
        http.get(target + '/demo/get/counter', function(res) {
            assert.equal(res.statusCode, 200);
            assert.ok(res.headers['content-type'].indexOf('application/json') >= 0);
            res.on('data', function(chunk) {
                var result = JSON.parse(chunk.toString('utf8'));
                assert.equal(result.value, 7);
            }).on('end', done);
        });
    });
});
