# Includer [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url] [![Code Climate][codeclimate-image]][codeclimate-url]

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

Suppose we want to concatenate these files together.

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

### includer(filepath, [options], callback)

```js
var includer = require('includer');

// options is optional
includer('path/to/entry.js', options, function (err, data) {
	// data is the concatenated and included file contents.
	// err is an Error object or null.
});
```

## Include Syntax

```js
include('./a.js');  // Paths are relative to the current file.
include('b.js');    // This is equivalent './b.js'.
include('./c');     // If no extension is found, '.js' will be used.
include("./d.js");  // Single or double quotes are supported.
include('../e.js'); // Upwards directory traversal is supported.
include('./f');
include('./f.js');  // Duplicates will only be included once.
include('./*.js');  // node-glob patterns are supported.
```

## Options

### `separator`

```js
includer(filepath, {
	separator : '\n\n\n'
}, cb);
```

By default, all files are joined together by a `\n`. To change this, use the `seperator` option.

### `wrap`

```js
includer(filepath, {
	wrap : function (src) {
		return '(function(){' + src + '})()';
	}
}, cb);
```

Includer will wrap all files in an IIFE by default. To change the wrapping for files, use the `wrap` option.

The `wrap` option method will be called with the file's included contents as the only argument. It should return a string with the wrapped file contents.

To not wrap files, simply return the file's included contents as is.

```js
includer(filepath, {
	wrap : function (src) {
		return src;
	}
}, cb);
```

### `debug`

```js
includer(filepath, {
	debug : true
}, cb);
```

Sometimes included globs have no matches. Includer will skip these globs silently.

If the `debug` option is true, a notification will be logged to the console when globs have no matches.

If the `debug` option is a function, it will be called with the debug message as the only parameter.

```js
includer(filepath, {
	debug : function (message) {
		logs.push(message);
	}
}, cb);
```

## Alternatives

For other tools that are tackling the same problem in different ways, see [r.js](http://requirejs.org/docs/optimization.html), [browserify](http://browserify.org/), and [grunt-neuter](https://github.com/trek/grunt-neuter).

## Credits

Includer was inspired by [grunt-neuter](https://github.com/trek/grunt-neuter).

## Changelog

See the [changelog](changelog.md)

## License

[MIT License](LICENSE)

[npm-url]: https://npmjs.org/package/includer
[npm-image]: https://badge.fury.io/js/includer.png

[travis-url]: http://travis-ci.org/timrwood/includer
[travis-image]: https://secure.travis-ci.org/timrwood/includer.png?branch=master

[depstat-url]: https://david-dm.org/timrwood/includer
[depstat-image]: https://david-dm.org/timrwood/includer.png

[codeclimate-url]: https://codeclimate.com/github/timrwood/includer
[codeclimate-image]: https://codeclimate.com/github/timrwood/includer.png
