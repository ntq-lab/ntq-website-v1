'use strict';

var i18n = require('i18n'),
	mongoose = require('mongoose'),
	path = require('path');

var Folder = mongoose.model('Folder');

module.exports = function (req, res, next) {
	var ids = req._params.id.split('_');

	var locale = i18n.getLocale(req);

	Folder.findById(ids[0]).exec().then(function (folder) {
		var fileData = folder.files.id(ids[1]);

		if (fileData) {
			var fileAbsolutePath = path.resolve(req.__uploadDir, 'doc', fileData.file);

			var extension = fileData.file.split('.');

			var ext = extension.length > 0 ? '.' + extension[extension.length - 1] : '';

			res.download(fileAbsolutePath, fileData.name[locale] + ext);
		} else {
			res.status(400).end();
		}
	}, function (err) {
		res.status(404).end();
	});
};
