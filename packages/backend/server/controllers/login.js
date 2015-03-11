'use strict';

module.exports.render = function (req, res, next) {
    // check authentication
    if (req.isAuthenticated()) {
        // to admin dashboard
        res.redirect(req.__enhance.mount('/dashboard'));
    } else {
        // render login form
        res.render(req.__enhance.view('login'), {});
    }
};

module.exports.logout = function (req, res, next) {
    req.logout();
    res.redirect(req.__enhance.mount('/'));
};