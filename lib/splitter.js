'use strict';

var regSplitter = /^\s*(include\(\s*['"].*['"]\s*\));?\s*/m,
	regMatcher = /include\(\s*['"](.*)['"]/;

module.exports = {
	split : function (src) {
		return src.split(regSplitter).map(function (src) {
			return src.replace(/^\n|\n$/g, '');
		}).filter(function (src) {
			return src.length > 0;
		});
	},
	match : function (src) {
		var match = regMatcher.exec(src);
		return match && match[1];
	}
};
