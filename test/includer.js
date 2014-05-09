/*globals describe,it */
'use strict';

var includer = require('../index'),
	assert = require('assert'),
	path = require('path'),
	fs = require('fs'),
    os = require('os');

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

	it('should not hang when including itself', function (done) {
		compare('self.js', {}, done);
	});

	it('should not deduplicate files across different runs with same config', function (done) {
		var config = {};
		compare('duplicates.js', config, function () {
			compare('duplicates.js', config, done);
		});
	});

	it('should not break on recursive includes', function (done) {
		compare('recurse.js', {}, done);
	});

	it('should handle varied file names', function (done) {
		compare('extensions.js', {}, done);
	});

	it('should not wrap files that only have GlobNodes', function (done) {
		compare('glob-only-wrapper.js', {}, done);
	});

    it('should treat leading tildes in include paths as a reference to the CWD', function (done) {
        compare('tildeMapping.js', {}, done);
    });

    it('should treat leading tildes as a reference to baseUrl option when provided', function (done) {
        compare('fixturesAsBaseUrl.js', { baseUrl: 'test/fixtures' }, done);
    });

    it('should replace the first path segment with the matching path mapping when provided', function (done) {
        var pathConfig = {
            'A': '~/test/fixtures/pathMapping/A',
            'B': '~/test/fixtures/pathMapping/B'
        };
        compare('pathMapping.js', { paths: pathConfig }, done);
    });

});
