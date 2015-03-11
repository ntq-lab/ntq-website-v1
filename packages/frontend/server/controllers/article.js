'use strict';

var mongoose = require('mongoose'),
    Article = mongoose.model('Article'),
    Category = mongoose.model('Category'),
    q = require('q'),
    shuffle = require('../config/shuffle-array'),
    pageSize = 2;

function getCategoryMap(articles, categories) {
    var categoryMap = {};

    for (var index in articles) {
        categoryMap[articles[index].id] = [];
        for (var cateID1 in articles[index].categories) {
            for (var cateID2 in categories) {
                if (articles[index].categories[cateID1] === categories[cateID2].id) {
                    categoryMap[articles[index].id].push(categories[cateID2]);
                    break;
                }
            }
        }
    }

    return categoryMap;
}

function getByConditions (req, res, next) {
    var conditions = {};

    conditions.enabled = true;
    conditions.languages = res.locals.locale;

    if (!!req.query.categoryID) {
        conditions.categories = req.query.categoryID;
    }

    if (!!req.query.year || !!req.query.month) {
        var year = req.query.year || new Date().getUTCFullYear();

        var startDate = new Date();
        startDate.setUTCFullYear(year);

        var endDate = new Date();
        endDate.setUTCFullYear(year);

        if (!!req.query.month) {
            startDate.setUTCMonth(req.query.month - 1);
            startDate.setUTCDate(1);
            endDate.setUTCMonth(req.query.month);
            endDate.setUTCDate(0); // get last day of month, UTC
        } else {
            startDate.setUTCMonth(0);
            startDate.setUTCDate(1);
            endDate.setUTCMonth(11);
            endDate.setUTCDate(31);
        }

        // TODO refactor calculate datetime
        conditions.time = {
            $gte: startDate,
            $lt: endDate
        };
    }

    return conditions;
}

function getListArticles (req, conditions, getNormalArticle) {
    var normalArticles,
        currentPage = req.query.currentPage || 0,
        offsetPage = currentPage * pageSize;

    Article.find(conditions).sort({
        time: 'desc'
    }).skip(offsetPage).limit(pageSize).exec().then(function (result) {
        normalArticles = result;

        return Category.find({
            enabled: true
        }).sort({
            identifier: 'asc'
        }).exec();
    }).then(function (categories) {
        var categoryMap = getCategoryMap(normalArticles, categories);

        getNormalArticle.resolve({
            categories: categoryMap,
            articles: normalArticles
        });
    });

    return getNormalArticle.promise;
}

function getTotalPage (conditions, totalPageArticle) {
    Article.find(conditions).count().exec().then(function (count) {
        totalPageArticle.resolve(Math.ceil(count / pageSize));
    }, function (err) {
        totalPageArticle.reject(err);
    });

    return totalPageArticle.promise;
}

module.exports.list = function (req, res, next) {
    var getNormalArticle = q.defer(),
        getHighlightedArticle = q.defer(),
        listMediaArticle = q.defer(),
        listCategories = q.defer(),
        totalPageArticle = q.defer(),
        colors = ['bg-orange', 'bg-pingo', 'bg-blue', 'bg-blue-light', 'bg-green'],
        color = shuffle(colors),
        conditions = getByConditions(req, res, next),
        pendingJobs = [
            getListArticles(req, conditions, getNormalArticle),
            getHighlightedArticle.promise,
            listMediaArticle.promise,
            listCategories.promise,
            getTotalPage(conditions, totalPageArticle)
        ];

    // Get highlighted articles
    Article.find({
        highlighted: true,
        enabled: true,
        languages: res.locals.locale
    }).sort({
        time: 'desc'
    }).limit(5).exec().then(function (highlightedArticles) {
        // store result in within-scope variable
        getHighlightedArticle.resolve(highlightedArticles);
    }, function (err) {
        getHighlightedArticle.reject(err);
    });

    // Get list articles by category media
    var listCategoriesID = [];

    Category.find({
        enabled: true,
        media: true
    }).sort({
        identifier: 'asc'
    }).exec().then(function (categories) {
        for (var category in categories) {
            listCategoriesID.push(categories[category].id);
        }

        return Article.find({
            enabled: true,
            languages: res.locals.locale,
            categories: {
                $in: listCategoriesID
            }
        }).sort({
            time: 'desc'
        }).limit(5).exec();
    }).then(function (resultListMediaArticle) {
        // store result in within-scope variable
        listMediaArticle.resolve(resultListMediaArticle);
    }, function (err) {
        listMediaArticle.reject(err);
    });

    // Get list categories
    Category.find({
        enabled: true
    }).sort({
        identifier: 'asc'
    }).exec().then(function (resultListCategories) {
        // store result in within-scope variable
        listCategories.fulfill(resultListCategories);
    });

    // wait all defers finish, then render view
    q.all(pendingJobs).then(function (results) {
        // in case get all data succceed, render article page
        res.render(req.__enhance.view('article'), {
            normalArticles: results[0].articles,
            categoryMap: results[0].categories,
            highlightedArticles: results[1],
            listMediaArticles: results[2],
            listCategories: results[3],
            totalPageArticle: results[4],
            now: new Date(),
            color: color
        });
        //console.log(results[4]);
    }, function (err) {
        console.log(err);
        // TODO in case get all data failed, render error page
    });
};

module.exports.individual = function (req, res, next) {
    var selectedArticle;

    Article.findOne({
        _id: req._params.id,
        enabled: true,
        languages: res.locals.locale
    }).exec().then(function (article) {
        selectedArticle = article;

        return Article.find({
            categories: article.categories,
            enabled: true,
            languages: res.locals.locale,
            _id: {
                $ne: article.id
            }
        }).sort({
            time: 'desc'
        }).limit(5).exec();
    }).then(function (relatedArticles) {
        // in case get all data succceed, render article page
        res.render(req.__enhance.view('article-detail'), {
            article: selectedArticle,
            listRelatedArticle: relatedArticles
        });

    }, function (err) {
        res.redirect(req.__enhance.mount('/404'));
        res.status(404);
        res.end();
    });
};

module.exports.filterArticles = function (req, res, next) {
    var getNormalArticle = q.defer(),
        totalPageArticle = q.defer(),
        conditions = getByConditions(req, res, next),
        pendingJobs = [
            getListArticles(req, conditions, getNormalArticle),
            getTotalPage(conditions, totalPageArticle)
        ];

    // wait all defers finish, then render view
    q.all(pendingJobs).then(function (results) {
        // in case get all data succceed, render article page
        res.render(req.__enhance.view('list-article'), {
            normalArticles: results[0].articles,
            categoryMap: results[0].categories,
            totalPageArticle: results[1]
        });
    }, function (err) {
        console.log(err);
        // TODO in case get all data failed, render error page
    });
};