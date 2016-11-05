import LoginDispatcher 	from '../dispatchers/LoginDispatcher.jsx';
import loginConstants 	from '../constants/loginConstants.jsx';

var loginActions = {
	loadData: function(userId) {
		LoginDispatcher.handleAction({
			actionType: loginConstants.LOAD_DATA,
			data: {userId: userId}
		});
	}
};
export default loginActions;