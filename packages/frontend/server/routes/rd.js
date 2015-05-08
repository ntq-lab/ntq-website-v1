'use strict';

var rd = require('../controllers/rd.js');

module.exports = function(Frontend, app, auth, enhance) {
	app.route(enhance.mount('/research-and-development')).get(rd.render);
};
