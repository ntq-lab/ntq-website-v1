'use strict';
var career = require('../controllers/career.js');

module.exports = function (Frontend, app, auth, enhance) {
    app.route(enhance.mount('/career')).get(career.render);
};