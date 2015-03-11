'use strict';
var article = require('../controllers/article');

module.exports = function (Backend, app, auth, passport, database, enhance) {
    app.param('articleID', article.get);
    //app.param('imageID', function(req, res, next, id) {
    //    req._image = id;
    //    next();
    //});

    app.route(enhance.mount('/article')).get(auth.requiresLogin, article.create);
    app.route(enhance.mount('/articles')).get(auth.requiresLogin, article.all);

    app.route(enhance.mount('/article/:articleID'))
        .get(auth.requiresLogin, article.show)
        .post(auth.requiresLogin, article.publish)
        .delete(auth.requiresLogin, article.destroy);

    app.route(enhance.mount('/api/article/:id'))
        .get(auth.requiresLogin, article.showJSON)
        .put(auth.requiresLogin, article.saveDraft);

    app.route(enhance.mount('/api/extract/:articleID'))
        .post(auth.requiresLogin, article.createExtract);

    app.route(enhance.mount('/api/extract/:articleID/:id'))
        .put(auth.requiresLogin, article.updateExtract)
        .delete(auth.requiresLogin, article.removeExtract);

    app.route(enhance.mount('/api/upload/image'))
        .post(auth.requiresLogin, article.uploadImage);

    app.route(enhance.mount('/api/upload/image/:id'))
        .delete(auth.requiresLogin, article.removeImage);
};