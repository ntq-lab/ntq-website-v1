'use strict';

module.exports = function (Backend, app, auth, passport, database, enhance) {
    app.route(enhance.mount('/dashboard')).get(auth.requiresLogin, function (req, res, next) {
        res.render(req.__enhance.view('dashboard'), {
            user : req.user
        });
    });
};