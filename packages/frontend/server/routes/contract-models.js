'use strict';
var constractModels = require('../controllers/contract-models');

module.exports = function (Frontend, app, auth, enhance) {
    app.route(enhance.mount('/contract-models')).get(constractModels.render);
};