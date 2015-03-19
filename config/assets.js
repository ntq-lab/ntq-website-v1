'use strict';

var _ = require('lodash');
var assetManager = require('assetmanager');
var url = require('url');

var debug = process.env.NODE_ENV === 'development';
// var debug = false;
var tempFolders = [
	'build/.tmp',
	'packages/frontend/public/assets',
	'packages/backend/public/assets'
];
var assets;

if (debug) {
	assets = assetManager.process({
		assets: _.pick(require('./assets.json'), 'js', 'css'),
		debug: true,
		webroot: '/'
	});

	[assets.css, assets.js].forEach(function iterate(collection) {
		Object.keys(collection).forEach(function iterate(key) {
			var optKey = key;

			tempFolders.forEach(function(folder) {
				optKey = optKey.replace(folder, '');
			});

			assets[optKey] = collection[key];

			collection[key].forEach(function iterate(path, index) {
				collection[key][index] = url.resolve('/', path);
			});

			delete collection[key];
		});
	});

	delete assets.css;
	delete assets.js;
} else {
	var rev = require('../build/rev.json');

	assets = {};

	Object.keys(rev).forEach(function iterate(key) {
		var optKey = key;

		tempFolders.forEach(function(folder) {
			optKey = optKey.replace(folder, '');
		});

		assets[optKey] = [url.resolve('/', rev[key])];
	});
}

// add helpers

assets._ = function(original) {
	if (assets[original]) {
		return assets[original][0];
	} else {
		return original + '?' + Date.now();
	}
};

module.exports = assets;
