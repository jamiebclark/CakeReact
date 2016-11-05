//import {Dispatcher} from 'flux';
import PromiseDispatcher from 'react/flux/dispatchers/PromiseDispatcher.jsx';




var CakeFormDispatcher = new PromiseDispatcher();
CakeFormDispatcher.handleAction = function(action) {
	this.dispatch({
		source: 'VIEW_ACTION',
		action: action
	});
}
export default CakeFormDispatcher;
