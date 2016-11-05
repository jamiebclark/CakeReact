import AlertDispatcher 	from '../dispatchers/AlertDispatcher.jsx';
import alertConstants 	from '../constants/alertConstants.jsx';

var alertActions = {
	clear: function(alertIndex) {
		AlertDispatcher.handleAction({
			actionType: alertConstants.CLEAR,
			data: {index: alertIndex}
		});
	},
	set: function(alert, alertIndex) {
		console.log("SETTING ALERT");
		AlertDispatcher.handleAction({
			actionType: alertConstants.SET,
			data: {alert: alert, index: alertIndex}
		});
	}
};
export default alertActions;