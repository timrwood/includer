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

File.prototype.substituteMappings = function (filepath) {
    // can't just use path.sep as users may define URL-style paths
    // even on backslash-using platforms such as windows, so try
    // to detect which type of separators they're using (assuming
    // they're not mixing back and forward slashes)
    var sep = (~filepath.indexOf('/')) ? '/' : '\\',
        segments = filepath.split(sep),
        first = segments[0],
        paths, mapping;
    // exit early if there's nothing to do
    if (!(paths = this.opts.paths)) {
        return filepath;
    } 
    // check to see if there's a path mapping for first path segment
    if (mapping = paths[first]) {
        // Don't deal with tildes here, because those are handled in the 
        // filenode's `splitToGlobOrTextNode` method. All we want to do here
        // is just replace the first segment of the path with its mapping.
        // The map value is what will contain the tilde, not the map key.
        segments[0] = mapping;
        return segments.join(sep);
    }

    return filepath;
};
