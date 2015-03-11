'use strict';

module.exports.tool = function (config) {
    return {
        view: function (view) {
            return config.viewDir + view;
        },

        mount: function (url) {
            return config.mount + url;
        }
    };
};

module.exports.init = function (config) {
    return function (req, res, next) {
        var tool = module.exports.tool(config);

        res.locals.__enhance = req.__enhance = tool;
        next();
    };
};