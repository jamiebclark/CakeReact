import AlertDispatcher 		from '../dispatchers/AlertDispatcher.jsx';
import alertConstants 		from '../constants/alertConstants.jsx';

import objectAssign 			from 'object-assign';
import {EventEmitter} 			from 'events';
import $						from 'jquery';
import _ 						from 'lodash';

var CHANGE_EVENT = 'change';

var GLOBAL_ALERT_INDEX = 'global';

var _store = {
	alerts: {}
};

var blankAlert = {
	type: "info",
	title: "",
	message: "",
	errors: {}
};

var getAlertIndex = function(index) {
	if (typeof index === "undefined" || !index) {
		var index = GLOBAL_ALERT_INDEX;
	}
	return index;
}

var setAlert = function(alert, index) {
	var index = getAlertIndex(index);
	if (typeof alert === "string") {
		var msg = alert;
		alert = blankAlert;
		alert.message = msg;
	}
	_store.alerts[index] = alert;
}

var clearAlert = function(index) {
	var index = getAlertIndex(index);
	_store.alerts[index] = blankAlert;
}

var alertStore = objectAssign({}, EventEmitter.prototype, {
	addChangeListener: function(cb) {
		this.on(CHANGE_EVENT, cb);
	},
	removeChangeListener: function(cb) {
		this.removeListener(CHANGE_EVENT, cb);
	},
	get: function(index) {
		var index = getAlertIndex(index);
		return _store.alerts[index] ? _store.alerts[index] : blankAlert;
	}
});

AlertDispatcher.register(function(payload) {
	var action = payload.action,
		data = action.data ? action.data : {};
	switch(action.actionType) {
		case alertConstants.SET:
			setAlert(data.alert, data.index);
			alertStore.emit(CHANGE_EVENT);
			break;
		case alertConstants.CLEAR:
			clearAlert(data.index);
			alertStore.emit(CHANGE_EVENT);
			break;
		default:
			return true;
	}
});

export default alertStore;