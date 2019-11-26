'use strict';

const alarmRoutes = require('./alarm-routes');
// const utilRoutes = require('./utilRoutes');

module.exports = function(app) {
	alarmRoutes(app);
	// utilRoutes(app);
};
