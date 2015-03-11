'use strict';
var home = require('../controllers/home');

// The Package is past automatically as first parameter
module.exports = function (Frontend, app, auth, enhance) {
    app.route(enhance.mount('/')).get(home.render);
};