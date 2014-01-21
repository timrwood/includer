'use strict';

module.exports = TextNode;

var q = require('q');

function TextNode(filepath, contents) {
	this.contents = contents;
	this.filepath = filepath;
	this.promise = q(contents);
}

TextNode.prototype.toString = function () {
	return this.contents;
};
