'use strict';

/*
 * Defining the Package
 */
var mean = require('meanio'),
	Module = mean.Module;

var SystemPackage = new Module('system');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
SystemPackage.register(function (app, auth) {
	app.param('id', function (req, res, next, id) {
		req._params = req._params || {};
		req._params.id = id;
		next();
	});

	SystemPackage.enhance = require('./server/conf/enhance');

	SystemPackage.routes(app);

	return SystemPackage;
});
