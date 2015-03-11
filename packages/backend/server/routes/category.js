'use strict';
var category = require('../controllers/category');

module.exports = function (Backend, app, auth, passport, database, enhance) {
    app.route(enhance.mount('/categories')).get(auth.requiresLogin, category.render);

    app.route(enhance.mount('/api/categories')).get(auth.requiresLogin, category.all);
    app.route(enhance.mount('/api/category')).post(auth.requiresLogin, category.create);
    app.route(enhance.mount('/api/category/:id'))
        .put(auth.requiresLogin, category.save)
        .delete(auth.requiresLogin, category.destroy);
};