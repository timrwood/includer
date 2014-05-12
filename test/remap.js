/*globals describe,it */
'use strict';

var assert = require('assert'),
	remap = require('../lib/util/remap');

describe('Remap', function () {
	var cwd = process.cwd(),
		file = {
			paths : {
				one   : '/one/path',
				two   : '/two/path/',
				three : 'three/path'
			},
			debug : function () {}
		};

	it('should replace filepaths that start with @ with their mapping', function () {
		assert.equal(remap(file, '@one/e'),       '/one/path/e');
		assert.equal(remap(file, '@one/./e'),     '/one/path/e');
		assert.equal(remap(file, '@one/../e'),    '/one/e');

		assert.equal(remap(file, '@two/e'),       '/two/path/e');
		assert.equal(remap(file, '@two/./e'),     '/two/path/e');
		assert.equal(remap(file, '@two/../e'),    '/two/e');
		assert.equal(remap(file, '@two/../../e'), '/e');

		assert.equal(remap(file, '@three/e'),       cwd + '/three/path/e');
		assert.equal(remap(file, '@three/./e'),     cwd + '/three/path/e');
		assert.equal(remap(file, '@three/../e'),    cwd + '/three/e');
		assert.equal(remap(file, '@three/../../e'), cwd + '/e');
	});

	it('should replace filepaths with either \\ or /', function () {
		assert.equal(remap(file, '@one\\e'),       '/one/path/e');
		assert.equal(remap(file, '@one\\./e'),     '/one/path/e');
		assert.equal(remap(file, '@one\\../e'),    '/one/e');

		assert.equal(remap(file, '@two\\e'),       '/two/path/e');
		assert.equal(remap(file, '@two\\./e'),     '/two/path/e');
		assert.equal(remap(file, '@two\\../e'),    '/two/e');
		assert.equal(remap(file, '@two\\../../e'), '/e');

		assert.equal(remap(file, '@three\\e'),       cwd + '/three/path/e');
		assert.equal(remap(file, '@three\\./e'),     cwd + '/three/path/e');
		assert.equal(remap(file, '@three\\../e'),    cwd + '/three/e');
		assert.equal(remap(file, '@three\\../../e'), cwd + '/e');
	});

	it('should not replace filepaths when @ is not the first character', function () {
		assert.equal(remap(file, 'other/@one/e'),       'other/@one/e');
		assert.equal(remap(file, 'other/@one/./e'),     'other/@one/./e');
		assert.equal(remap(file, 'other/@one/../e'),    'other/@one/../e');
		assert.equal(remap(file, './@one/../e'),        './@one/../e');
	});

	it('should not replace filepaths when a mapping is not specified', function () {
		assert.equal(remap(file, '@on/e'),       '@on/e');
		assert.equal(remap(file, '@on/./e'),     '@on/./e');
		assert.equal(remap(file, '@on/../e'),    '@on/../e');
	});
});
