import React 			from 'react';
import BSFormGroup 		from './BSInput/BSFormGroup.jsx';
import BSInputGroup 	from './BSInput/BSInputGroup.jsx';
import BSFormControl 	from './BSInput/BSFormControl.jsx';
import classNames 		from 'classnames';
import _ 				from "lodash";

class BSInput extends React.Component {
	static get defaultProps() {
		return {
			type:			'text',
			id:				'',
			className: 		'',
			inputClassName: "",
			name: 			'',
			label: 			'',
			value: 			'',
			input: 			false,
			addonBefore:	'',
			addonAfter:		'',
			buttonBefore: 		'',
			buttonAfter: 		'',
			onChange: 		function(e) {},
			onValueChange: 	function(newVal) {},
			onLocate: 		function(inputId) {},
			wrap: 			true,
			status:			'',
			component: 		false,
			disabled: 		false,
			style: 			{}
		};
	}

	constructor() {
		super(...arguments);
		this.handleChange = this.handleChange.bind(this);
		this.handleValueChange = this.handleValueChange.bind(this);
	}

	getInputId() {
		return this.props.name.replace(/[^A-Za-z0-9]+/g, "");
	}

	getStatusClass() {
		return classNames({
			"has-success": this.props.status == "success",
			"has-warning": this.props.status == "warning",
			"has-error": this.props.status == "error"
		});
	}

	handleChange(e) {
		this.props.onChange(e);
	}

	handleValueChange(newVal) {
		this.props.onValueChange(newVal);
	}

	render() {
		var {addonBefore, addonAfter, buttonBefore, buttonAfter,
			type, id, input, label, status, ...other} = this.props,
			wrap = type != "hidden" && this.props.wrap,
			inputId = id ? id : this.getInputId(),
			className = "",
			statusClass = this.getStatusClass(),
			inputClass = wrap ? statusClass : "";

		this.props.onLocate(inputId);
		
		if (this.props.inputClassName) {
			inputClass += " " + this.props.inputClassName;
		}

		if (!input) {
			input = (<BSFormControl 
				{...other} 
				onChange={this.handleChange} 
				onValueChange={this.handleValueChange} 
				id={inputId} 
				type={type} 
				className={inputClass}
				style={this.props.style}
			/>);
		}

		if (addonBefore || addonAfter || buttonBefore || buttonAfter) {
			input = (<BSInputGroup 
				className={statusClass} 
				addonBefore={addonBefore} 
				addonAfter={addonAfter}
				buttonBefore={buttonBefore}
				buttonAfter={buttonAfter}
			>
				{input}
			</BSInputGroup>);
		}

		if (!wrap) {
			return input;
		} else {
			return (<BSFormGroup 
				id={inputId} 
				label={label} 
				className={statusClass}
				{...(_.pick(this.props, ['before', 'between', 'after', 'help']))}
			>
				{input}
			</BSFormGroup>);
		}
	}
}

export default BSInput;