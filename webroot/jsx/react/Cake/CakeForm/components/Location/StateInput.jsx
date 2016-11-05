import React 				from "react";
import {CakeInput}			from "react/Cake/CakeForm/components/";
import states 				from "./lib/states.json";

class StateInput extends React.Component {
	getStateOptions() {
		var stateOptions = [];
		stateOptions.push({key: "", value: " -- Select a state -- "});
		for (let i in states) {
			stateOptions.push({
				key: i,
				value: i + " - " + states[i]
			});
		}
		return stateOptions;
	}

	render() {
		return <CakeInput 
			{...this.props}
			type="select"
			options={this.getStateOptions()}
		/>
	}
}

export default StateInput;