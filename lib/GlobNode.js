'use strict';

module.exports = GlobNode;

var glob = require('glob'),
	q = require('q'),
	FileNode = require('./FileNode');

function GlobNode(globpath, opts) {
	this.opts = opts;
	this.globpath = globpath;
	this.expand();
}

GlobNode.prototype.expand = function () {
	var self = this,
		promise = q.defer();

	this.promise = promise.promise;

	glob(this.globpath, function (err, files) {
		self.nodes = files.map(function (filepath) {
			return new FileNode(filepath, self.opts);
		});

		q.all(self.nodes.map(function (node) {
			return node.promise;
		})).done(function () {
			promise.resolve(self.nodes);
		});
	});
};

GlobNode.prototype.toString = function () {
	var separator = this.opts.separator || '\n';

	return this.nodes.map(function (node) {
		return node.toString();
	}).join(separator);
};
