/*globals describe,it */
'use strict';

var includer = require('../index'),
	assert = require('assert'),
	path = require('path'),
	fs = require('fs');

function compare(filename, opts, done) {
	var src = path.join('test/fixtures', filename),
		dest = path.join('test/expected', filename);

	includer(src, opts, function (err, srcContents) {
		fs.readFile(dest, 'utf8', function (err, destContents) {
			assert.equal(srcContents, destContents);
			done();
		});
	});
}

describe('Includer', function () {
	it('should handle relative paths', function (done) {
		compare('relative/parent.js', {}, done);
	});

	it('should interpolate contents', function (done) {
		compare('interpolate.js', {}, done);
	});

	it('should be able to change the wrapping method', function (done) {
		compare('wrapper.js', {
			wrap : function (src) {
				return src;
			}
		}, done);
	});

	it('should be able to handle whitespace variance', function (done) {
		compare('whitespace.js', {}, done);
	});

	it('should be able to handle globbed includes', function (done) {
		compare('glob.js', {}, done);
	});

	it('should be able to change the separator', function (done) {
		compare('separator.js', {
			separator : '\n\n\n'
		}, done);
	});

	it('should not include files more than once', function (done) {
		compare('duplicates.js', {}, done);
	});

	it('should not break on recursive includes', function (done) {
		compare('recurse.js', {}, done);
	});

	it('should handle varied file names', function (done) {
		compare('extensions.js', {}, done);
	});
});