'use strict';

var mean = require('meanio'),
	mongoose = require('mongoose'),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	User = mongoose.model('User'),
	config = mean.loadConfig();

module.exports = function (passport) {

	// Serialize the user id to push into the session
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	// Deserialize the user object based on a pre-serialized token
	// which is the user id
	passport.deserializeUser(function (id, done) {
		User.findOne({
			_id: id
		}, done);
	});

	passport.use(new GoogleStrategy({
		clientID: config.google.clientID,
		clientSecret: config.google.clientSecret,
		callbackURL: config.google.callbackURL
	}, function (token, refreshToken, profile, done) {
		var cond;

		if (profile.emails.length > 0) {
			cond = {$or: [
				{ email: profile.emails[0].value },
				{ 'google.id': profile.id }
			]};
		} else {
			cond = { 'google.id': profile.id };
		}

		User.findOne(cond, function(error, user) {
			if (error) {
				return done(error);
			}

			if (user) {
				// login
				done(null, user, false);
			} else {
				// create & login
				user = new User({
					name: profile.displayName,
					email: profile.emails[0].value,
					provider: 'google',
					google: profile._json
				});

				user.save(function(err, newUser) {
					return done(err, newUser, true);
				});
			}
		});
	}));
};
