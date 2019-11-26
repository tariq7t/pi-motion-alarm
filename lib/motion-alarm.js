/**
 * Created by wlutz on 10/22/19.
 */
const storage = require('node-persist');
const Raspistill = require('node-raspistill').Raspistill;
const Jimp = require('jimp');
const Constants = require('./model/constants');

class MotionAlarm {
	constructor() {
		this.camera = new Raspistill({
			noFileSave: true,
			noPreview: true,
			width: 400,
			time: 1
		});

		storage.init( /* options ... */ ).then(() => {
			console.log('Storage initialized.');
			this.disarm();
			// this.arm();
			// storage.getItem(Constants.storageKeys.ALARM_STATE).then((value) => {
			// 	console.log('value= ' + value);
			// 	if ( value !== Constants.alarmStates.ALARM_DISARMED )
			// 		this.arm();
			// });
			storage.getItem(Constants.storageKeys.ALARM_PIN).then((value) => {
				console.log('ALARM_PIN= ' + value);
				if ( !value ) {
					storage.setItem(Constants.storageKeys.ALARM_STATE, Constants.alarmStates.ALARM_NO_PIN);
				}
			});
		});
	}

	_detectMotion(image1) {
		if ( this.armed  ) {
			this.camera.takePhoto().then((photo) => {
				// console.log("photo");
				Jimp.read(photo).then(image2 => {
					// console.log("read image2");
					if ( image1 ) {
						const distance = Jimp.distance(image1, image2); // perceived distance
						const diff = Jimp.diff(image1, image2); // pixel difference

						const motionDetected = (distance >= 0.15 && diff.percent >= 0.15);
						// console.log("motionDetected= " + motionDetected + ", distance= " + distance + ", diff.percent= " + diff.percent);

						if ( motionDetected) {
							storage.updateItem(Constants.storageKeys.MOTION_PIC, photo).then(() =>
								storage.setItem(Constants.storageKeys.ALARM_STATE, Constants.alarmStates.ALARM_ALARMING));
						} else {
							this._detectMotion(image1);
						}
					} else {
						this._detectMotion(image2);
					}
				})
				.catch(err => {
					console.error("read1 err: ", err);
				});
			});
		}
	}

	arm() {
		console.log("MotionAlarm.arm()");
		storage.removeItem(Constants.storageKeys.MOTION_PIC);
		storage.setItem(Constants.storageKeys.ALARM_STATE, Constants.alarmStates.ALARM_ARMED);
		this.armed = true;
		this._detectMotion(null);
	}

	disarm() {
		console.log("MotionAlarm.disarm()");
		this.armed = false;
		return storage.setItem(Constants.storageKeys.ALARM_STATE, Constants.alarmStates.ALARM_DISARMED);
	}

	matchPin(pin) {
		let match = false;

		if ( pin ) {
			return new Promise((resolve, reject) => {
				this.alarmPin.then((value => {
					resolve(pin === value);
				}))
			});
		} else {
			return Promise.resolve(false)
;		}
	}

	get alarmState() {
		return storage.getItem(Constants.storageKeys.ALARM_STATE);
	}

	get alarmPin() {
		return storage.getItem(Constants.storageKeys.ALARM_PIN);
	}

	setAlarmPin(pin) {
		return storage.setItem(Constants.storageKeys.ALARM_PIN, pin).then(() => {
			console.log("setAlarmPin() success");
			return storage.getItem(Constants.storageKeys.ALARM_STATE).then((state) => {
				console.log("setAlarmPin().slarmState= " + state);
				if ( state === Constants.alarmStates.ALARM_NO_PIN ) {
					console.log("ALARM_NO_PIN, disarming");
					// return storage.removeItem(Constants.storageKeys.ALARM_STATE);
					return this.disarm();
				} else {
					return Promise.resolve();
				}
			});
		});
	}

	get motionPic() {
		return storage.getItem(Constants.storageKeys.MOTION_PIC);
	}
}

module.exports = new MotionAlarm();
