'use strict';

module.exports = File;

var path = require('path');

function File(opts) {
	this.opts = opts;
	this._seen = {};

	if (this.opts.separator) {
		this.separator = this.opts.separator;
	}
}

File.prototype.debug = function (message) {
	if (typeof this.opts.debug === 'function') {
		this.opts.debug(message);
	} else if (this.opts.debug) {
		console.log(message);
	}
};

File.prototype.see = function (filepath) {
	this._seen[filepath] = true;
};

File.prototype.separator = '\n';

File.prototype.wrap = function (src) {
	if (typeof this.opts.wrap === 'function') {
		return this.opts.wrap(src);
	}
	return '(function(){\n' + src + '\n})();';
};

File.prototype.seen = function (filepath) {
    // fixes inconsistent slashes in windows paths
    filepath = path.resolve(filepath);
	if (this._seen[filepath]) {
		this.debug('"' + filepath + '" skipped because it was already included.');
		return false;
	}
	return true;
};
