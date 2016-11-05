import React from "react";
import $ from "jquery";

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

	addCommas(nStr) {
		nStr += '';
		var x = nStr.split('.'),
			x1 = x[0],
			x2 = x.length > 1 ? '.' + x[1] : '',
			rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	}

	render() {
		var {component, className, value, before, after, commas, ...props} = this.props,
			children = [];
		if (isNaN(value)) {
			value = 0;
		} else {
			if (this.props.commas) {
				value = this.addCommas(value);
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