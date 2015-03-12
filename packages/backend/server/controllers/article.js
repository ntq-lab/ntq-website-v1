'use strict';
var _ = require('lodash'),
	mongoose = require('mongoose'),
	formidable = require('formidable'),
	fs = require('fs'),
	path = require('path');

var Article = mongoose.model('Article');

var getArticleById = function (id) {
	return Article.findById(id).exec();
};

var buildImagePath = function(uploadDir, name) {
	return path.resolve(uploadDir, 'img', name);
};

module.exports.get = function (req, res, next, id) {
	getArticleById(id).then(function (article) {
		if (article) {
			req._article = article;
			next();
		} else {
			res.status(404);
		}
	});
};
module.exports.create = function (req, res, next) {
	var article = new Article({
		heading: 'New Article',
		enabled: false,
		time: new Date()
	});

	article.save(function () {
		res.redirect(req.__enhance.mount('/article/' + article.id));
	});
};
module.exports.all = function (req, res, next) {
	var query = Article.find().sort('-time');

	query.exec().then(function (articles) {
		res.render(req.__enhance.view('article/list'), {
			articles: articles
		});
	});
};
module.exports.show = function (req, res, next) {
	res.render(req.__enhance.view('article/detail'), {
		article: req._article
	});
};
module.exports.showJSON = function (req, res, next) {
	getArticleById(req._params.id).then(function (article) {
		res.json({
			article: article
		});
	});
};
module.exports.createExtract = function (req, res, next) {
	var index = req._article.extracts.length || 0;
	req._article.extracts.push(req.body);
	req._article.extracts[index].identifier = new Date().getTime();

	// sort by identider - ascending
	req._article.extracts.sort(function (extract1, extract2) {
		return extract1.identifier - extract2.identifier;
	});

	req._article.save(function (err) {
		if (err) {
			res.status(500).jsonp({
				err: err
			});
		} else {
			res.json({
				extract: req._article.extracts[index]
			});
		}
	});
};
module.exports.updateExtract = function (req, res, next) {
	var extract = req._article.extracts.id(req._params.id);
	extract = _.assign(extract, req.body);

	req._article.save(function (err) {
		if (err) {
			res.status(500).jsonp({
				err: err
			});
		} else {
			res.json({
				extract: extract
			});
		}
	});
};
module.exports.removeExtract = function (req, res, next) {
	var extract = req._article.extracts.id(req._params.id);

	if (extract.image) {
		fs.unlink(buildImagePath(req.__uploadDir, extract.image));
	}

	extract.remove();

	req._article.save(function (err) {
		if (err) {
			res.status(500).jsonp({
				err: err
			});
		} else {
			res.json({
				result: true
			});
		}
	});
};
module.exports.saveDraft = function (req, res, next) {
	// disable the article
	req.body.enabled = false;
	Article.update({
		_id: req._params.id
	}, req.body).exec().then(function (data) {
		res.json({
			result: data
		});
	}, function (err) {
		res.status(500).json(err);
	});
};
module.exports.publish = function (req, res, next) {
	req._article.enabled = true;

	req._article.save(function () {
		res.redirect(req.__enhance.mount('/articles'));
	});
};
module.exports.uploadImage = function (req, res, next) {
	var form = new formidable.IncomingForm();

	form.parse(req, function (err, fields, files) {
		var source = fs.createReadStream(files.file.path);

		var destPath = buildImagePath(req.__uploadDir, fields.name);

		var dest = fs.createWriteStream(destPath, {
			flags: 'a'
		});

		source.pipe(dest);

		source.on('end', function () {
			fs.unlink(files.file.path);

			res.json({
				image: fields.name
			});
		});

		source.on('error', function (err) {
			res.json({
				error: err
			});
		});
	});
};
module.exports.removeImage = function (req, res, next) {
	var destPath = buildImagePath(req.__uploadDir, req._params.id);

	fs.unlink(destPath, function (err) {
		res.json({
			result: err || true
		});
	});
};
module.exports.destroy = function (req, res, next) {
	var index,
		destPath;

	for (index in req._article.images) {
		destPath = buildImagePath(req.__uploadDir, req._article.images[index]);
		fs.unlink(destPath);
	}

	for (index in req._article.extracts) {
		if (!!req._article.extracts[index].image) {
			destPath = buildImagePath(req.__uploadDir, req._article.extracts[index].image);
			fs.unlink(destPath);
		}
	}

	req._article.remove(function () {
		res.redirect(req.__enhance.mount('/articles'));
	});
};
