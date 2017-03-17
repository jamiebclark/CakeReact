import React from "react";
import classNames from "classnames";

class BSFormGroup extends React.Component {
	static get defaultProps() {
		return {
			label: 		false,
			labelWrap: 	false,
			id: 		false,
			required: 	false,
			className: 	'',
			before: 	"",
			between: 	"",
			after: 		"",
			help: 		""
		};
	}

	constructor() {
		super(...arguments);
		this.state = {
			isChecked: false
		}
	}

	handleChecked(checked) {
		console.log("IS CHECKED");
		this.setState({isChecked: checked});
	}

	render() {
		var {label, labelWrap, id, className, before, between, after, help, required, ...props} = this.props,
			tagName = 'div';

		props.className = classNames(
			className, 
			"form-group", 
			{"required": required}
		);

		if (label && !labelWrap) {
			label = <label className="control-label" htmlFor={id} >{label}</label>;
		}

		if (help !== "") {
			help = <div className="help-block">{help}</div>;
		}

		if (labelWrap) {
			props.htmlFor = id;
			tagName = 'label';
			props.className = classNames(props.className, "label-wrap", {
				"label-wrap-active": this.state.isChecked,
				"label-wrap-inactive": !this.state.isChecked
			});
		}

		var children = [before, label, between, this.props.children, help, after];
		for (var i in children) {
			if (typeof children[i] === "object" && children[i].key === null) {
				let newProps = {key: i};
				if (
					this.props.labelWrap &&
					typeof children[i] == "object" && 
					typeof children[i].type == "function"
				) {
					let fnName = children[i].type.toString();
					if (fnName.indexOf("BSFormControl") != -1 || fnName.indexOf("BSInputGroup") != -1) {
						newProps.onChecked = this.handleChecked.bind(this);
					}
				}
				children[i] = React.cloneElement(children[i], newProps);
			}
		}
		return React.createElement(tagName, props, children);
	}
}
export default BSFormGroup;