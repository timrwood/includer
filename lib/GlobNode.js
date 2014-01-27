'use strict';

module.exports = GlobNode;

var glob = require('glob'),
	q = require('q'),
	FileNode = require('./FileNode');

function GlobNode(globpath, file) {
	this.file = file;
	this.globpath = globpath;
	this.promise = expand(this);
}

function expand(node) {
	var promise = q.defer();

	glob(node.globpath, findFiles.bind(null, node, promise));

	return promise.promise;
}

function findFiles(node, promise, err, files) {
	node.nodes = files
		.filter(node.file.seen.bind(node.file))
		.map(filepathToFileNode.bind(null, node));

	if (!files.length) {
		node.file.debug('No files matched "' + node.globpath + '"');
		promise.resolve();
	} else {
		q.all(node.nodes.map(fileNodeToPromise)).then(promise.resolve);
	}
}

function filepathToFileNode(node, filepath) {
	return new FileNode(filepath, node.file);
}

function fileNodeToPromise(node) {
	return node.promise;
}

function nodeToString(node) {
	return node.toString();
}

GlobNode.prototype.toString = function () {
	return this.nodes.map(nodeToString).join(this.file.separator);
};
