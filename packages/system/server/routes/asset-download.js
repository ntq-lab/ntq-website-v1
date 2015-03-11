'use strict';

module.exports = function (System, app) {
    app.route('/asset/download/:id').get(require('../controllers/asset-download'));
};