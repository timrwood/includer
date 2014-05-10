/*globals describe,it */
'use strict';

var includer = require('../index'),
	assert = require('assert'),
	path = require('path'),
	fs = require('fs');

describe('Debugging', function () {
	it('should output information if a glob has no matches', function (done) {
		var globPath = path.resolve('test/fixtures/this-file-should-not-exist/*.js');
		var messages = [];
		var expectedMessage = [
			'No files matched "' + globPath + '"'
		].join('\n');

		includer('test/fixtures/missing-files.js', {
			debug : function (message) {
				messages.push(message);
			}
		}, function (err, data) {
			process.nextTick(function () {
				assert.equal(data, '');
				assert.equal(messages.join('\n'), expectedMessage);
				done();
			});
		});
	});

	it('should output information if a file was already seen', function (done) {
		var globPath = path.resolve('test/fixtures/a.js');
		var actualMessage = '';
		var expectedMessage = '"' + globPath + '" skipped because it was already included.';

		includer('test/fixtures/duplicates.js', {
			debug : function (message) {
				actualMessage += message;
			}
		}, function () {
			process.nextTick(function () {
				assert.equal(actualMessage, expectedMessage);
				done();
			});
		});
	});

	it('should output information if a mapping was not found', function (done) {
		var globPath = path.resolve('test/fixtures/@a/a.js');
		var actualMessage = '';
		var expectedMessage = 'No mapping for @a found in the paths config.No files matched "' + globPath + '"';

		includer('test/fixtures/path-mapping-missing.js', {
			debug : function (message) {
				actualMessage += message;
			}
		}, function () {
			process.nextTick(function () {
				assert.equal(actualMessage, expectedMessage);
				done();
			});
		});
	});

	it('should console.log information if the debug option is true', function (done) {
		var globPath = path.resolve('test/fixtures/this-file-should-not-exist/*.js');
		var actualMessage = '';
		var expectedMessage = 'No files matched "' + globPath + '"';
		var oldConsoleLog = console.log;

		console.log = function (message) {
			actualMessage = message;
		};

		includer('test/fixtures/missing-files.js', {
			debug : true
		}, function (err, data) {
			process.nextTick(function () {
				assert.equal(data, '');
				assert.equal(actualMessage, expectedMessage);
				console.log = oldConsoleLog;
				done();
			});
		});
	});

	it('should not log information if the debug option is falsy', function (done) {
		var actualMessage;
		var oldConsoleLog = console.log;

		console.log = function (message) {
			actualMessage = message;
		};

		includer('test/fixtures/missing-files.js', {
			debug : false
		}, function (err, data) {
			process.nextTick(function () {
				assert.equal(data, '');
				assert(!actualMessage);
				console.log = oldConsoleLog;
				done();
			});
		});
	});
});
