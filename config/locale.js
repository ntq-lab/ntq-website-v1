'use strict';
var i18n = require('i18n');

var conf = {
    languages: [ 'en', 'ja' ],
    languageAlias: [ 'en', 'jp' ],
    defaultLocale: 'en'
};
module.exports.init = function (req, res, next) {
    //swig.locals = swig.locals || {};
    i18n.configure({
        locales: conf.languages,
        defaultLocale: conf.defaultLocale,
        cookie: 'acceptLanguage',
        directory: __dirname + '/locales',
        updateFiles: false,
        objectNotation: true
    });

    i18n.init(req, res, next);
};

module.exports.handleSubDomain = function (req, res, next) {
    var domainElements = req.headers.host.split('.');
    res.locals.__locale = conf;

    // set default language for each request
    res.setHeader('Content-Language', conf.defaultLocale);
    i18n.setLocale(req, conf.defaultLocale);

    if (domainElements.length > 2) {
        // have sub-domain
        var subDomain = domainElements.shift();

        var index = conf.languageAlias.indexOf(subDomain);

        if (index > -1) {
            i18n.setLocale(req, conf.languages[index]);
            res.setHeader('Content-Language', conf.languages[index]);
        }
    }

    next();
};