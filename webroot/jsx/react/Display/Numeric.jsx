import React 		from "react";
import $ 			from "jquery";
import NumberFormat from "./NumberFormat.jsx";

require("scss/layout/_numeric.scss");

var timeout;

class Numeric extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			updated: false
		};
	}

	static get defaultProps() {
		return {
			component: "span",
			value: 0,
			before: "",
			after: "",
			className: "",
			commas: true
		}
	}

	componentDidUpdate(oldProps, oldState) {
		if (oldProps.value != this.props.value) {
			// Makes sure updated is set to false
			if (this.state.updated) {
				this.setState({updated: false}, () => {
					// Sets updated to true
					this.setUpdated();
				});
			} else {
				this.setUpdated();
			}
		}
	}

	setUpdated() {
		this.setState({updated: true}, () => {
			// Removes the class
			timeout = setTimeout(() => {
				if (this.state.updated) {
					this.setState({updated: false});
				}
			}, 500);
		});
	}

	componentDidMount() {
		var $el = $(this._el);
		$()
	}

	render() {
		var {component, className, value, before, after, commas, ...props} = this.props,
			children = [];
		if (isNaN(value)) {
			value = 0;
		} else {
			if (this.props.commas) {
				value = NumberFormat.addCommas(value);
			}
		}

		className += " numeric";
		if (this.state.updated) {
			className += " numeric-updated";
		}
		if (before !== "") {
			children.push(<span key="before" className="numeric-addon numeric-addon-before">{before}</span>);
		}
		children.push(<span key="value" className="numeric-value">{value}</span>);
		if (after !== "") {
			children.push(<span key="after" className="numeric-addon numeric-addon-after">{after}</span>);
		}
		props.className = className;
		props.ref = (c) => {
			this._el = c;
		};
		return React.createElement(component, props, children);
	}
}

export default Numeric;