var test = require('tape'),
    fs = require('fs'),
    path = require('path'),
    Backbone = require('backbone'),
    underTest = require('../index');

var context = {
    cacheableCalled: false,
    cacheable: function () { this.cacheableCalled = true; },
    resourcePath: '/a/random/path/simpleModel.js'
};

function createInstanceFromSource(originalSource) {
    var updatedSource = underTest.call(context, originalSource),
        Module = eval(updatedSource);

    return new Module();
}

test('should call cacheable', function (t) {
    t.plan(1);

    fs.readFile(
        path.join(__dirname, 'Test.Model.with.no.constructor.txt'),
        { encoding: 'utf-8' },
        function (err, data) {
            if (err) throw err;
            
            createInstanceFromSource(data);
            t.ok(context.cacheableCalled);
        }
    );
});

test('should do nothing if a module already has a constructor', function (t) {
    t.plan(1);

    fs.readFile(
        path.join(__dirname, 'Test.Model.with.constructor.txt'),
        { encoding: 'utf-8' },
        function (err, data) {
            if (err) throw err;
            
            var instance = createInstanceFromSource(data);
            t.equal(instance.constructor.name, '');
        }
    );
});

test('should add named constructor based on the response path', function (t) {
    t.plan(1);

    fs.readFile(
        path.join(__dirname, 'Test.Model.with.no.constructor.txt'),
        { encoding: 'utf-8' },
        function (err, data) {
            if (err) throw err;
            
            var instance = createInstanceFromSource(data);
            t.equal(instance.constructor.name, 'SimpleModel');
        }
    );
});

test('should handle resource names with dots in them', function (t) {
    t.plan(1);

    fs.readFile(
        path.join(__dirname, 'Test.Model.with.no.constructor.txt'),
        { encoding: 'utf-8' },
        function (err, data) {
            if (err) throw err;

            context.resourcePath = '/a/random/path/simple.module.with.dots.js'
            var instance = createInstanceFromSource(data);
            t.equal(instance.constructor.name, 'SimpleModuleWithDots');
        }
    );
});

test('should handle resource names with dashs in them', function (t) {
    t.plan(1);

    fs.readFile(
        path.join(__dirname, 'Test.Model.with.no.constructor.txt'),
        { encoding: 'utf-8' },
        function (err, data) {
            if (err) throw err;

            context.resourcePath = '/a/random/path/simple-Module-With-dashs.js'
            var instance = createInstanceFromSource(data);
            t.equal(instance.constructor.name, 'SimpleModuleWithDashs');
        }
    );
});