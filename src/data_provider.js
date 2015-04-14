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

DataProvider.prototype.callMethod = function(methodName, params) {
    return this.methods[methodName].call(this, params);
};

module.exports = DataProvider;