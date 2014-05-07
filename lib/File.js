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

File.prototype.replaceTokens = function (filepath) {
    var base = process.cwd,
        rgx = /{{([\w\d]+)}}/,
        paths, match, key, mapping, basedMapping, fragment, mapped;
    // exit early if there's nothing to do
    if (!this.opts.paths) {
        return filepath;
    } else {
        paths = this.opts.paths;
    }
    // check for tokens in the filepath
    match = filepath.match(rgx);
    if (match) {
        // key will be at first index of match (token without the surrounding {{ }} )
        key = match[1];
        // look for a corresponding key in the paths config
        if (mapping = paths[key]) {
            // now, to be safe, instead of just doing a string replacement, we should try to resolve
            // all the bits of the path we're manipulating.  start with resolving the base with the mapping
            baseMapping = path.resolve(base, mapping);
            // now remove the token from the filepath, and resolve what's left with the baseMapping
            fragment = filepath.replace(match[0], '');
            mapped = path.resolve(baseMapping, fragment);
            return mapped;
        }
    }
    return filepath;
};
