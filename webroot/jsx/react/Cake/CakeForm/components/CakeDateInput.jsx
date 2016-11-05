import React 			from 'react';
import ReactDOM 		from 'react-dom';
import moment 			from 'moment';
import CakeInput 		from './CakeInput.jsx';
import FAIcon 			from 'react/FAIcon.jsx';
import BSFormGroup		from 'react/BS/BSInput/BSFormGroup.jsx';

import cakeFormStore 	from 'react/Cake/CakeForm/stores/cakeFormStore.jsx';
import cakeFormActions 	from 'react/Cake/CakeForm/actions/cakeFormActions.jsx';

import _				from 'lodash';

require('scss/modules/react/cake/_cake_date_input.scss');

class CakeDateInput extends React.Component {
	constructor(props) {
		super(...arguments);

		this.state = this.getState(this.props.value);

		/*
		this.state = this.getDateElementsFromValue(this.props.value);
		this.state.url = "";
		*/

 		this.handleHiddenInputChange 	= this.handleHiddenInputChange.bind(this);
		this.handleTimeInputChange 		= this.handleTimeInputChange.bind(this);
		this.handleDateInputChange 		= this.handleDateInputChange.bind(this);
		
		//this.handleValueChange 			= this.handleValueChange.bind(this);
		this.handleDateChange			= this.handleDateChange.bind(this);
		this.handleTimeChange			= this.handleTimeChange.bind(this);
		this.handleHiddenChange 		= this.handleHiddenChange.bind(this);

		this._dateFocus = false;
		this._timeFocus = false;
		
	}
	static get defaultProps() {
		return {
			label: 			false,
			cakeName: 		false,
			cakeModel: 		false,
			value: 			false,

			// The formats used for storing the date/time
			dateFormat: 	"YYYY-MM-DD",
			timeFormat: 	"HH:mm:ss",
			valueFormat: 	"YYYY-MM-DD HH:mm:ss",

			// The formats used for displaying the date/time
			dateDisplay: 	"M/D/YYYY",
			timeDisplay: 	"h:mma",

			// Valid formats the date/time can be entered
			dateValidFormats: ["M/D/YYYY"],
			timeValidFormats: ["h:mm A", "h:mm a", "h:mmA", "h:mma"],

			flip: 			false,		// Should time come before date instead
			showTime: 		true,		// Should time be used as well as date
			hiddenTime: 	false,		// Should time be a hidden field

			defaultDate: 	null,
			defaultTime: 	"9:00 am",

			onChange: 		function(e) {},
			onValueChange: 	function(newVal) {},
			onFocus: 		function() {},
			onBlur: 		function() {},

			useStore: 		true,
			required: 		false,
			disabled: 		false
		}
	}

	getState(value) {
		var state = {
			value: 			"",

			dateValue: 		"",
			dateDisplay: 	"",
			dateValid: 		false,

			timeValue: 		"",
			timeDisplay: 	"",
			timeValid: 		false
		};
		if (typeof value === "undefined") {
			var value = false;
			if (this.props.defaultDate) {
				value = this.props.defaultDate;
				if (this.props.defaultTime) {
					value += " " + this.props.defaultTime;
				}
			}
		}
		value = this._getMomentFormat(value, this.props.valueFormat, this.props.valueFormat);
		if (value) {
			state.value = value;
			state.dateValue = this._getMomentFormat(value, this.props.valueFormat, this.props.dateFormat);
			state.dateDisplay = this._getMomentFormat(value, this.props.valueFormat, this.props.dateDisplay);
			state.dateValid = true;
			state.timeValue = this._getMomentFormat(value, this.props.valueFormat, this.props.timeFormat);
			state.timeDisplay = this._getMomentFormat(value, this.props.valueFormat, this.props.timeDisplay);
			state.timeValid = true;
		}

		return state;
	}

	handleHiddenInputChange(e) {
		this.setElementsFromValue(e.target.value, () => {
			this.props.onChange(e);	
		});
	}
	handleDateInputChange(e) {
		this.setDate(e.target.value);
	}
	handleTimeInputChange(e) {
		this.setTime(e.target.value);
	}
	handleHiddenChange(newVal) {
		this.setElementsFromValue(newVal, () => {
			this.props.onValueChange(newVal);
		});
	}
	handleDateChange(value) {
		this.setDate(value);
	}
	handleTimeChange(value) {
		this.setTime(value);
	}

	handleDateFocus(e) {
		this._dateFocus = true;
		this.handleFocusCheck(e);
	}
	handleDateBlur(e) {
		this._dateFocus = false;
		this.handleDateInputChange(e);
		this.handleBlurCheck(e);
	}
	handleTimeFocus(e) {
		this._timeFocus = true;
		e.target.select();
		this.handleFocusCheck(e);
	}

	handleTimeBlur(e) {
		this._timeFocus = false;
		this.handleTimeInputChange(e);
		this.handleBlurCheck(e);
	}
	handleFocusCheck(e) {
		if (this._timeFocus || this._dateFocus) {
			this.props.onFocus(e);
		}
	}
	handleBlurCheck(e) {
		if (!this._timeFocus && !this._dateFocus) {
			this.props.onBlur(e);
		}
	}

	/**
	 * Returns the value of the combined date elements
	 *
	 * @param object newState An optional version of the new state to be merged
	 * 						  with existing state if values haven't been updated yet
	 **/
	getValueFromElements(newState) {
		var state = this.state;
		if (typeof newState !== "undefined") {
			for (var i in newState) {
				state[i] = newState[i];
			}
		}
		return state.dateValue + " " + state.timeValue;
	}
	getElementDisplay(key, momentFormat, value) {
		return this._getMomentFormat(value, momentFormat, this.props[key + "Display"]);
	}

	getElementValue(key, momentFormat, value) {
		return this._getMomentFormat(value, momentFormat, this.props[key + "Format"]);
	}

	setValueFromElements() {
		this.setState({
			value: this.getValueFromElements()
		});
	}
	setElementsFromValue(value, complete) {
		if (typeof value === "undefined") {
			var value = this.state.value;
		}
		this.setState(this.getState(value), complete);
	}

	setTime(newTime) {
		this.setElementFromDisplay("time", newTime);
	}
	setDate(newDate) {
		this.setElementFromDisplay("date", newDate);
	}
	setElementFromValue(key, value) {
		this._setElement(key, "value", value);
	}
	setElementFromDisplay(key, value) {
		this._setElement(key, "display", value);
	}

	/**
	 * Sets a single date element that makes up the overall date value
	 * 
	 * @param string key The type of date element, either "date" or "time"
	 * @param string keyType The type of variable, either "display" or "value"
	 * @param string value The value of the date element
	 * @param string momentFormat The format to create a valid format
	 * @return void;
	 **/
	_setElement(key, keyType, value) {
		var state = {},
			stateDisplay = key + "Display",
			stateValue = key + "Value",
			displayFormat = this.props[key + "Display"],
			valueFormat = this.props[key + "Format"],
			validDisplayFormats = this.props[key + "ValidFormats"],
			isFocused = key == "time" ? this._timeFocus : this._dateFocus,
			momentFormat = keyType == "display" ? validDisplayFormats : valueFormat,
			m = moment(value, momentFormat);

		if (m.isValid()) {
			state[stateValue] = m.format(valueFormat);	
			state[key + "Valid"] = true;
			state.value = this.getValueFromElements(state);
			state[stateDisplay] = m.format(displayFormat);

			if (stateDisplay == "dateDisplay" && this.state.timeDisplay === "" && this.props.defaultTime) {
				state.timeDisplay = this.props.defaultTime;
			}
		} else {
			state[stateValue] = "";
			state[stateDisplay] = "";
			state[key + "Valid"] = false;
		}

		// If we're updating as a display type, prevents the display from being overwritten
		if (keyType == "display") {
			if (isFocused) {
				return false;
			}
			state[stateDisplay] = value;
		}

		this.setState(state, () => {
			if (this.props.useStore) {
				cakeFormActions.setValAndUpdate(this.props.cakeName, this.state.value);
			}
			this.props.onValueChange(this.state.value)
		});
	}

	_getMomentFormat(value, momentFormat, displayFormat) {
		var m = moment(value, momentFormat);
		if (m.isValid()) {
			return m.format(displayFormat);
		}
		return false;
	}

	/**
	 * Formats a name for use as an Element ID
	 *
	 * @param string name The name of the input
	 * @return string
	 **/
	getInputId(name) {
		return name.replace(/[^A-Za-z0-9]+/g, '');
	}

	onCakeFormLoaded() {
		this.handleHiddenChange(cakeFormStore.getVal(this.props.cakeName));
	}

	componentDidMount() {
		cakeFormStore.addLoadedListener(this.onCakeFormLoaded.bind(this));
	}

	componentWillUnmount() {
		cakeFormStore.removeLoadedListener(this.onCakeFormLoaded.bind(this));
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.value != this.props.value) {
			this.setElementsFromValue(nextProps.value);
		}
	}

	render() {
		var dateName = this.props.cakeName + "____date",
			timeName = this.props.cakeName + "____time",
			dateId = "dateInput-" + this.getInputId(dateName),
			timeId = "dateInput-" + this.getInputId(timeName),
			//dateValues = this.getStatesFromValue(this.state.value),
			//addonBefore={(<FAIcon type="calendar" fixed={true} />)}
			//addonBefore={(<FAIcon type="clock-o" fixed={true} />)}

			date = 	<CakeInput
						inputRef="dateInput"
						wrap={true}
						type="date"
						onChange={this.handleDateInputChange}
						onValueChange={this.handleDateChange}
						value={this.state.dateDisplay}
						inputClassName="cakeDateInput-date"
						cakeName={dateName}
						cakeModel={this.props.cakeModel}
						id={dateId}
						key={dateId}
						label={false}
						placeholder="mm/dd/yyy"
						status={this.state.dateValid === false ? "warning" : null}
						useStore={false}

						onFocus={this.handleDateFocus.bind(this)}
						onBlur={this.handleDateBlur.bind(this)}

						disabled={this.props.disabled}
						required={this.props.required}
					/>,
			time = <CakeInput
						inputRef="timeInput"
						wrap={true}
						type={this.props.hiddenTime ? "hidden" : "time"}
						value={this.state.timeDisplay}
						onChange={this.handleTimeInputChange}
						onValueChange={this.handleTimeChange}
						inputClassName="cakeDateInput-time"
						cakeName={timeName}
						cakeModel={this.props.cakeModel}
						id={timeId}
						key={timeId}
						label={false}
						placeholder="0:00am"
						status={this.state.timeValid === false ? "warning" : null}
						useStore={false}

						onFocus={this.handleTimeFocus.bind(this)}
						onBlur={this.handleTimeBlur.bind(this)}

						disabled={this.props.disabled}
						required={this.props.required}
					/>,
			hidden = <CakeInput 
						type="hidden"
						key={dateId + "-" + timeId}
						cakeName={this.props.cakeName}
						cakeModel={this.props.cakeModel}
						value={this.state.value}
						onChange={this.handleHiddenInputChange}
						onValueChange={this.handleHiddenChange}
						disabled={this.props.disabled}
						required={this.props.required}
						useStore={this.props.useStore}
					/>;

		if (!this.props.showTime) {
			time = null;
		}

		var inputs = !this.props.flip ? [hidden,date,time] : [hidden,time,date];

		return (<BSFormGroup 
				className="cakeDateInput"
				id={dateId}
				label={this.props.label}
			>
				<div className="cakeDateInput-inner">
					{inputs}
				</div>
			</BSFormGroup>
		);
	}
}
export default CakeDateInput;
