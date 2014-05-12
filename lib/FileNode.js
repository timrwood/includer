'use strict';

module.exports = FileNode;

var q = require('q'),
	split = require('./util/split'),
	match = require('./util/match'),
	remap = require('./util/remap'),
	path = require('path'),
	fs = require('fs'),
	GlobNode = require('./GlobNode'),
	TextNode = require('./TextNode');

function FileNode(filepath, file) {
	this.filepath = path.resolve(filepath);

	this.file = file;
	file.see(this.filepath);

	this.promise = expand(this);
}

function expand(node) {
	var promise = q.defer();

	fs.readFile(node.filepath, 'utf8', findGlobs.bind(null, node, promise));

	return promise.promise;
}

function splitToGlobOrTextNode(node, text) {
	var basePath = path.dirname(node.filepath);
	var matchPath = match(text);

	if (matchPath) {
		if (!path.extname(matchPath)) {
			matchPath += '.js';
		}

		matchPath = remap(node.file, matchPath);

		return new GlobNode(path.resolve(basePath, matchPath), node.file);
	}

	return new TextNode(node.filepath, text);
}

function findGlobs(node, promise, err, src) {
	node.nodes = split(src).map(splitToGlobOrTextNode.bind(null, node));
	q.all(node.nodes.map(nodeToPromise)).done(promise.resolve);
}

function onlyTextNodes(node) {
	return node instanceof TextNode;
}

function nodeToPromise(node) {
	return node.promise;
}

function nodeToString(node) {
	return node.toString();
}

FileNode.prototype.toString = function () {
	var content = this.nodes.map(nodeToString).join(this.file.separator);

	if (this.nodes.filter(onlyTextNodes).length) {
		return this.file.wrap(content);
	}

	return content;
};
