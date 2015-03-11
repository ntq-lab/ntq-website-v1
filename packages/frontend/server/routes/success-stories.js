'use strict';
var successStories = require('../controllers/success-stories');

module.exports = function (Frontend, app, auth, enhance) {
    app.route(enhance.mount('/success-stories')).get(successStories.render);
};