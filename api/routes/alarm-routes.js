'use strict';

module.exports = function(app) {
	const alarmController = require('../controllers/alarm-controller');

	app.route('/api/alarm/setPin')
		.post(alarmController.setPin);

	app.route('/api/alarm/matchPin')
		.post(alarmController.matchPin);

	app.route('/api/alarm/changePin')
		.post(alarmController.changePin);

	app.route('/api/alarm/arm')
		.post(alarmController.armMotionDetection);

	app.route('/api/alarm/disarm')
		.post(alarmController.disarmMotionDetection);

	app.route('/api/alarm/alarmState')
		.get(alarmController.getAlarmState);

	app.route('/api/alarm/motionPic')
		.get(alarmController.getMotionPic);
};
