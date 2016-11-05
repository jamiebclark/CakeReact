import ModelRouterDispatcher 		from "../dispatchers/ModelRouterDispatcher.jsx";
import modelRouterConstants 		from "../constants/modelRouterConstants.jsx";

import CakeRouter				from "react/Cake/lib/CakeRouter.jsx";
import Inflector				from "react/Cake/lib/Inflector.jsx";

import objectAssign 			from 'object-assign';
import {EventEmitter} 			from 'events';

import cakeFormStore			from 'react/Cake/CakeForm/stores/cakeFormStore.jsx';

var CHANGE_EVENT = "CHANGE";

var _store = {
	action: "list",
	id: false,
	urlParams: false,
	url: false,
	urlHistory: []
};

var getActionUrl = function() {
	let url = {
		controller: 'modelRouters',
		prefix: 'json',
		action: _store.view
	};
	switch (_store.view) {
		case 'view':
			url.pass = [_store.id];
			break;
		case 'edit':
			url.pass = [_store.id];
			break;
		case 'add':
			url.pass = [_store.id];
			break;
		case 'delete':
			url.pass = [_store.id];
			break;
		default:
			url.action = 'index';
			break;
	}
	// Add additional parameters to URL
	if (typeof _store.urlParams === "object") {
		for (let i in _store.urlParams) {
			url[i] = _store.urlParams[i];
		}
	}
	return new CakeRouter(url).getUrl();
}

var setView = function(action, id, params, saveBack) {
	if (typeof saveBack === "undefined" || saveBack === true) {
		_store.urlHistory.push(_.pick(_store, ['action', 'id', 'urlParams']));
	}
	_store.action = action;
	_store.id = id;
	_store.urlParams = params;

	console.log(["SETTING VIEW", _store]);
	modelRouterStore.emit(CHANGE_EVENT);
}

var goBack = function(backCount) {
	if (typeof backCount === "undefined") {
		var backCount = 1;
	}
	var index = _store.urlHistory.length - backCount;
	if (index < 0) {
		return false;
	}
	var view = _store.urlHistory[index];
	_store.urlHistory = _store.urlHistory.slice(0, index);
	setView(view.action, view.id, view.urlParams, false);
	return view;
}

var hasBack = function() {
	console.log(["HAS BACK?", (_store.urlHistory.length > 0)]);
	return _store.urlHistory.length > 0;
}


var modelRouterStore = objectAssign({}, EventEmitter.prototype, {
	addChangeListener: function(cb) {
		this.on(CHANGE_EVENT, cb);
	},
	removeChangeListener: function(cb) {
		this.removeListener(CHANGE_EVENT, cb);
	},
	getView() {
		return {
			action: _store.action,
			id: _store.id
		};
	},
	getAction() {
		return _store.action;
	},
	getId() {
		return _store.id;
	},

	hasBack() {
		return hasBack();
	}
});

ModelRouterDispatcher.register(function(payload) {
	var action = payload.action,
		data = action.data ? action.data : {};
	switch (action.actionType) {
		case modelRouterConstants.SET_VIEW:
			setView(data.action, data.id, data.params);
			break;
		case modelRouterConstants.GO_BACK:
			goBack(data.backCount);
			break;
		default:
			return true;
	}
});

export default modelRouterStore;