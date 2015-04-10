var assert       = require('assert'),
    DataProvider = require('../src/data_provider');

describe('DataProvider class test', function() {
    var myProvider = new DataProvider();
    
    it('should create DataProvider instance', function() {
        assert.ok(myProvider instanceof DataProvider);
    });
    
    it('should alter data when using set method', function() {
        myProvider.set('field1', 4);
        myProvider.set('array1', [1,2,3]);
        myProvider.set('object1', { a: 1 });
        
        assert.deepEqual(myProvider.data, {
            field1: 4,
            array1: [1, 2, 3],
            object1: { a: 1 }
        });
    });
    
    it('should get data using get method', function() {
        assert.equal(myProvider.get('field1'), 4);
        assert.equal(myProvider.get('array1').length, 3);
        assert.deepEqual(myProvider.get('object1'), { a: 1 });
        assert.equal(myProvider.get('object1').a, 1);
    });
    
    it('should add method when value passed to set is a function', function() {
        myProvider.set('count', 0);
        myProvider.set('fct1', function(req, res) {
            this.data.count++;
        });
        
        assert.equal(myProvider.get('fct1'), null);
        assert.equal(myProvider.data.fct1, null);
        assert.equal(myProvider.get('count'), 0);
        assert.equal(typeof(myProvider.methods.fct1), 'function');
    });
    
    it('should call methods within provider context', function() {
        myProvider.callMethod('fct1');
        myProvider.callMethod('fct1');
        assert.equal(myProvider.get('count'), 2);
    });
});