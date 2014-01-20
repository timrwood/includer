'use strict';

var File = require('./lib/File');

function includer(src, opts, cb) {
	var file = new File(src, opts);

	file.collect();

	cb(null, file.render());
}

module.exports = includer;

