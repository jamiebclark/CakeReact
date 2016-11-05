import ModelRouterDispatcher from "../dispatchers/ModelRouterDispatcher.jsx";
import modelRouterConstants from "../constants/modelRouterConstants.jsx";

var modelRouterActions = {
	setView: function(action, id, params) {
		ModelRouterDispatcher.handleAction({
			actionType: modelRouterConstants.SET_VIEW,
			data: {
				action: action,
				id: id,
				params: params
			}
		});
	},
	goBack: function(backCount) {
		ModelRouterDispatcher.handleAction({
			actionType: modelRouterConstants.GO_BACK,
			data: {
				backCount: backCount
			}
		});
	}
};

export default modelRouterActions;