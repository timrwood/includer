/*globals describe,it */
'use strict';

var assert = require('assert'),
	splitter = require('../lib/splitter');

describe('Splitter', function () {
	it('should split include statements into separate groups', function () {
		var source = 'include("a")\nvar a = 1;\ninclude("b");\nvar b = 1;';
		var output = splitter.split(source);
		var expected = [
			'include("a")',
			'var a = 1;',
			'include("b")',
			'var b = 1;'
		];

		for (var i = 0; i < output.length && i < expected.length; i++) {
			assert.equal(output[i], expected[i]);
		}

		assert.equal(output.length, expected.length);
	});

	it('should ignore whitespace before and after include statements', function () {
		var source = '    include("a");    \nvar a = 1;\n  include("b");  \nvar b = 1;';
		var output = splitter.split(source);
		var expected = [
			'include("a")',
			'var a = 1;',
			'include("b")',
			'var b = 1;'
		];

		for (var i = 0; i < output.length && i < expected.length; i++) {
			assert.equal(output[i], expected[i]);
		}

		assert.equal(output.length, expected.length);
	});

	it('should ignore whitespace around the path quotes', function () {
		var source = 'include(  "a"  );\nvar a = 1;\ninclude(\t"b"\t);\nvar b = 1;';
		var output = splitter.split(source);
		var expected = [
			'include(  "a"  )',
			'var a = 1;',
			'include(\t"b"\t)',
			'var b = 1;'
		];

		for (var i = 0; i < output.length && i < expected.length; i++) {
			assert.equal(output[i], expected[i]);
		}

		assert.equal(output.length, expected.length);
	});

	it('should allow single or double quotes', function () {
		var source = 'include(\'a\');\nvar a = 1;\ninclude("b");\nvar b = 1;';
		var output = splitter.split(source);
		var expected = [
			'include(\'a\')',
			'var a = 1;',
			'include("b")',
			'var b = 1;'
		];

		for (var i = 0; i < output.length && i < expected.length; i++) {
			assert.equal(output[i], expected[i]);
		}

		assert.equal(output.length, expected.length);
	});

	it('should ignore commented out lines', function () {
		var source = 'include("a");\nvar a = 1;\n\\\\include("b");\nvar b = 1;';
		var output = splitter.split(source);
		var expected = [
			'include("a")',
			'var a = 1;\n\\\\include("b");\nvar b = 1;'
		];

		for (var i = 0; i < output.length && i < expected.length; i++) {
			assert.equal(output[i], expected[i]);
		}

		assert.equal(output.length, expected.length);
	});

	it('should keep contents after include statements', function () {
		var output = splitter.split('include("a");\ninclude("a"); var whitespace_3 = 3;');
		var expected = ['include("a")', 'include("a")', 'var whitespace_3 = 3;'];

		for (var i = 0; i < output.length && i < expected.length; i++) {
			assert.equal(output[i], expected[i]);
		}

		assert.equal(output.length, expected.length);
	});

	it('should be able to include multiple statements in a row', function () {
		var output = splitter.split('include("a");\ninclude("b");\ninclude("c");');
		var expected = ['include("a")', 'include("b")', 'include("c")'];

		for (var i = 0; i < output.length && i < expected.length; i++) {
			assert.equal(output[i], expected[i]);
		}

		assert.equal(output.length, expected.length);
	});
});