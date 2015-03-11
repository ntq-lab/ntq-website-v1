'use strict';
var about = require('../controllers/about');

module.exports = function (Frontend, app, auth, enhance) {
    app.route(enhance.mount('/about')).get(about.render);
};