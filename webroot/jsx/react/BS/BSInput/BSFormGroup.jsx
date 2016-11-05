import React from "react";

class BSFormGroup extends React.Component {
	static get defaultProps() {
		return {
			label: 		false,
			id: 		false,
			required: 	false,
			className: 	'',
			before: 	"",
			between: 	"",
			after: 		"",
			help: 		""
		};
	}
	render() {
		var {label, id, className, before, between, after, help, required} = this.props;
		className += " form-group";
		if (label) {
			label = <label className="control-label" htmlFor={id} >{label}</label>;
		}
		if (help !== "") {
			help = <div className="help-block">{help}</div>;
		}
		if (required) {
			className += " required";
		}

		return (<div className={className}>
			{before}
			{label}
			{between}
			{this.props.children}
			{help}
			{after}
		</div>);
	}
}
export default BSFormGroup;