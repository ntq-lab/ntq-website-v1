'use strict';

var message = require('../controllers/message');

module.exports = function (Backend, app, auth, passport, database, enhance) {
    app.route(enhance.mount('/message/inbox')).get(auth.requiresLogin, message.inbox);
    app.route(enhance.mount('/message/read/:id')).get(auth.requiresLogin, message.read);
};