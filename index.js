'use strict';

var FileNode = require('./lib/FileNode');

module.exports = function (src, opts, cb) {
	var file = new FileNode(src, opts);

	file.promise.then(function () {
		cb(null, file.toString());
	});
};

