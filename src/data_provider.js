function DataProvider() {
    this.data = {};
    this.methods = {};
}

DataProvider.prototype.set = function(key, value) {
    
    if (typeof (value) === 'function') {
        this.methods[key] = value;
    } else {
        this.data[key] = value;
    }
};

DataProvider.prototype.get = function(key) {
    return this.data.hasOwnProperty(key) ? this.data[key] : undefined;
};

DataProvider.prototype.callMethod = function(methodName, req, res) {
    this.methods[methodName].call(this, req, res);
};

DataProvider.prototype.setDefaults = function() {
    this.data = require(__dirname + '/default_data.json');
};

module.exports = DataProvider;