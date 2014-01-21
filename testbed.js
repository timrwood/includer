'use strict';

var FileNode = require('./lib/FileNode');

var file = new FileNode('test/fixtures/relative/parent.js', {});

file.promise.then(function (nodes) {
	console.log(nodes);

	console.log(file.toString());
});
