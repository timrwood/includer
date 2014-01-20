'use strict';

var find = require('./find');

module.exports = File;

function File(filepath, opts) {
	this.filepath = filepath;

	if (opts.wrap) {
		this.wrap = opts.wrap;
	}

	if (opts.seperator) {
		this.separator = opts.seperator;
	}

	this.sections = [];
}

// Used between each file.
File.prototype.separator = '\n';

// Wrap the contents of a file.
File.prototype.wrap = function (src, filepath) {
	return '(function(){\n' + src + '\n})();';
};

File.prototype.collect = function (cb) {
	find(this.filepath, function (section) {
		this.sections.push(section);
	}.bind(this));
};

File.prototype.render = function () {
	return this.sections.map(function (section) {
		return this.wrap(section.src, section.filepath);
	}.bind(this)).join(this.separator);
};
