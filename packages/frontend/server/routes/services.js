'use strict';

var contact = require('../controllers/contact'),
    services = require('../controllers/services');

module.exports = function (Frontend, app, auth, enhance) {
    app.route(enhance.mount('/services'))
        .get(services.render)
        .post(contact.create);
};