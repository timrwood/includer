'use strict';

var path = require('path');

var remapRegex = /^@([^\\|\/]+)[\\|\/]/;

module.exports = function (file, filepath) {
	var matches = remapRegex.exec(filepath), // ['@base/', 'base']
		atMatch = matches && matches[0],     // '@base/'
		match   = matches && matches[1],     // 'base'
		replacement = file.paths[match];

	if (match && !replacement) {
		file.debug('No mapping for @' + match + ' found in the paths config.');
	}

	if (match && replacement) {
		return path.resolve(replacement, filepath.replace(atMatch, ''));
	}

	return filepath;
};
