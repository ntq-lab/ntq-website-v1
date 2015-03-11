'use strict';
var mongoose = require('mongoose'),
    Category = mongoose.model('Category'),
    _ = require('lodash');

module.exports.render = function (req, res, next) {
    res.render(req.__enhance.view('category/list'));
};
module.exports.create = function (req, res, next) {
    var categoryName = {};
    for (var i in res.locals.__locale.languages) {
        categoryName[res.locals.__locale.languages[i]] = req.__('New Category') + ' ' + res.locals.__locale.languages[i];
    }

    var category = new Category({
        name: categoryName,
        enabled: false,
        identifier: new Date().getTime()
    });

    category.save(function () {
        res.jsonp({
            category: category
        });
    });
};
module.exports.save = function (req, res, next) {
    Category.findById(req._params.id).exec().then(function (category) {
        category = _.extend(category, req.body);

        category.save(function () {
            res.jsonp({
                category: category
            });
        });
    }, function (err) {
        res.status(500);
        res.jsonp(err);
    });
};
module.exports.destroy = function (req, res, next) {
    Category.findByIdAndRemove(req._params.id).exec().then(function () {
        res.jsonp({
            result: true
        });
    }, function (err) {
        res.jsonp({
            result: false,
            err: err
        });
    });
};
module.exports.all = function (req, res, next) {
    Category.find().exec().then(function (categories) {
        res.jsonp({
            categories: categories
        });
    });
};