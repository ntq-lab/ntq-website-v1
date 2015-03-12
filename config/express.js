'use strict';

/**
 * Module dependencies.
 */
var mean = require('meanio'),
    compression = require('compression'),
    morgan = require('morgan'),
    consolidate = require('consolidate'),
    cookieParser = require('cookie-parser'),
    expressValidator = require('express-validator'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    mongoStore = require('connect-mongo')(session),
    helpers = require('view-helpers'),
    flash = require('connect-flash'),
    locale = require('./locale'),
    express = require('express'),
    path = require('path'),
    config = mean.loadConfig();

module.exports = function (app, passport, db) {
    // Should be placed before express.static
    // To ensure that all assets and data are compressed (utilize bandwidth)
    //app.use(compression({
    //    // Levels are specified in a range of 0 to 9, where-as 0 is
    //    // no compression and 9 is best compression, but slowest
    //    level: 9
    //}));

    app.set('showStackError', true);

    // Prettify HTML
    // app.locals.pretty = true;

    // cache=memory or swig dies in NODE_ENV=production
    app.locals.cache = 'memory';

    // Only use logger for development environment
    if (process.env.NODE_ENV !== 'production') {
        app.use(morgan('dev'));
        app.use(express.static(__dirname + '/../', {
            index: false,
            dotfiles: 'allow'
        }));
    }

    // assign the template engine to .html files
    app.engine('html', consolidate[config.templateEngine]);

    // set .html as the default extension
    app.set('view engine', 'html');

    // set root view-directory
    app.set('views', 'packages');

    // The cookieParser should be above session
    app.use(cookieParser());

    // Request body parsing middleware should be above methodOverride
    app.use(expressValidator());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(methodOverride());

    // Import the assets file and add to locals
    var assets = require('./assets');

    // Add assets to local variables
    app.use(function (req, res, next) {
        res.locals.assets = assets;

        next();
    });

    // Express/Mongo session storage
    app.use(session({
        secret: config.sessionSecret,
        store: new mongoStore({
            db: db.connection.db,
            collection: config.sessionCollection
        }),
        cookie: config.sessionCookie,
        name: config.sessionName,
        resave: true,
        saveUninitialized: true
    }));

    // Dynamic helpers
    app.use(helpers(config.app.name));

    // Use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    //mean middleware from modules before routes
    app.use(mean.chainware.before);

    // Connect flash for flash messages
    app.use(flash());

    // Add i18n
    app.use(locale.init);

    // Parse sub-domain to get preffered language
    app.use(locale.handleSubDomain);

    // Inject useful information
    app.use(function (req, res, next) {
        res.locals = res.locals || {};
        res.locals.timezoneOffset = new Date().getTimezoneOffset();
        res.locals.autoSaveLatency = 1000;

        req.__uploadDir = path.resolve(config.root, 'upload');

        next();
    });

    app.disable('x-powered-by');
};
