import {Promise}				from "es6-promise";
import React 					from 'react';

import CakeFormDispatcher 		from '../dispatchers/CakeFormDispatcher.jsx';
import cakeFormConstants 		from '../constants/cakeFormConstants.jsx';

import CakeRouter 				from "react/Cake/lib/CakeRouter.jsx";
import Inflector 				from "react/Cake/lib/Inflector.jsx";

import alertActions 			from 'react/Alert/actions/alertActions.jsx';

import objectAssign 			from 'object-assign';
import {EventEmitter} 			from 'events';
import $						from 'jquery';
import AjaxFetch 				from 'react/lib/AjaxFetch.jsx';

import _ 						from 'lodash';

import Store 					from "react/flux/lib/Store.jsx";
import DataDeep 				from "react/flux/lib/DataDeep.jsx";

import fetch 					from "fetch-ie8";

var CHANGE_EVENT 	= 'change';
var ACTIVE_EVENT 	= 'active';
var SAVED_EVENT 	= 'saved';
var LOADED_EVENT 	= 'loaded';
var DELETED_EVENT  	= 'deleted';

/*
var _store = new Store({
	DataLoaded: 		new DataDeep(),
	Data: 				new DataDeep(),
	unmountedData: 		{},
	validationErrors: 	[],
	inputLocations: 	{},

	result: 			{},

	formElements: 		{},
	cakeModel: 			null,
	url: 				"",
	index: 				false,
	pass: 				{},
	loading: 			false,
	active: 			true,
	status: 			{},
	associatedIdsToDelete: 	{},
	timesLoaded: 		0
}, CHANGE_EVENT);
*/

var _store = {
	currentModelName: null,
	modelStores: {}
};

var _modelStore = {
	DataLoaded: 		new DataDeep(),
	Data: 				new DataDeep(),
	unmountedData: 		{},
	validationErrors: 	[],
	inputLocations: 	{},

	result: 			{},

	formElements: 		{},
	cakeModel: 			null,
	url: 				"",
	index: 				false,
	pass: 				{},
	loading: 			false,
	active: 			true,
	status: 			{},
	associatedIdsToDelete: 	{},
	timesLoaded: 		0
};

var alertIndexes = {
	global: 	null,
	local: 		'CakeFormAlert'
};

var setModel = function(modelName) {
	if (typeof modelName === "undefined" || modelName === null) {
		modelName = getModel(modelName);
	}
	_store.currentModelName = modelName;
}

var getModel = function(modelName) {
	if (typeof modelName === "undefined" || modelName === null) {
		modelName = _store.currentModelName;
	}
	return modelName;
}

var createModelStore = function(modelName) {
	var modelName = getModel(modelName),
		store = new Store(_modelStore, getModelEvent(CHANGE_EVENT, modelName));
	store.cakeModel = modelName;
	store.setEmitter(cakeFormStore);
	return store;
}

var getModelStore = function(modelName) {
	if (typeof modelName === "undefined") {
		modelName = getModel(modelName);	
	}
	if (typeof _store.modelStores[modelName] === "undefined") {
		_store.modelStores[modelName] = createModelStore(modelName);
	}
	return _store.modelStores[modelName];
}

var getModelEvent = function(eventName, modelName) {
	return getModel(modelName) + '_' + eventName;
}

var setData = function(data, modelName) {
	getModelStore(modelName).Data = new DataDeep(data);
}

var setVal = function(key, val, modelName) {
	if (typeof key === "object") {
		for (let i in key) {
			setVal(i, key[i], modelName);
		}
	} else {
		//console.trace(["SETTING TO STORE", getCakeKey(key, modelName), val]);
		getModelStore(modelName).Data.setVal(getCakeKey(key, modelName), val);
	}
}

var unsetData = function(modelName) {
	getModelStore(modelName).Data.delete();
}

var unsetVal = function(key, modelName) {
	getModelStore(modelName).Data.unsetVal(getCakeKey(key, modelName));
}

var getLocation = function(key, modelName) {
	return getModelStore(modelName).inputLocations[getCakeKey(key, modelName)];
}

var setLocation = function(key, inputId, modelName) {
	getModelStore(modelName).inputLocations[getCakeKey(key, modelName)] = inputId;
}

// Stores values being unmounted for use later
var setValUnmounted = function(key, val, modelName) {
	unsetVal(key, modelName);
	getModelStore(modelName).unmountedData[key] = val;
}
var unsetValUnmounted = function(key, modelName) {
	delete(getModelStore(modelName).unmountedData[key]);
}

// Retrieves values that have possibly been unmounted
var getUnmounted = function(key, modelName) {
	var val = null;
	if (typeof getModelStore(modelName).unmountedData[key] !== "undefined") {
		val = getModelStore(modelName).unmountedData[key];
	}
	return val;
}

var setStatus = function(newStatus, modelName) {
	var oldStatus = getModelStore(modelName).status;
	getModelStore(modelName).status = newStatus;
	return oldStatus;
}

var getAlertIndex = function(index) {
	if (typeof index !== "undefined" && alertIndexes[index]) {
		return alertIndexes[index];
	} else {
		return null;
	}
}

var setAlert = function(alert, scope) {
	alertActions.set(alert, getAlertIndex(scope));
}

var clearAlert = function(scope) {
	alertActions.clear(getAlertIndex(scope));
}

var loadDataUrl = function(url, modelName) {
	clearAlert("local");
	
	var modelName = getModel(modelName),
		store = getModelStore(modelName);

	store.url = url;

	console.log(["LOADING", url]);
	
	store.DataLoaded.empty();
	store.Data.empty();

	store.change({
		status: "loading",
		loading: true,
		active: true
	})
	.catch((err) => {
		console.error("Error preparing to load data url: " + err.message);
	})
	.then(() => {
		new AjaxFetch().getJSON(url)
			.then((data) => {
				console.log(["LOADED", url, data]);
				return store.change({
					status: "updating"
				}).then(() => {
					store.DataLoaded.data = data.data;
					console.log(["DATA LOADED", data]);
					store.Data.empty();
					cakeFormStore.emit(getModelEvent(CHANGE_EVENT, modelName));
				}).then(function() {
					return store.change({
						formElements: data.formElements,
						status: "loaded"
					});
				}).then(() => {
					store.change({
						loading: false,
						timesLoaded: store.timesLoaded + 1
					});
					cakeFormStore.emit(getModelEvent(LOADED_EVENT, modelName));
				}).then(() => {
					setStatus("ready", modelName);
				});
			})
			.catch(function(err) {
				console.error("Error loading data url: `" + url + "` : " + err.message);
				console.log(err);
			});
	});
}

var loadData = function(modelName, cakeModelIndex, pass) {
	console.log("LOAD FORM " + modelName + " : " + cakeModelIndex);
}

var getDeletedAssociatedIds = function() {
	var modelName = getModel(modelName),
		store = getModelStore(modelName),
		deleteData = {};
	for (var cakeModel in store.associatedIdsToDelete) {
		deleteData[cakeModel] = [];
		for (var cakeId in store.associatedIdsToDelete[cakeModel]) {
			deleteData[cakeModel].push(modelIdValues[cakeId]);
		}
	}
	return deleteData;
}

var deleteAssociatedIds = function(modelName) {
	// console.log("DELETING STUFF");
	var modelName = getModel(modelName),
		store = getModelStore(modelName),
		promise = null;
	for (var cakeModel in store.associatedIdsToDelete) {
		var modelIdValues = store.associatedIdsToDelete[cakeModel],
			modelIds = "";
		for (var cakeId in modelIdValues) {
			if (modelIdValues[cakeId] > 0) {
				if (modelIds != "") {
					modelIds += ",";
				}
				modelIds += modelIdValues[cakeId];
			}
		}
		
		console.log(["DELETING", cakeModel, modelIds]);

		if (promise === null) {
			promise = _deleteAssociatedModelIds(cakeModel, modelIds)
		} else {
			promise = promise.then(() => {_deleteAssociatedModelIds(cakeModel, modelIds);});
		}
		promise.catch((err) => {
			alertActions.set({message: err, type: "error"});
			store.change({loading: false});
		});
	}
	return promise;
}

var _deleteAssociatedModelIds = function(cakeModel, ids) {
	var url = new CakeRouter({
		controller: Inflector.tableize(cakeModel),
		action: 'delete',
		prefix: 'json',
		pass: [ids],
		named: {
			callbacks: "0"
		}
	}).getUrl();
	return new AjaxFetch().get(url)
		.catch((err) => {
			throw Error("Error deleting: " + err.message);
		});
}

var saveData = function(data, url, modelName) {
	var modelName = getModel(modelName),
		store = getModelStore(modelName);

	if (typeof data === "undefined" || data === null) {
		var data = store.Data.dataDeep;
	}
	if (typeof url === "undefined") {
		var url = store.url;
	}

	store.change({
		status: "saving",
		loading: true,
		active: true,
		result: {}
	})
	.then(() => {
		return deleteAssociatedIds();
	})
	.then(() => {
		//store.Data.data._crudDeleteData = getDeletedAssociatedIds();
		console.log(["SAVING", url, store.Data.data]);
		new AjaxFetch().save(url, store.Data.data)
			.then((data) => {
				var message = [data.message],
					validationErrors = [],
					validationErrorDisplay = [];
				if (!_.isEmpty(data.validation_errors)) {
					for (let errorField in data.validation_errors) {
						let key = getCakeKey(errorField, modelName),
							inputId = getLocation(key);
						validationErrors[key] = data.validation_errors[errorField];
						for (let i in validationErrors[key]) {
							validationErrorDisplay.push(<a href={"#" + inputId} key={key + i}>{validationErrors[key][i]}</a>);
						}
					}
				}
				store.validationErrors = validationErrors;

				if (data.success) {
					var alertType = 'success',
						status = 'saved',
						alertTitle = 'Success!',
						alertIndex = null,
						active = false;
				} else {
					var alertType = 'danger',
						status = 'invalid',
						alertTitle = 'Invalid',
						alertIndex = 'local',
						active = true;
				}
				console.log({
					type: alertType, 
					message: message, 
					title: alertTitle, 
					errors: validationErrorDisplay
				});
				setAlert({
					type: alertType, 
					message: message, 
					title: alertTitle, 
					errors: validationErrorDisplay
				}, alertIndex);
				store.change({
					active: active, 
					status: status, 
					index: data.id, 
					result: data,
					loading: false
				});
				cakeFormStore.emit(getModelEvent(SAVED_EVENT, modelName));
			});
	});
}

var getCakeKey = function(key, modelName) {
	var store = getModelStore(modelName);
	if (store.cakeModel && key && (key[0] != key[0].toUpperCase())) {
		key = store.cakeModel + "." + key;
	}
	return key;
}


var cakeFormStore = objectAssign({}, EventEmitter.prototype, {
	/*
	addChangeListener: function(cb, modelName) {
		this.on(CHANGE_EVENT, cb);
	},
	removeChangeListener: function(cb) {
		this.removeListener(CHANGE_EVENT, cb);
	},

	addSavedListener: function(cb) {
		this.on(SAVED_EVENT, cb);
	},
	removeSavedListener: function(cb) {
		this.removeListener(SAVED_EVENT, cb);
	},

	addLoadedListener: function(cb) {
		this.on(LOADED_EVENT, cb);
	},
	removeLoadedListener: function(cb) {
		this.removeListener(LOADED_EVENT, cb);
	},

	addDeleteListener: function(cb) {
		this.on(DELETED_EVENT, cb);
	},
	removeDeleteListener: function(cb) {
		this.removeListener(DELETED_EVENT, cb);
	},
	*/

	getData: function(modelName) {
		return getModelStore(modelName).Data.data;
	},

	getLoadedData: function(modelName) {
		return getModelStore(modelName).DataLoaded.data;
	},

	getVal: function(key, modelName, checkLoaded) {
		var modelName = getModel(modelName);
		key = getCakeKey(key, modelName);	
		if (typeof checkLoaded == "undefined") {
			var checkLoaded = true;
		}	
		var store = getModelStore(modelName),
			v = store.Data.getVal(key);
		if (checkLoaded && (typeof v === "undefined" || v === null)) {
			v = store.DataLoaded.getVal(key);
			if (v) {
				setVal(key, v, modelName);
			}
		}
		return v;
	},
	getModel: function() {
		return _store.currentModelName;
	},
	getUrl: function(modelName) {
		return getModelStore(modelName).url;
	},
	getStatus: function(modelName) {
		return getModelStore(modelName).status;
	},
	getFormElements: function(modelName) {
		return getModelStore(modelName).formElements;
	},
	getResult: function(modelName) {
		return getModelStore(modelName).result;
	},
	getUnmounted: function(key, modelName) {
		return getUnmounted(key, modelName);
	},

	getValidationErrors(key, modelName) {
		key = getCakeKey(key, modelName);
		var errors = [],
			store = getModelStore(modelName);
		if (store.validationErrors[key]) {
			errors = store.validationErrors[key];
		}
		if (store.validationErrors[store.cakeModel + "." + key]) {
			errors.concat(store.validationErrors[store.cakeModel + "." + key]);
		}
		return errors.length ? errors : null;
	},

	is: function(status, modelName) {
		return getModelStore(modelName).status === status;
	},
	isLoading: function(modelName) {
		return getModelStore(modelName).loading === true;
	},
	isActive: function(modelName) {
		return getModelStore(modelName).active === true;
	},
	getIndex: function(modelName) {
		return getModelStore(modelName).index;
	},
	getLocation: function(key, modelName) {
		return getLocation(key, modelName);
	},

	getTimesLoaded: function(modelName) {
		return getModelStore(modelName).timesLoaded;
	}
});
cakeFormStore.setMaxListeners(0);

/**
 * Adds listeners to cakeFormStore
 *
 **/
var storeListeners = [
	['Change', CHANGE_EVENT],
	['Saved', SAVED_EVENT],
	['Loaded', LOADED_EVENT],
	['Delete', DELETED_EVENT]
];
var addModelListener = function(baseEventName) {
	return function(cb, modelName) {
		var eventName = getModelEvent(baseEventName, getModel(modelName));
		cakeFormStore.on(eventName, cb);
	}.bind(baseEventName);
};

var removeModelListener = function(baseEventName) {
	return function(cb, modelName) {
		var eventName = getModelEvent(baseEventName, getModel(modelName));
		cakeFormStore.removeListener(eventName, cb);
	}.bind(baseEventName);
};

for (let i in storeListeners) {
	var label = storeListeners[i][0],
		baseEventName = storeListeners[i][1];
	// Creates the addLABELListener function
	cakeFormStore['add' + label + 'Listener'] = addModelListener(baseEventName);
	// Creates the removeLABELListener function
	cakeFormStore['remove' + label + 'Listener'] = removeModelListener(baseEventName);
}
//_store.setEmitter(cakeFormStore);


CakeFormDispatcher.register(function(payload) {
	var action = payload.action,
		data = action.data ? action.data : {},
		modelName = getModel(data.modelName),
		MODEL_CHANGE_EVENT = getModelEvent(CHANGE_EVENT, modelName);

	switch(action.actionType) {
		case cakeFormConstants.REFRESH:
			cakeFormStore.emit(MODEL_CHANGE_EVENT);
			break;
		case cakeFormConstants.SET_DATA:
			setData(data.data, modelName);
			cakeFormStore.emit(MODEL_CHANGE_EVENT);
			break;
		case cakeFormConstants.SET_FORM_ELEMENTS:
			//_store.change("formElements", data.formElements);
			getModelStore(modelName).formElements = data.formElements;
			break;
		case cakeFormConstants.SAVE_DATA:
			saveData(null, data.url, modelName);
			cakeFormStore.emit(MODEL_CHANGE_EVENT);
			break;
		case cakeFormConstants.LOAD_DATA:
			loadData(data.modelName, data.cakeModelIndex, data.pass);
			cakeFormStore.emit(MODEL_CHANGE_EVENT);
			break;
		case cakeFormConstants.LOAD_DATA_URL:
			loadDataUrl(data.url, modelName);
			cakeFormStore.emit(MODEL_CHANGE_EVENT);
			break;
		case cakeFormConstants.SET_VAL:
			// Sets a single value in the form data array
			setVal(data.key, data.val, modelName);
			//cakeFormStore.emit(CHANGE_EVENT);
			// Skips emitting the change event to speed up everything

			if (data.isFinished) {
				data.isFinished();
			}
			break;
		case cakeFormConstants.SET_VAL_AND_UPDATE:
			// Sets a single value in the form data array
			setVal(data.key, data.val, modelName);
			cakeFormStore.emit(MODEL_CHANGE_EVENT);
			break;
		case cakeFormConstants.UPDATE:
			cakeFormStore.emit(MODEL_CHANGE_EVENT);
			break;
		case cakeFormConstants.SET_MODEL:
			setModel(data.modelName);
			cakeFormStore.emit(MODEL_CHANGE_EVENT);
			break;
		case cakeFormConstants.SET_ACTIVE:
			var set = typeof data.isActive === "undefined" ? true : data.isActive;
			getModelStore(modelName).change('active', set, ACTIVE_EVENT);
			break;

		case cakeFormConstants.SET_UNMOUNTED:
			setValUnmounted(data.key, data.val, modelName);
			break;
		case cakeFormConstants.UNSET_UNMOUNTED:
			unsetValUnmounted(data.key, modelName);
			break;

		case cakeFormConstants.UNSET_VAL:
			unsetVal(data.key, modelName);
			break;

		case cakeFormConstants.ADD_DELETE_ID:
			var	modelKey = modelName,
				store = getModelStore(modelName);
			if (typeof data.cakeModel !== "undefined" && data.cakeModel !== null) {
				modelKey = data.cakeModel;
			}
			if (typeof store.associatedIdsToDelete[modelKey] === "undefined") {
				store.associatedIdsToDelete[modelKey] = {};
			}
			store.associatedIdsToDelete[modelKey][data.cakeId] = data.cakeId;
			break;
		case cakeFormConstants.REMOVE_DELETE_ID:
			var	modelKey = modelName,
				store = getModelStore(modelName);
			if (typeof data.cakeModel !== "undefined" && data.cakeModel !== null) {
				modelKey = data.cakeModel;
			}
			delete store.associatedIdsToDelete[modelKey][data.cakeId];
			break;
		case cakeFormConstants.DELETE_ID:
			var store = getModelStore(modelName);
			store.associatedIdsToDelete = {};
			store.associatedIdsToDelete[modelName] = {};
			if (typeof data.cakeId === "object") {
				for (let i in data.cakeId) {
					store.associatedIdsToDelete[modelName][data.cakeId[i]] = data.cakeId[i];
				}
			} else {
				store.associatedIdsToDelete[modelName][data.cakeId] = data.cakeId;
			}

			store
				.change({status: "loading", active: false})
				.then(function() {
					return deleteAssociatedIds(modelName);
				})
				.then(function() {
					setAlert({type: "success", title: "Deleted", message: "Successfully deleted element"});
					cakeFormStore.emit(getModelEvent(DELETED_EVENT, modelName));
				});
			break;

		case cakeFormConstants.SET_LOCATION:
			setLocation(data.cakeName, data.inputId, modelName);
			break;
		default:
			return true;
	}
});
export default cakeFormStore;