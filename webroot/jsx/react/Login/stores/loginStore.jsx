/**
 * Stores information about the currently logged in user
 *
 **/
import {Promise}				from "es6-promise";

import LoginDispatcher 			from '../dispatchers/LoginDispatcher.jsx';
import loginConstants 			from '../constants/loginConstants.jsx';
import objectAssign 			from 'object-assign';
import {EventEmitter} 			from 'events';

import CakeRouter 				from 'react/Cake/lib/CakeRouter.jsx';
import Store 					from "react/flux/lib/Store.jsx";

import AjaxFetch 				from 'react/lib/AjaxFetch.jsx';
import _ 						from 'lodash';

import ValueValidate 			from 'react/Cake/CakeForm/lib/ValueValidate.jsx';

var LOGIN_CHANGE_EVENT = 'login_change';

var _store = new Store({
	user: {},
	permissions: {}
}, LOGIN_CHANGE_EVENT);

/*
var setStore = function(varName, val) {
	return new Promise(function(resolve, reject) {
		if (typeof varName === 'object') {
			_.each(varName, function(value, key) {
				_store[key] = value;
			});
		} else {
			_store[varName] = val;
		}
		resolve();
	});
}

var change = function(varName, val, eventName) {
	if (typeof eventName === "undefined") {
		var eventName = CHANGE_EVENT;
	}
	return setStore(varName, val).then(function() {
		loginStore.emit(eventName);
	});
}
*/

var loadUserData = function(userId) {
	var url = new CakeRouter({
		prefix: 'json',
		controller: 'users',
		action: 'view',
		pass: [userId]
	}).getUrl();
	return new AjaxFetch()
		.getJSON(url)
		.then(data => {
			return _store.change("user", data.result);
		});
};

var getUserId = function() {
	return _.get(_store, "user.User.id");
}

var isUserId = function(id) {
	return ValueValidate.compare(id, getUserId(), 'Numeric');
}

var isLoggedIn = function() {
	return getUserId() > 0;
}

var isUserType = function(userType) {
	if (userType === null || typeof userType === "undefined") {
		return false;
	}
	if (typeof userType === "object") {
		for (let i in userType) {
			if (isUserType(userType[i]) === true) {
				return true;
			}
		}
	} else {
		var userTypes = _.get(_store, "user.UserType");
		for (let i in userTypes) {
			let compareField = "tag";
			if (typeof userType === "number") {
				compareField = "id";
			}
			if (userTypes[i][compareField] === userType) {
				return true;
			}
		}
	}
	return false;
};

var loginStore = objectAssign({}, EventEmitter.prototype, {
	addChangeListener: function(cb) {
		this.on(LOGIN_CHANGE_EVENT, cb);
	},
	removeChangeListener: function(cb) {
		this.removeListener(LOGIN_CHANGE_EVENT, cb);
	},
	getUserId: function() {
		return getUserId();
	},
	isUserType: function(userType) {
		return isUserType(userType);
	},
	isUserId: function(id) {
		return isUserId(id);
	},
	isLoggedIn: function() {
		return isLoggedIn();
	}
});

LoginDispatcher.register(function(payload) {
	var action = payload.action,
		data = action.data ? action.data : {};
	switch(action.actionType) {
		case loginConstants.LOAD_DATA:
			loadUserData(data.userId);
			break;
		default:
			return true;
	}
});

_store.setEmitter(loginStore);

export default loginStore;