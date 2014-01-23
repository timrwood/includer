'use strict';

module.exports = GlobNode;

var glob = require('glob'),
	q = require('q'),
	FileNode = require('./FileNode');

function GlobNode(globpath, opts, seen) {
	this.opts = opts;
	this.seen = seen;
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
		.filter(onlyUnseenFiles.bind(null, node.seen))
		.map(filepathToFileNode.bind(null, node));

	if (!node.nodes.length) {
		resolvePromiseWithoutNodes(promise, node);
	} else {
		resolvePromiseWithNodes(promise, node);
	}
}

function onlyUnseenFiles(seen, filepath) {
	return !seen[filepath];
}

function filepathToFileNode(node, filepath) {
	return new FileNode(filepath, node.opts, node.seen);
}

function fileNodeToPromise(node) {
	return node.promise;
}

function resolvePromiseWithoutNodes(promise, node) {
	var message = 'No files matched "' + node.globpath + '"';
	if (typeof node.opts.debug === 'function') {
		node.opts.debug(message);
	} else if (node.opts.debug) {
		console.log(message);
	}
	promise.resolve();
}

function resolvePromiseWithNodes(promise, node) {
	q.all(node.nodes.map(fileNodeToPromise)).then(promise.resolve);
}

GlobNode.prototype.toString = function () {
	var separator = this.opts.separator || '\n';

	return this.nodes.map(function (node) {
		return node.toString();
	}).join(separator);
};
