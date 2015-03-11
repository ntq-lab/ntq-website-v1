'use strict';

/*
 * Defining the Package
 */
var mean = require('meanio'),
    Module = mean.Module,
    Backend = new Module('backend'),
    config = require('./server/config'),
    mongoose = require('mongoose');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Backend.register(function (app, auth, passport, database, system) {
    // app.use(passport.initialize());
    // app.use(passport.session());

    app.use(config.mount, system.enhance.init(config));

    app.use(function (req, res, next) {
        var Message = mongoose.model('Message');
        Message.count({
            unread: true
        }, function (err, count) {
            res.locals._unreadMessageCount = count || 0;

            next();
        });
    });

    //We enable routing. By default the Package Object is passed to the routes
    Backend.routes(app, auth, passport, database, system.enhance.tool(config));

    // import css
    Backend.aggregateAsset('css', 'common.css');
    Backend.aggregateAsset('css', 'bower_component/foundation/css/foundation.css');

    return Backend;
});