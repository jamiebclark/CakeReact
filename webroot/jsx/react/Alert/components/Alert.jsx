import React 			from 'react';
import BSAlert 			from 'react/BS/BSAlert.jsx';

import alertActions 	from '../actions/alertActions.jsx';
import alertStore 		from '../stores/alertStore.jsx';

var alertCounter = 0;

class Alert extends React.Component {
	constructor() {
		super(...arguments);
		this.state = alertStore.get(this.props.alertIndex);
		this._onChange = this._onChange.bind(this);
		this.state.key = "Alert" + this.props.alertIndex + (++alertCounter);
	}

	static get defaultProps() {
		return {
			alertIndex: null,
			type: 		"info"
		};
	}

	componentDidMount() {
		this._isMounted = true;
		alertStore.addChangeListener(this._onChange);
	}

	componentWillUnmount() {
		this._isMounted = false;
		alertStore.removeChangeListener(this._onChange);
	}

	_onChange() {
		if (this._isMounted) {
			this.setState(alertStore.get(this.props.alertIndex));
		}
	}

	render() {
		var {...others} = this.props;
		return <BSAlert 
			{...others}
			message={this.state.message}
			title={this.state.title}
			type={this.state.type}
			key={this.state.key}
			errors={this.state.errors}
		>
			{this.props.children}
		</BSAlert>
	}
}
export default Alert;