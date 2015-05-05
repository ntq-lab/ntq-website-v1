'use strict';

var rd = require('../controllers/rd.js');

module.exports = function(Frontend, app, auth, enhance) {
	app.route(enhance.mount('/rd')).get(rd.render);
};
