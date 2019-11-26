/**
 * Created by wlutz on 10/22/19.
 */

module.exports = class Constants {
	static get storageKeys() {
		return {
			ALARM_PIN: "alarm_pin",
			ALARM_STATE: "alarm_state",
			MOTION_PIC: "motion_pic"
		};
	}

	static get alarmStates() {
		return {
			ALARM_NO_PIN: "NoPin",
			ALARM_ARMED: "Armed",
			ALARM_DISARMED: "Disarmed",
			ALARM_ALARMING: "Alarming"
		};
	}
}
