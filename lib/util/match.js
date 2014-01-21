'use strict';

var regMatcher = /include\(\s*['"](.*)['"]/;

module.exports = function (src) {
	var match = regMatcher.exec(src);
	return match && match[1];
};
