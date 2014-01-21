'use strict';

var regSplitter = /^\s*(include\(\s*['"].*['"]\s*\));?\s*/m;

module.exports = function (src) {
	return src.split(regSplitter).map(function (src) {
		return src.replace(/^\n|\n$/g, '');
	}).filter(function (src) {
		return src.length > 0;
	});
};
