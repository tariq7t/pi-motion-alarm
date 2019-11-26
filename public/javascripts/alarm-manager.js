const USE_FETCH = true;
let alarmState, currentPin, pin1, mode, alarmTimer;

$(function() {
	$("#pin_form").draggable({
		start: function( event, ui ) {
			$(this).data('preventBehaviour', true);
		}
	});
	$("#pin_form input").on('mousedown', function (e) {
		let mdown = document.createEvent("MouseEvents");
		mdown.initMouseEvent("mousedown", false, true, window, 0, e.screenX, e.screenY, e.clientX, e.clientY, true, false, false, true, 0, null);
		$(this).closest('#pin_form')[0].dispatchEvent(mdown);
	}).on('click', function(e){
		let $draggable = $(this).closest('#pin_form');
		if($draggable.data("preventBehaviour")){
			e.preventDefault();
			$draggable.data("preventBehaviour", false)
		}
	});
});

function addNumber(e){
	const box = $("#pin_box");
	const v = box.val();

	box.val(v + e.value);
}

function delNumber(){
	const box = $("#pin_box");
	const v = box.val();

	box.val( v.slice(0, -1) );
}

function clearPin() {
	$("#pin_box").val( "" );
}

function showPinPad(callback) {
	$("#manage_alarm").attr('disabled', true);
	$("#manage_pin").attr('disabled', true);
	$("#pin_form").show("fast", "swing", callback);
}

function hidePinPad(callback) {
	mode = alarmState;
	currentPin = null;
	$("#pin_form").hide("fast", "swing", callback);
	$("#manage_pin").attr('disabled', false);
	$("#manage_alarm").attr('disabled', false);
}

function togglePinPad(callback) {
	clearPin();

	if ( $("#pin_form").is(":visible") ) {
		hidePinPad(callback)
	} else {
		showPinPad(callback);
	}
}

function submitPinSuccess() {
	switch (mode) {
		case "MatchPin":
			setPinMsg("Enter new PIN");
			mode = "ChangePin";
			break;
		default:
			togglePinPad(setAlarmButton);
			monitorAlarm();
	}
}

function submitPin(e) {
	if (e.value === "") {
		alert("Please enter a PIN!");
	} else {
		if ( (mode === "NoPin") || (mode === "ChangePin") ) {
			if ( !pin1 ) {
				pin1 = e.value;
				setPinMsg("Re-enter PIN");
				clearPin();
				return;
			} else if (pin1 !== e.value ) {
				if ( mode === "NoPin" )
					setPinMsg("Set your PIN");
				else
					setPinMsg("Enter new PIN");

				alert("PINs do not match, try again!");
				clearPin();
				pin1 = null;
				return;
			}
		}

		pin1 = null;
		const data = {
			pin: e.value
		};

		// console.log("data= " + JSON.stringify(data));

		let api;

		switch (mode) {
			case "NoPin":
				api = '/api/alarm/setPin';
				break;
			case "MatchPin":
				api = '/api/alarm/matchPin';
				currentPin = data.pin;
				break;
			case "ChangePin":
				api = '/api/alarm/changePin';
				data.currentPin = currentPin;
				break;
			case "Armed":
				api = '/api/alarm/disarm';
				break;
			case "Disarmed":
				api = '/api/alarm/arm';
				break;
			case "Alarming":
				// api = '/api/alarm/arm';
				api = '/api/alarm/disarm';
				break;
		}

		console.log("submitPin(), mode= " + mode + ", api= " + api);

		if (USE_FETCH) {
			fetch(api, {
				method: 'POST',
				body: JSON.stringify(data), // data can be `string` or {object}!
				headers: {
					'Content-Type': 'application/json'
				}
			}).then(function (response) {
				// console.log("Success: status: " + response.status + ", statusText: " + response.statusText + ", body: " + response.body);
				if (response.status === 200) {
					submitPinSuccess();
				} else {
					response.text().then((val) => {
						alert(val);
					});
				}
			}).catch(function (error) {
				console.error(error)
				alert(error);
			});
		} else {
			$.ajax({
				type: "POST",
				contentType: "application/json",
				url: api,
				data: JSON.stringify(data),
				success: function (response) {
					// console.log( "Success:  " + JSON.stringify(response));
					submitPinSuccess();
				},
				error: function (response) {
					console.error("Error:  " + JSON.stringify(response));
					alert(response.responseText);
				},
			});
		}

		clearPin();
	}
}

function manageAlarm() {
	setPinMsg("Enter your current PIN");
	togglePinPad(setAlarmButton);
}

function managePin() {
	mode = "MatchPin";
	setPinMsg("Enter your current PIN");
	togglePinPad();
}

function setAlarmButton() {
	let label;

	switch (mode) {
		case "Armed":
			label = "Disarm Alarm";
			break;
		case "Alarming":
			label = "Cancel Alarm";
			break;
		case "Disarmed":
		default:
			label = "Arm Alarm";
			break;
	}

	$("#manage_alarm").val(label);
}

function isModeChangingPin() {
	return (mode === 'ChangePin' || (mode === 'MatchPin'));
}

function setPinMsg(msg) {
	const pin_msg = $("#pin_msg");

	pin_msg.val(msg);

	if ( msg )
		pin_msg.show();
	else
		pin_msg.hide();
}

function setAlarmStatus() {

	if ( !isModeChangingPin() ) {
		const alarm_status = $("#alarm_status");
		const manage_alarm = $("#manage_alarm");
		const manage_pin = $("#manage_pin");

		mode = alarmState;

		if (alarmState === 'NoPin') {
			manage_alarm.hide();
			manage_pin.hide();
			alarm_status.val("Set your Alarm Pin");
			setPinMsg("Set your PIN");
			showPinPad();
		} else {
			manage_alarm.show();
			manage_pin.show();
			alarm_status.val("Alarm is " + alarmState)
			const motion_pic = $("#motion_pic");

			if (alarmState === 'Alarming') {
				if (!motion_pic.is(":visible")) {
					// motion_pic.show("fast", "swing", () => motion_pic.attr("src", "/api/alarm/motionPic?" +  (new Date()).getTime()));
					motion_pic.attr("src", "/api/alarm/motionPic?" + (new Date()).getTime());
					setTimeout(() => {
						motion_pic.show("fast", "swing");
					}, 400);
					alarmSound.play();
				}
			} else if (motion_pic.is(":visible")) {
				motion_pic.hide("fast", "swing");
				alarmSound.stop();
			}

			setAlarmButton();
		}
	}
}

function monitorAlarm() {
	clearTimeout(alarmTimer);

	alarmTimer = setTimeout(() => {
		if ( USE_FETCH ) {
			fetch("/api/alarm/alarmState", {
				method: 'GET'
			}).then(function (response) {
				response.text().then((val) => {
					// console.log("alarmState: val= '" + val + "'");
					alarmState = val;
					if ( (mode === 'NoPin') && (mode !== alarmState) )
						hidePinPad();
					setAlarmStatus();
					monitorAlarm();
				});
			}).catch(function (error) {
				console.error(error)
				monitorAlarm();
			})
		} else {
			$.ajax({
				type: "GET",
				url: "/api/alarm/alarmState",
				success: function ( response ) {
					// console.log( "Success:  " + JSON.stringify(response));
					alarmState = response;
					if ( (mode === 'NoPin') && (mode !== alarmState) )
						hidePinPad();
					setAlarmStatus();
					monitorAlarm();
				},
				error: function ( response ) {
					console.error( "Error:  " + JSON.stringify(response));
					monitorAlarm();
				},
			});
		}
	}, 1000);
}

function alarm(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.style.display = "none";
	this.sound.loop = true;

	document.body.appendChild(this.sound);

	this.play = () => {
		this.sound.play();
	};

	this.stop = () => {
		this.sound.pause();
	}
}

$("#pin_form").hide();
let alarmSound = new alarm("/audio/siren.mp3");
// alarmSound.play();
monitorAlarm();
