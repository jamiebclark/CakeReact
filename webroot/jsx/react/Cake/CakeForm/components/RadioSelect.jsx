import React from "react";
import {CakeInput, RadioHidden} from "react/Cake/CakeForm/components/";

import JQueryTransition from "react/JQuery/JQueryTransition.jsx";

import cakeFormStore from "react/Cake/CakeForm/stores/cakeFormStore.jsx";

require("scss/modules/react/form/_radio_select.scss");

class RadioSelect extends React.Component {
	constructor() {
		super(...arguments);
		var value = this.props.value || this.props.default;
		if (value === null || typeof value === "undefined") {
			value = cakeFormStore.getVal(this.props.cakeName);
		}
		this.state = {
			value: value,
			open: value === null
		};
	}

	static get defaultProps() {
		return {
			cakeName: null,
			data: {},
			value: null,
			default: null,
			onChange: function(e) {},
			getOptionValue: function(data) { return ""; },
			getOptionLabel: function(data) { return ""; }
		}
	}

	handleChange(e) {
		if (e.target.value != this.state.value) {
			this.setState({value: e.target.value});
		}
		this.props.onChange(e);
	}

	render() {
		var {data, getOptionValue, getOptionLabel, onChange, ...other} = this.props,
			radioOptions = [];


		for (var i in data) {
			let value = this.props.getOptionValue(data[i]),
				label = this.props.getOptionLabel(data[i]),
				isActive = value === this.state.value;

			radioOptions.push(<RadioSelectOption 
				{...other} 
				active={isActive}
				key={i}
				onChange={this.handleChange.bind(this)}
				value={value}
				label={label}
				show={this.state.open || isActive}
			/>);
		}
		return <div className="RadioSelect">{radioOptions}</div>
	}
}

class RadioSelectOption extends React.Component {
	render() {
		var {children, options, show, ...other} = this.props;
		other.className = "RadioSelectOption";
		return <JQueryTransition jQuerySlideDown={show} >
			<RadioHidden {...other} />
		</JQueryTransition>;
	}
}

export default RadioSelect;