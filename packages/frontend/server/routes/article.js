'use strict';

var article = require('../controllers/article');

// The Package is past automatically as first parameter
module.exports = function (Frontend, app, auth, enhance) {
    app.route(enhance.mount('/articles')).get(article.list);
    app.route(enhance.mount('/article/:id')).get(article.individual);
    app.route(enhance.mount('/api/filter-articles')).get(article.filterArticles);
};