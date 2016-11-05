import React from 'react';
import modelRouterActions from 'react/Cake/ModelRouter/actions/modelRouterActions.jsx';
import modelRouterStore from 'react/Cake/ModelRouter/stores/modelRouterStore.jsx';
import classNames from 'classnames';


class ModelRouterLink extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			disabled: false
		};
	}

	static get defaultProps() {
		return {
			back: 			false,

			action: 		null,
			id: 			null,
			urlParams: 		[],
			type: 			'link'
		}
	}

	componentDidMount() {
		this._isMounted = true;
		modelRouterStore.addChangeListener(this.onModelRouterChange.bind(this));
	}

	componentWillUnmount() {
		this._isMounted = false;
		modelRouterStore.removeChangeListener(this.onModelRouterChange.bind(this));	
	}

	handleClick(e) {
		e.preventDefault();
		
		if (this.props.back) {
			modelRouterActions.goBack(this.props.back);
		} else {
			modelRouterActions.setView(this.props.action, this.props.id, this.props.urlParams);
		}
	}

	onModelRouterChange() {
		if (this._isMounted) {
			let disabled = !modelRouterStore.hasBack();
			if (disabled !== this.state.disabled) {
				this.setState({disabled: disabled});
			}
		}
	}

	render() {
		var {action, id, component, urlParams, back, type, ...props} = this.props,
			component = 'a';

		props.onClick = this.handleClick.bind(this);

		if (type === "button") {
			component = 'button';
			props.type = 'button';
		} else {
			props.href = '#';
		}

		if (back === true || back > 0) {
			if (this.state.disabled) {
				props.disabled = true;
				props.className = classNames(props.classNames, 'disabled');
			}
		}
		return React.createElement(component, props, this.props.children);
	}
}

export default ModelRouterLink;