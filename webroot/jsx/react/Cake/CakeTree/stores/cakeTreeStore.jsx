import CakeTreeDispatcher 		from "../dispatchers/CakeTreeDispatcher.jsx";
import cakeTreeConstants 		from "../constants/cakeTreeConstants.jsx";

import CakeRouter				from "react/Cake/lib/CakeRouter.jsx";
import Inflector				from "react/Cake/lib/Inflector.jsx";

import objectAssign 			from 'object-assign';
import {EventEmitter} 			from 'events';

import $						from "jquery";
import _						from "lodash";

import Store 					from "react/flux/lib/Store.jsx";

var CHANGE_EVENT = "CHANGE";

var _store = new Store({
	loading: false,
	cakeModel: '',
	listData: [],
	active: false
}, CHANGE_EVENT);

var getList = function(modelId) {
	var url = {
		controller: "projects",
		action: 'list',
		prefix: 'json'
	};
	if (modelId) {
		url.pass = [modelId];
	}
	url = new CakeRouter(url).getUrl();
	$.ajax({
		url: url,
		dataType: "json",
		cache: "false",
		beforeSubmit: function() {
			_store.change("loading", true);
		}.bind(this),
		complete: function() {
			_store.change("loading", false);
		}.bind(this),
		success: function(data) {
			var varName = Inflector.chain(_store.cakeModel, ["variable", "pluralize"]),
				data = data[varName] ? data[varName] : [];
			if (modelId) {
				data = data[0];
				setListDataById(modelId, data);
			} else {
				_store.change("listData", data);
			}
		}.bind(this)
	});
}

var setListDataById = function(id, value, cakeModel) {
	var path = findPathById(id, cakeModel);
	_store.change("listData", _.set(_store.listData, path, value));
}

var findPathById = function(id, cakeModel, parentPath, data) {
	if (typeof data === "undefined") {
		var data = _store.listData;
	}
	if (typeof cakeModel === "undefined" || !cakeModel) {
		var cakeModel = _store.cakeModel;
	}
	if (typeof parentPath === "undefined") {
		var parentPath = "";
	}
	for (var i in data) {
		if (data[i][cakeModel] && data[i][cakeModel].id && data[i][cakeModel].id == id) {
			return parentPath + i;
		}
		if (data[i].children) {
			var childPath = findPathById(id, cakeModel, parentPath + i + ".children.", data[i].children);
			if (childPath) {
				return childPath;
			}
		}
	}
	return false;
}

var cakeTreeStore = objectAssign({}, EventEmitter.prototype, {
	addChangeListener: function(cb) {
		this.on(CHANGE_EVENT, cb);
	},
	removeChangeListener: function(cb) {
		this.removeListener(CHANGE_EVENT, cb);
	},
	getList: function() {
		return _store.listData;
	},
	getActive: function() {
		return _store.active;
	},
	getModel: function() {
		return _store.cakeModel;
	},
	isLoading: function() {
		return _store.loading;
	}
});
_store.setEmitter(cakeTreeStore);

CakeTreeDispatcher.register(function(payload) {
	var action = payload.action,
		data = action.data ? action.data : {};
	switch (action.actionType) {
		case cakeTreeConstants.LOAD:
			if (data.cakeModel) {
				_store.cakeModel = data.cakeModel;
			}
			getList(data.id);
			break;
		case cakeTreeConstants.INSERT:
			setListDataById(data.id, data.value);
			break;
		case cakeTreeConstants.REMOVE:
			setListDataById(data.id, {});
			break;
		case cakeTreeConstants.SET:
			_store.change("listData", data.listData);
			break;
		case cakeTreeConstants.UNSET:
			_store.change("listData", {});
			break;
		case cakeTreeConstants.SET_MODEL:
			_store.change("cakeModel", data.modelName);
			break;
		case cakeTreeConstants.SET_ACTIVE:
			_store.change("active", data.id);
			break;
		default:
			return true;
	}
});

export default cakeTreeStore;