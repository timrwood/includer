'use strict';

var FileNode = require('./lib/FileNode'),
	File = require('./lib/File');

module.exports = function (src, opts, cb) {
	var file = new File(opts),
		fileNode = new FileNode(src, file);

	fileNode.promise.then(function () {
		cb(null, fileNode.toString());
	});
};

