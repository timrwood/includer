'use strict';

module.exports = GlobNode;

var glob = require('glob'),
	q = require('q'),
	FileNode = require('./FileNode');

function GlobNode(globpath, opts) {
	this.opts = opts;
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
		.filter(onlyUnseenFiles.bind(null, node.opts.seen))
		.map(filepathToFileNode.bind(null, node.opts));

	if (!node.nodes.length) {
		resolvePromiseWithoutNodes(promise, node);
	} else {
		resolvePromiseWithNodes(promise, node);
	}
}

function onlyUnseenFiles(seen, filepath) {
	return !seen[filepath];
}

function filepathToFileNode(opts, filepath) {
	return new FileNode(filepath, opts);
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
