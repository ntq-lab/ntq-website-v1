'use strict';
var technologies = require('../controllers/technologies');

module.exports = function (Frontend, app, auth, enhance) {
    app.route(enhance.mount('/technologies')).get(technologies.render);
};