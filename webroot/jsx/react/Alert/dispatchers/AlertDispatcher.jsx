import {Dispatcher} from 'flux';

var AlertDispatcher = new Dispatcher();
AlertDispatcher.handleAction = function(action) {
	this.dispatch({
		source: 'VIEW_ACTION',
		action: action
	});
}
export default AlertDispatcher;