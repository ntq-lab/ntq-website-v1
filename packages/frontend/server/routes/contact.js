'use strict';
var contact = require('../controllers/contact');

module.exports = function (Frontend, app, auth, enhance) {
    app.route(enhance.mount('/contact'))
        .get(contact.render)
        .post(contact.create);
};