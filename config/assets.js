'use strict';

var debug = process.env.NODE_ENV === 'development';
// var debug = false;
var tempFolder = 'build/.tmp';
var assets;

if (debug) {
	assets = require('./assets.json');

	[assets.css, assets.js].forEach(function iterate(collection) {
		Object.keys(collection).forEach(function iterate(key) {
			var optKey = key.replace(tempFolder, '');

			assets[optKey] = collection[key];

			delete collection[key];
		});
	});

	delete assets.css;
	delete assets.js;
} else {
	var rev = require('../build/rev.json');

	assets = {};

	Object.keys(rev).forEach(function iterate(key) {
		var optKey = key.replace(tempFolder, '');

		assets[optKey] = [rev[key]];
	});
}

module.exports = assets;
