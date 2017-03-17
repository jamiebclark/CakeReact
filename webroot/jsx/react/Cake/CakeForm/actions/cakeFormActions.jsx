import CakeFormDispatcher 	from '../dispatchers/CakeFormDispatcher.jsx';
import cakeFormConstants 	from '../constants/cakeFormConstants.jsx';

var cakeFormActions = {
	refresh: function(modelName) {
		CakeFormDispatcher.handleAction({
			actionType: cakeFormConstants.REFRESH,
			data: {modelName: modelName}
		});
	},
	setVal: function(key, val, modelName, onFinished) {
		CakeFormDispatcher.handleAction({
			actionType: cakeFormConstants.SET_VAL,
			data: {key: key, val: val, onFinished: onFinished, modelName: modelName}
		});
	},
	setValAndUpdate: function(key, val, modelName) {
		CakeFormDispatcher.handleAction({
			actionType: cakeFormConstants.SET_VAL_AND_UPDATE,
			data: {key: key, val: val, modelName:modelName}
		});
	},
	
	update: function() {
		CakeFormDispatcher.handleAction({
			actionType: cakeFormConstants.UPDATE,
			data: {}
		});
	},

	setValUnmounted: function(key, val, modelName) {
		CakeFormDispatcher.handleAction({
			actionType: cakeFormConstants.SET_UNMOUNTED,
			data: {key: key, val: val, modelName:modelName}
		});
	},

	unsetValUnmounted: function (key, modelName) {
		CakeFormDispatcher.handleAction({
			actionType: cakeFormConstants.UNSET_UNMOUNTED,
			data: {key: key, modelName:modelName}
		});
	},

	unsetVal: function(key, modelName) {
		CakeFormDispatcher.handleAction({
			actionType: cakeFormConstants.UNSET_VAL,
			data: {key: key, modelName: modelName}
		});
	},

	setModel: function(modelName) {
		CakeFormDispatcher.handleAction({
			actionType: cakeFormConstants.SET_MODEL,
			data: {modelName: modelName}
		});
	},
	setData: function(data, modelName) {
		CakeFormDispatcher.handleAction({
			actionType: cakeFormConstants.SET_DATA,
			data: {data: data, modelName: modelName}
		});
	},
	setFormElements: function(formElements, modelName) {
		CakeFormDispatcher.handleAction({
			actionType: cakeFormConstants.SET_FORM_ELEMENTS,
			data: {formElements: formElements, modelName: modelName}
		});
	},
	setActive: function(isActive, modelName) {
		CakeFormDispatcher.handleAction({
			actionType: cakeFormConstants.SET_ACTIVE,
			data: {isActive: isActive, modelName: modelName}
		});
	},
	setLocation: function(cakeName, inputId, modelName) {
		CakeFormDispatcher.handleAction({
			actionType: cakeFormConstants.SET_LOCATION,
			data: {cakeName: cakeName, inputId: inputId, modelName: modelName}
		});
	},

	loadDataUrl: function(url, modelName) {
		CakeFormDispatcher.handleAction({
			actionType: cakeFormConstants.LOAD_DATA_URL,
			data: {url: url, modelName: modelName}
		});
	},
	loadData: function(cakeModelName, cakeModelIndex, pass, modelName) {
		CakeFormDispatcher.handleAction({
			actionType: cakeFormConstants.LOAD_DATA,
			data: {cakeModelName: cakeModelName, cakeModelIndex: cakeModelIndex, pass: pass, modelName: modelName}
		})
	},
	saveData: function(data, url, modelName) {
		CakeFormDispatcher.handleAction({
			actionType: cakeFormConstants.SAVE_DATA,
			data: {data: data, url: url, modelName: modelName}
		});
	},
	addDeleteId: function(cakeModel, cakeId, modelName) {
		CakeFormDispatcher.handleAction({
			actionType: cakeFormConstants.ADD_DELETE_ID,
			data: {cakeModel: cakeModel, cakeId: cakeId, modelName: modelName}
		});
	},
	removeDeleteId: function(cakeModel, cakeId, modelName) {
		CakeFormDispatcher.handleAction({
			actionType: cakeFormConstants.REMOVE_DELETE_ID,
			data: {cakeModel: cakeModel, cakeId: cakeId, modelName: modelName}
		});
	},
	deleteId: function(cakeId, modelName) {
		return CakeFormDispatcher.handleAction({
			actionType: cakeFormConstants.DELETE_ID,
			data: {cakeId: cakeId, modelName: modelName}
		});
	}
};
export default cakeFormActions;