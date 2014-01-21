# Includer [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

> Concatenate JavaScript files with inline `include` statements.

## Introduction

When writing an application, it is a good idea to keep source files separate for easier maintenance. However, when deploying an application, it's better to combine those files for fewer http requests.

Concatenation is a fairly simple problem, but what to concatenate where is a little trickier. When files require that other files proceed them, it becomes necessary to explicitly describe the concatenation order.

Maintaining a list of files in a build task or a config file is error prone and cumbersome. The heirarchy of which files depend on which other files must be maintained in the developer's head, and distract from development.

Rather than using external lists for concatenating files, Includer uses in-file `include` statements.

## Installation

```
npm install includer --save-dev
```

## Example

Suppose we want to concat these files together.

```js
// app.js                    pages/home.js              pages/about.js
   var App = new Site();     App.home = new Page();     App.about = new Page();
   include('./pages/*');
   App.start();
```

When `app.js` is run through Includer, it will output the following.

```js
(function(){
	var App = new Site();
	(function(){
		App.home = new Page();
	})();
	(function(){
		App.about = new Page();
	})();
	App.start();
})();
```

## Usage

```js
var includer = require('includer');

// options is optional
includer('path/to/entry.js', options, function (err, data) {
	// data is the concatenated and included file contents.
	// err is an Error object or null.
});
```

Files to be concatenated.

```js
include('./a.js');  // Paths are relative to the current file.
include('b.js');    // This is equivalent to using './b.js'.
include('./c');     // If no extension is found, .js will be used.
include("./d.js");  // Single or double quotes are supported.
include('../e.js'); // Upwards directory traversal is supported.
include('./f');
include('./f.js');  // Duplicates will only be included once.
include('./*.js');  // node-glob patterns are supported.
```

## Options

## Alternatives

For other tools that are tackling the same problem in different ways, see [r.js](http://requirejs.org/docs/optimization.html), [browserify](http://browserify.org/), and [grunt-neuter](https://github.com/trek/grunt-neuter).

## Credits

Includer was inspired by [grunt-neuter](https://github.com/trek/grunt-neuter).

[npm-url]: https://npmjs.org/package/includer
[npm-image]: https://badge.fury.io/js/includer.png

[travis-url]: http://travis-ci.org/timrwood/includer
[travis-image]: https://secure.travis-ci.org/timrwood/includer.png?branch=master

[depstat-url]: https://david-dm.org/timrwood/includer
[depstat-image]: https://david-dm.org/timrwood/includer.png
