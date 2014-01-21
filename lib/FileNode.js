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
	this.filepath = filepath;
	this.opts = opts;
	this.expand();
}

FileNode.prototype.expand = function () {
	var self = this,
		promise = q.defer(),
		basePath = path.dirname(this.filepath);

	this.promise = promise.promise;

	fs.readFile(self.filepath, 'utf8', function (err, src) {
		self.nodes = split(src).map(function (text) {
			var matchPath = match(text);

			if (matchPath) {
				if (!path.extname(matchPath)) {
					matchPath += '.js';
				}
				return new GlobNode(path.resolve(basePath, matchPath), self.opts);
			} else {
				return new TextNode(self.filepath, text);
			}
		});

		q.all(self.nodes.map(function (node) {
			return node.promise;
		})).done(function () {
			promise.resolve(self.nodes);
		});
	});
};

FileNode.prototype.wrap = function (src) {
	if (this.opts.wrap) {
		return this.opts.wrap(src);
	}
	return '(function(){\n' + src + '\n})();';
};

FileNode.prototype.toString = function () {
	var separator = this.opts.separator || '\n';

	return this.wrap(this.nodes.map(function (node) {
		return node.toString();
	}).join(separator));
};
