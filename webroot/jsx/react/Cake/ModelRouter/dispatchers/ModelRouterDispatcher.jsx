import {Dispatcher} from 'flux';

var ModelRouterDispatcher = new Dispatcher();
ModelRouterDispatcher.handleAction = function(action) {
	this.dispatch({
		source: 'VIEW_ACTION',
		action: action
	});
}
export default ModelRouterDispatcher;