import React 				from "react";
import {CakeInput, StateInput, CountryInput}
							from "react/Cake/CakeForm/components/";
import Inflector 			from "react/Cake/lib/Inflector.jsx";
import _ 					from "lodash";


class AddressInput extends React.Component {
	static get defaultProps() {
		return {
			addressField: 		"addline",
			addressLines: 		2,
			cityField: 			"city",
			stateField: 		"state",
			zipField: 			"zip",
			countryField: 		"country",
			locationField: 		"location_name",
			hasLocation: 		false,
			placeholders: 		false,
			required: 			false,

			addline2Help: 		"Apartment or Suite #",
			addline2Label: 		false,

			allInputProps: 		{}
		};
	}

/**
 * Determines if a field property has been set in props
 *
 * To set all fields required, use:
 *		this.props.required = true
 * To set a single field required use:
 *		this.props.cityRequired = true;
 * Or:
 * 		this.props.required = ['city'];
 * @param string field The field to check
 * @param Object props The existing properties
 * @return bool True if found, false if not
 **/
	checkFieldProp(prop, field, props) {
		var fieldProp = field + Inflector.firstToUpper(prop);
		if (typeof props[prop] === "undefined") {
			if (typeof this.props[fieldProp] !== "undefined") {
				return this.props[fieldProp];
			} else if (this.props[prop] !== false) {
				if (
					this.props[prop] === true || 
					this.props[prop] === field || 
					(typeof this.props[prop] === "object" && _.includes(this.props[prop], field))
				) {
					return true;
				}
			}
		}
		return false;
	}

	getCakeInput(field, label, passedProps) {
		if (typeof passedProps === "undefined") {
			var passedProps = {};
		}
		var defaultProps = {
			cakeModel: this.props.cakeModel,
			label: label,
			key: this.props.cakeModel + "--" + field,
			component: CakeInput
		};
		defaultProps.cakeName = defaultProps.cakeModel + "." + field;

		passedProps = _.merge(defaultProps, this.props.allInputProps, passedProps);

		var {component, ...props} = passedProps;

		props.required = this.checkFieldProp('required', field, props);
		props.watch = this.checkFieldProp('watch', field, props);

		var propCopy = {
			help: 	field + "Help",
			label: 	field + "Label"
		}
		for (let key in propCopy) {
			let propsKey = propCopy[key];
			if (typeof this.props[propsKey] !== "undefined") {
				props[key] = this.props[propsKey];
			}
		}
		if (this.props.placeholders) {
			props.placeholder = props.label;
			props.label = false;
		}
		return React.createElement(component, props);
	}

	getPropField(propField) {
		if (typeof this.props[propField] !== "undefined") {
			return this.props[propField];
		} else {
			return false;
		}
	}

	render() {
		var address = [], city = [], state = [], zip = [], country = [];
		if (!this.props.addressLines) {
			address.push(this.getCakeInput(this.props.addressField, ));
		} else {
			for (let i = 1; i <= this.props.addressLines; i++) {
				let label = i === 1 ? "Street" : false;
				address.push(this.getCakeInput(this.props.addressField + i, label));
			}
		}
		city = this.getCakeInput(this.props.cityField, "City", {className: "address-input-city"});
		state = this.getCakeInput(this.props.stateField, "State", {component: StateInput});
		zip = this.getCakeInput(this.props.zipField, "Zip");
		country = this.getCakeInput(this.props.countryField, "Country", {component: CountryInput});

		return <div className="AddressInput">
			{address}{city}
			<div className="row">
				<div className="col-sm-6">{state}</div>
				<div className="col-sm-6">{zip}</div>
			</div>
			{country}
		</div>
	}
}

export default AddressInput;