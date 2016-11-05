import {Dispatcher} from 'flux';

var CakeTreeDispatcher = new Dispatcher();
CakeTreeDispatcher.handleAction = function(action) {
	this.dispatch({
		source: 'VIEW_ACTION',
		action: action
	});
}
export default CakeTreeDispatcher;