import React from "react";
import CakeInput from "react/Cake/CakeForm/components/CakeInput.jsx";
import timezones from "./lib/timezones.json";

class TimezoneInput extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			//value: this.props.value
		};
	}

	getOptions() {
		var options = [];
		for (let i in timezones) {
			options.push({
				key: timezones[i],
				value: i
			});
		}
		return options;
	}

	render() {
		return <CakeInput
			options={this.getOptions()}
			type="select"
			{...this.props}
		/>
	}
}

export default TimezoneInput;