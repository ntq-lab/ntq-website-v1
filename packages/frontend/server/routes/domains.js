'use strict';
var domains = require('../controllers/domains');

module.exports = function (Frontend, app, auth, enhance) {
    app.route(enhance.mount('/domains')).get(domains.render);
};