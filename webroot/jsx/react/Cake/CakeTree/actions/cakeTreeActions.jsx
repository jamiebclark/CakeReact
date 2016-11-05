import CakeTreeDispatcher from "../dispatchers/CakeTreeDispatcher.jsx";
import cakeTreeConstants from "../constants/cakeTreeConstants.jsx";

var cakeTreeActions = {
	insert: function(id, val) {
		CakeTreeDispatcher.handleAction({
			actionType: cakeTreeConstants.INSERT,
			data: {
				id: id,
				val: val
			}
		});
	},
	remove: function(id) {
		CakeTreeDispatcher.handleAction({
			actionType: cakeTreeConstants.REMOVE,
			data: {id: id}
		});
	},
	set: function(listData) {
		CakeTreeDispatcher.handleAction({
			actionType: cakeTreeConstants.SET,
			data: {listData: listData}
		});
	},
	unset: function() {
		CakeTreeDispatcher.handleAction({
			actionType: cakeTreeConstants.UNSET,
			data: {}
		});
	},
	load: function(id, cakeModel) {
		if (typeof id === "undefined") {
			var id = null;
		}
		if (typeof cakeModel === "undefined") {
			var cakeModel = null;
		}
		CakeTreeDispatcher.handleAction({
			actionType: cakeTreeConstants.LOAD,
			data: {id: id, cakeModel: cakeModel}
		});
	},
	setModel: function(modelName) {
		CakeTreeDispatcher.handleAction({
			actionType: cakeTreeConstants.SET_MODEL,
			data: {modelName: modelName}
		});
	},
	setActive: function(modelId) {
		CakeTreeDispatcher.handleAction({
			actionType: cakeTreeConstants.SET_ACTIVE,
			data: {id: modelId}
		});
	}
};

export default cakeTreeActions;