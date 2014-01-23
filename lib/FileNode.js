'use strict';

module.exports = FileNode;

var q = require('q'),
	split = require('./util/split'),
	match = require('./util/match'),
	path = require('path'),
	fs = require('fs'),
	GlobNode = require('./GlobNode'),
	TextNode = require('./TextNode');

function FileNode(filepath, opts) {
	this.filepath = path.resolve(filepath);

	this.opts = opts = opts || {};
	opts.seen = opts.seen || {};
	opts.seen[this.filepath] = this;

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
		return new GlobNode(path.resolve(basePath, matchPath), node.opts);
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

function wrap(opts, src) {
	if (typeof opts.wrap === 'function') {
		return opts.wrap(src);
	}
	return '(function(){\n' + src + '\n})();';
}

FileNode.prototype.toString = function () {
	var separator = this.opts.separator || '\n',
		content = this.nodes.map(nodeToString).join(separator);

	if (this.nodes.filter(onlyTextNodes).length) {
		return wrap(this.opts, content);
	}

	return content;
};
