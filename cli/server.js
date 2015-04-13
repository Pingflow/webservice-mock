#!/usr/bin/env node

var path = require('path'),
    webservice = require(__dirname + '/../src/webservice'),
    DataProvider = require(__dirname + '/../src/data_provider');

function getOptions() {
    var options = {
        port: 3000,
        verbose: true,
        sample: false,
        files: []
    };
    
    var gettingFiles = false;
    
    process.argv.forEach(function(value, index) {
        if (index <= 1) {
            return;
        }
        
        if (value.indexOf('--') === 0 && !gettingFiles) {
            var parsed = value.split('=');
            
            switch (parsed[0]) {
                case '--quiet':
                    options.verbose = false;
                    break;
                case '--sample':
                    options.sample = true;
                    break;
                case '--port':
                    options.port = parseInt(parsed[1], 10);
                    break;
            }
        } else {
            gettingFiles = true;
            options.files.push(value);
        }
    });
    
    return options;
}

function loadProviders(files) {
    files.forEach(function(filePath) {
        try {
            var absolutePath = path.resolve(filePath);
            webservice.loadProvider(absolutePath);
        } catch (err) {
            console.warn('Error when loading data from %s: %s', filePath, err.message || err.toString());
        }
    });
}

var options = getOptions();

if (options.sample) {
    webservice.setDefaults();
}

loadProviders(options.files);
webservice.setVerbose(options.verbose);
webservice.start(options.port);

console.log('Mock webservice listening to port %s', options.port);
