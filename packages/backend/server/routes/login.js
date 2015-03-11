'use strict';

// var login = require('../controllers/login');

// The Package is past automatically as first parameter
module.exports = function (Backend, app, auth, passport, database, enhance) {
	app.route(enhance.mount('/')).get(passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
		],
		hostedDomain: 'ntqsoft.com.vn'
	}));

	app.route('/oauth/google/callback').get(passport.authenticate('google'), function(req, res, next) {
		res.redirect(enhance.mount('/dashboard'));
	});

	app.get(enhance.mount('/logout'), function(req, res, next) {
		req.logout();
		req.session.destroy(function() {
			res.redirect(enhance.mount('/dashboard'));
		});
	});
};
