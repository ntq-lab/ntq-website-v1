'use strict';

module.exports = function (Frontend, app, auth, enhance) {
    app.route(enhance.mount('/download')).get(require('../controllers/download'));
};