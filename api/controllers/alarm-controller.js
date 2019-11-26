'use strict';

const HttpStatus = require('http-status-codes');
const motionAlarm = require('../../lib/motion-alarm');

exports.setPin = function(req,res) {
	console.log(`alarmController.setPin() ENTERED`);

	const pinData = req.body;
	console.log(`alarmController.setPin, pinData= ${JSON.stringify(pinData)}`);

	if ( pinData && pinData.pin ) {
		// motionAlarm.setAlarmPin(pinData.pin).then(() => exports.armMotionDetection(req, res) );
		motionAlarm.setAlarmPin(pinData.pin).then(() => {
			console.log("Pin set, returning OK");
			res.sendStatus(HttpStatus.OK)
		});
	} else {
		res.status(HttpStatus.BAD_REQUEST).send('No pinData sent!');
	}
};

exports.matchPin = function(req,res) {
	console.log(`alarmController.matchPin() ENTERED`);

	const pinData = req.body;
	console.log(`alarmController.matchPin, pinData= ${JSON.stringify(pinData)}`);

	if ( pinData && pinData.pin ) {
		motionAlarm.matchPin(pinData.pin).then((match) => {
			if ( match ) {
				res.sendStatus(HttpStatus.OK);
			} else {
				res.status(HttpStatus.UNAUTHORIZED).send('The pin entered was invalid. Please double check the information you entered and try again.');
			}
		});

	} else {
		res.status(HttpStatus.BAD_REQUEST).send('No pinData sent!');
	}
};

exports.changePin = function(req,res) {
	console.log(`alarmController.changePin() ENTERED`);

	const pinData = req.body;
	console.log(`alarmController.setPin, pinData= ${JSON.stringify(pinData)}`);

	if ( pinData && pinData.pin && pinData.currentPin ) {
		motionAlarm.matchPin(pinData.currentPin).then((match) => {
			if ( match ) {
				exports.setPin(req, res);
			} else {
				res.status(HttpStatus.UNAUTHORIZED).send('The current pin entered was invalid. Please double check the information you entered and try again.');
			}
		});

	} else {
		res.status(HttpStatus.BAD_REQUEST).send('No pinData sent!');
	}
};

exports.armMotionDetection = function(req, res) {
	console.log(`alarmController.armMotionDetection() ENTERED`);

	const pinData = req.body;
	console.log(`alarmController.armMotionDetection, pinData= ${JSON.stringify(pinData)}`);

	if ( pinData ) {
		motionAlarm.alarmPin.then((value) => {
			if ( pinData.pin === value ) {
				motionAlarm.arm();
				res.sendStatus(HttpStatus.OK);
			} else {
				res.status(HttpStatus.UNAUTHORIZED).send('The pin entered was invalid. Please double check the information you entered and try again.');
			}
		})
	} else {
		res.status(HttpStatus.BAD_REQUEST).send('No pinData sent!');
	}
};

exports.disarmMotionDetection = function(req, res) {
	console.log(`alarmController.disarmMotionDetection() ENTERED`);

	const pinData = req.body;
	console.log(`alarmController.disarmMotionDetection, pinData= ${JSON.stringify(pinData)}`);

	if ( pinData ) {
		motionAlarm.alarmPin.then((value) => {
			if ( pinData.pin === value ) {
				motionAlarm.disarm();
				res.sendStatus(HttpStatus.OK);
			} else {
				res.status(HttpStatus.UNAUTHORIZED).send('The pin entered was invalid. Please double check the information you entered and try again.');
			}
		})
	} else {
		res.status(HttpStatus.BAD_REQUEST).send('No pinData sent!');
	}
};

exports.getAlarmState = function(req, res) {
	// console.log(`alarmController.getAlarmState() ENTERED`);

	motionAlarm.alarmState.then((value) => {
		// console.log('getAlarmState(), value= ' + value);
		res.status(HttpStatus.OK).send(value);
	});
};

exports.getMotionPic = function(req, res) {
	// console.log(`alarmController.getMotionPic() ENTERED`);

	motionAlarm.motionPic.then((value) => {
		// console.log('getMotionPic(), value= ' + value);
		// console.log(typeof value);
		// console.log(JSON.stringify(value));
		if ( value ) {
			// res.status(HttpStatus.OK).write(new Buffer(value));
			res.writeHead(HttpStatus.OK, {"Content-Type": "image/jpeg"});
			res.write(new Buffer(value));
		} else
			res.status(HttpStatus.NOT_FOUND).send("Not found.");
	});
};
