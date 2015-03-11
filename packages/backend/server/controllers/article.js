'use strict';
var mongoose = require('mongoose'),
    Article = mongoose.model('Article'),
    _ = require('lodash'),
    formidable = require('formidable'),
    fs = require('fs');

var getArticleById = function (id) {
    return Article.findById(id).exec();
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
    Article.find().exec().then(function (articles) {
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
        res.jsonp({
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
            res.jsonp({
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
            res.jsonp({
                extract: extract
            });
        }
    });
};
module.exports.removeExtract = function (req, res, next) {
    var extract = req._article.extracts.id(req._params.id);
    
    if (extract.image) {
        fs.unlink(req.__uploadDir + 'img/' + extract.image);
    }
    
    extract.remove();

    req._article.save(function (err) {
        if (err) {
            res.status(500).jsonp({
                err: err
            });
        } else {
            res.jsonp({
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
        console.log(data);
        res.jsonp({
            result: data
        });
    }, function (err) {
        console.log(err);
        res.status(500).end();
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
        var dest = fs.createWriteStream(req.__uploadDir + 'img/' + fields.name, {
            flags: 'a'
        });

        source.pipe(dest);

        source.on('end', function () {
            fs.unlink(files.file.path);

            res.jsonp({
                image: fields.name
            });
        });

        source.on('error', function (err) {
            res.jsonp({
                error: err
            });
        });
    });
};
module.exports.removeImage = function (req, res, next) {
    fs.unlink(req.__uploadDir + 'img/' + req._params.id, function (err) {
        res.jsonp({
            result: err || true
        });
    });
};
module.exports.destroy = function (req, res, next) {
    var index;

    for (index in req._article.images) {
        fs.unlink(req.__uploadDir + 'img/' + req._article.images[index]);
    }

    for (index in req._article.extracts) {
        if (!!req._article.extracts[index].image) {
            fs.unlink(req.__uploadDir + 'img/' + req._article.extracts[index].image);
        }
    }

    req._article.remove(function () {
        res.redirect(req.__enhance.mount('/articles'));
    });
};