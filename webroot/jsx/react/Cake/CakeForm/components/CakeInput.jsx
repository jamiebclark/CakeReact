import React 				from 'react';
import Perf					from 'react-addons-perf';
import BSInput 				from "react/BS/BSInput.jsx";

import cakeFormActions		from '../actions/cakeFormActions.jsx';
import cakeFormStore		from '../stores/cakeFormStore.jsx';
import _ 					from "lodash";

import ValueValidate 		from 'react/Cake/CakeForm/lib/ValueValidate.jsx';
import PropCompare 			from 'react/lib/PropCompare.jsx';


class CakeInput extends React.Component {
	constructor() {
		super(...arguments);
		this.handleChange = this.handleChange.bind(this);
		this.handleValueChange = this.handleValueChange.bind(this);
		
		this.onCakeFormChange = this.onCakeFormChange.bind(this);
		
		this.state = {};
		this.state.initialSet = true;
		this.state.cakeModel = 	cakeFormStore.getModel();
		this.state.value = 		this.getInitialValue();
		this.state.validationErrors = this.props.validationErrors;

		this._changeCount = 0;
	}
	
	static get defaultProps () {
		return {
			cakeModel: 			null,
			cakeName: 			null,
			onChange: 			function(e) {},
			onValueChange: 		function(newVal) {},
			value: 				null,
			useStore: 			true,					// Should it use the cakeFormStore for storing and updating
			watch: 				false,
			validationErrors: 	null,
			inputLocation: 		null,					// The ID of the location in the DOM. Defaults to input's ID
		};
	}

	handleChange(e) {
		this.handleValueChange(e.target.value);
		this.props.onChange(e);
	}

	handleValueChange(newVal, forceUpdate) {
		if (typeof forceUpdate === "undefined") {
			var forceUpdate = false;
		}

		newVal = ValueValidate.fixBlank(newVal);
		newVal = ValueValidate.fixNumeric(newVal);
		if (typeof this.props.options === "object") {
			newVal = ValueValidate.fixOptions(newVal, this.props.options);
		}

		var cakeName = this.getCakeName(),
			storeVal = cakeFormStore.getVal(cakeName, this.getCakeModel());

		// If values are already equal, it avoids re-setting
		if (newVal === this.state.value && newVal === storeVal) {
			if (forceUpdate) {
				this.props.onValueChange(newVal);
			}
			return;
		}

		if (forceUpdate || this.state.value !== newVal) {
			this.setState({value: newVal}, () => {
				this._setStoreValue(newVal, forceUpdate);
				this.props.onValueChange(newVal);		
			});
		} else if (newVal != storeVal) {
			this._setStoreValue(newVal, forceUpdate);
			this.props.onValueChange(newVal);		
		}
	}

	_setStoreValue(value, forceUpdate) {
		let cakeName = this.getCakeName(),
			modelName = this.getCakeModel(),
			storeVal = cakeFormStore.getVal(cakeName, modelName);
		if (this.props.watch || forceUpdate) {
			cakeFormActions.setValAndUpdate(cakeName, value, modelName);	
		} else if (value !== storeVal) {
			cakeFormActions.setVal(cakeName, value, modelName);
		}
	}

	handleLocate(inputId) {
		var location = this.props.inputLocation !== null ? this.props.inputLocation : inputId;
		cakeFormActions.setLocation(this.props.cakeName, location, this.getCakeModel());
	}

	getCakeName() {
		if (!this.props.cakeName) {
			return null;
		}
		var cakeName = this.props.cakeName,
			cakeModel = this.getCakeModel();

		if (cakeModel && (cakeName[0] != cakeName[0].toUpperCase())) {
			cakeName = cakeModel + "." + cakeName;
		}
		return cakeName;
	}

	getCakeModel() {
		var cakeModel = this.props.cakeModel;
		if (cakeModel === null && this.state.cakeModel) {
			cakeModel = this.state.cakeModel;
		} else {
			cakeModel = cakeFormStore.getModel();
		}
		return cakeModel;
	}

	getName() {
		var name = "",
			cakeName = this.getCakeName();
		if (cakeName) {
			name = "data";
			var nameParts = cakeName.split(".");
			for (var i in nameParts) {
				name += "[" + nameParts[i] + "]";
			}
		} else if (this.props.name) {
			name = this.props.name;
		}
		return name;
	}

	getInitialValue() {
		var value = "",
			modelName = this.getCakeModel();
		if (!ValueValidate.isBlank(this.props.value)) {
			value = this.props.value;
		} else if (this.props.useStore) {
			value = cakeFormStore.getVal(this.getCakeName(), modelName);
			if (typeof value === "undefined") {
				value = cakeFormStore.getUnmounted(this.getCakeName(), modelName);
			}
		}
		if (typeof value === "undefined" && this.props.default) {
			value = this.props.default;
		}

		if (ValueValidate.isBlank(value)) {
			value = "";
		}
		return value;
	}

	shouldComponentUpdate(nextProps, nextState) {
		return PropCompare.hasDifference(nextState, this.state) || PropCompare.hasDifference(nextProps, this.props);
	}

	componentDidUpdate(oldProps, oldState) {
		if (!this.props.useStore && oldProps.value != this.props.value) {
			this.setState({value: this.props.value});
		}
		if (
			typeof this.props.options === "object" && (
				typeof oldProps.options !== "object" ||
				PropCompare.hasDifference(this.props.options, oldProps.options)
			)
		) {
			this.handleValueChange(this.state.value);
		}
	}

	componentDidMount() {
		this._isMounted = true;

		var value = this.state.value,
			cakeName = this.getCakeName(),
			modelName = this.getCakeModel(),
			unmountedValue = null;

		if (this.props.useStore) {
			// Has this value been previously there but unmounted?
			unmountedValue = cakeFormStore.getUnmounted(cakeName, modelName);
			if (typeof unmountedValue !== "undefined" && unmountedValue != this.state.value && unmountedValue !== null) {
				value = unmountedValue;
				this.handleValueChange(value, true);
			}

			// Makes sure the initial value is stored
			cakeFormActions.setVal(cakeName, value, true);
			cakeFormStore.addChangeListener(this.onCakeFormChange, modelName);
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
		cakeFormActions.setValUnmounted(this.getCakeName(), this.state.value);
		if (this.props.useStore) {
			cakeFormStore.removeChangeListener(this.onCakeFormChange, this.getCakeModel());
		}
	}

	onCakeFormChange() {
		if (this._isMounted) {
			var newState = {
					value: this.getValue()
				},
				forceUpdate = false;

			if (this.props.useStore) {
				var cakeName = this.getCakeName(),
					modelName = this.getCakeModel(),
					storeValue = cakeFormStore.getVal(cakeName, modelName);
				newState.cakeModel = modelName;
				newState.validationErrors = cakeFormStore.getValidationErrors(cakeName, modelName);
				if (!ValueValidate.compare(newState.value, storeValue)) {
					forceUpdate = true;
				}
			}

			if (!forceUpdate && !this.state.initialSet) {
				newState = PropCompare.difference(newState, this.state);
			}
			if (Object.keys(newState).length) {
				/*
				if (this._changeCount++ > 50) {
					var msg = ["CHANGE COUNT EXCEEDED", this.props.cakeName, newState.value, newState, this.state];
					for (let i in newState) {
						msg.push(i);
						msg.push(newState[i]);
					}
					console.log(msg);
					console.trace();
					debugger;
					return;
				}
				*/
				newState.initialSet = false;
				this.setState(newState, () => {
					if (typeof newState['value'] !== "undefined") {
						this.handleValueChange(newState['value'], true);
					}
				});
			}
		}
	}

	getValue() {
		var value = null;
		if (!this.props.useStore) {
			value = this.state.value;
		} else {
			var cakeName = this.getCakeName(),
				modelName = this.getCakeModel();
			value = cakeFormStore.getVal(cakeName, modelName);
		}
		if (typeof this.props.options === "object") {
			var valueOption = ValueValidate.fixOptions(value, this.props.options);
		}
		return value;
	}

	getValidationErrorList() {
		var errors = "",
			type = typeof this.state.validationErrors;
		if (type === "string") {
			errors = this.state.validationErrors;
		} else if (type === "object") {
			if (this.state.validationErrors.length === 1) {
				errors = this.state.validationErrors[0];
			} else {
				errors = <ul>{this.state.validationErrors.map((el, i) => {
					return <li key={i}>{el}</li>
				})}</ul>
			}
		}
		return <div className="validationErrors">{errors}</div>
	}

	getInputId() {
		return this.props.name.replace(/[^A-Za-z0-9]+/g, "");
	}

	render() {
		var {name, value, ...other} = this.props;
		value = this.state.value;
		name = this.getName();

		if (this.state.validationErrors !== null) {
			other.status = "error";
			other.help = this.getValidationErrorList();
		}

		return (<BSInput 
			{...other} 
			name={name} 
			value={value}
			onChange={this.handleChange} 
			onValueChange={this.handleValueChange}
			onLocate={this.handleLocate.bind(this)}
		/>);
	}
}
export default CakeInput;