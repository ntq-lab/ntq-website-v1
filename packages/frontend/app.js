'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module,
    favicon = require('serve-favicon'),
    config = require('./server/config'),
    i18n = require('i18n');

var Frontend = new Module('frontend');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Frontend.register(function (app, auth, system) {
    app.use(function (req, res, next) {
        res.locals.locale = i18n.getLocale(req);
        var domainElements = req.headers.host.split('.');

        if (domainElements.length > 2) {
            //have sub-domain
            domainElements.shift();
            res.locals.domain = domainElements.join('.');
        } else {
            res.locals.domain = req.headers.host;
        }

        next();
    });
    app.use(config.mount, system.enhance.init(config));

    app.use(function(req, res, next) {
        // if not static files and backend
        if (req.url.indexOf('assets') === -1 && req.url.indexOf('backend') === -1) {
            var userAgent = req.headers['user-agent'];

            if (/MSIE (\d+\.\d+);/.test(userAgent)) { //test for MSIE x.x;
                var ieversion = +RegExp.$1; // capture x.x portion and store as a number
                if (ieversion < 9) {
                    return res.render(req.__enhance.view('support-brower'));
                }
            }
        }

        next();
    });

    Frontend.routes(app, auth, system.enhance.tool(config));

    // set fav-icon
    app.use(favicon(__dirname + '/public/assets/img/favicon.ico'));

    return Frontend;
});
