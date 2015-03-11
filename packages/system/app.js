'use strict';

/*
 * Defining the Package
 */
var mean = require('meanio'),
    Module = mean.Module;

var System = new Module('system');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
System.register(function (app, auth) {
    app.param('id', function (req, res, next, id) {
        req._params = req._params || {};
        req._params.id = id;
        next();
    });

    System.enhance = require('./server/conf/enhance');

    System.routes(app);

    return System;
});
