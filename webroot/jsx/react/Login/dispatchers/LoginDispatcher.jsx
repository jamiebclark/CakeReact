//import {Dispatcher} from 'flux';
import PromiseDispatcher from 'react/flux/dispatchers/PromiseDispatcher.jsx';

var LoginDispatcher = new PromiseDispatcher();
LoginDispatcher.handleAction = function(action) {
	this.dispatch({
		source: 'VIEW_ACTION',
		action: action
	});
}
export default LoginDispatcher;