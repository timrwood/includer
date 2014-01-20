'use strict';

var path = require('path'),
	fs = require('fs'),
	splitter = require('./splitter');

module.exports = find;

function find(filepath, cb) {
	var basePath = path.dirname(filepath),
		src = fs.readFileSync(filepath, 'utf8'),
		sections = splitter.split(src);

	sections.forEach(function (section) {
		var match = splitter.match(section),
			sectionPath;

		if (match) {
			if (!path.extname(match)) {
				match += '.js';
			}
			sectionPath = path.resolve(basePath, match);
			find(sectionPath, cb);
		} else {
			cb(new Section(filepath, section));
		}
	});
}

function Section(filepath, src) {
	this.filepath = filepath;
	this.src = src;
}
