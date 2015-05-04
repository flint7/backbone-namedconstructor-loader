# backbone-namedconstructor-loader

[![Build Status](https://travis-ci.org/flint7/backbone-namedconstructor-loader.png?branch=master)](https://travis-ci.org/flint7/backbone-namedconstructor-loader)
[![NPM version](https://badge.fury.io/js/backbone-namedconstructor-loader.svg)](http://badge.fury.io/js/backbone-namedconstructor-loader)

Add named constructors to your Backbone objects.

## Installation

```
$ npm install backbone-namedconstructor-loader --save-dev 
```

## Example

This file:

```js
// => FooModel.js
module.exports = Backbone.Model.extend({
  
    foo: 'bar'

});
```

Loaded as:

```js
var FooModel = require('backbone-namedconstructor-loader!./FooModel.js');
```

Or, via the webpack config, something like:

```js
module: {
  loaders: [
    { test: /\.js$/, loader: 'backbone-namedconstructor-loader' }
  ]
}
```

Will be output as:

```js
module.exports = Backbone.Model.extend({
  
    constructor: function FooModel() {
        Backbone.Model.prototype.constructor.apply(this, arguments);
    },
    
    foo: 'bar'
  
});
```

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

## Tests

```
$ npm test
```