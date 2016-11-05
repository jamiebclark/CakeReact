import React 				from "react";
import {CakeInput}			from "react/Cake/CakeForm/components/";
import countries 			from "./lib/countries.json";

class CountryInput extends React.Component {
	getCountryOptions() {
		var countryOptions = [{key: "", value: " -- Select a country -- "}];
		for (let i in countries) {
			countryOptions.push({
				key: i,
				value: i + " - " + countries[i]
			});
		}
		return countryOptions;
	}

	render() {
		return <CakeInput 
			default="US"
			{...this.props}
			type="select"
			options={this.getCountryOptions()}
		/>
	}
}

export default CountryInput;