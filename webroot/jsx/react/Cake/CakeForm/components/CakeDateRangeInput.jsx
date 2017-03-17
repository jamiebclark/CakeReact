import React 			from 'react';
import moment 			from 'moment';
import CakeDateInput	from './CakeDateInput.jsx';
import FAIcon 			from 'react/FAIcon.jsx';
import BSFormGroup		from 'react/BS/BSInput/BSFormGroup.jsx';

import cakeFormStore	from 'react/Cake/CakeForm/stores/cakeFormStore.jsx';
import cakeFormActions 	from 'react/Cake/CakeForm/actions/cakeFormActions.jsx';

const 	ALLDAY_TIME_START 	= "00:00:00",
		ALLDAY_TIME_END		= "23:59:00";
	
class CakeDateRangeInput extends React.Component {
	constructor() {
		super(...arguments);

		this.state = this.getState(this.getValuesFromCakeForm());
		this.state.allDay = false;
		
		this.handleInputChange1 = this.handleInputChange1.bind(this);
		this.handleInputChange2 = this.handleInputChange2.bind(this);
		this.handleValueChange1 = this.handleValueChange1.bind(this);
		this.handleValueChange2 = this.handleValueChange2.bind(this);

		this._input1Focus = false;
		this._input2Focus = false;
	}

	static get defaultProps() {
		return {
			label: 				false,
			cakeName1:  		"",
			cakeName2:  		"",
			cakeModel: 			null,
			className: 			"",

 			valueFormat: 		"YYYY-MM-DD HH:mm:ss",
 			dateFormat: 		"YYYY-MM-DD",
 			timeFormat: 		"HH:mm:ss",

			onChange: 			function(e) {},
			onValueChange: 		function(newVal) {},
			onDurationChange: 	function(newDuration) {},

			defaultDuration: 	"PT1H",
			allDayCheckbox: 	false
		}
	}

	componentDidMount() {
		// cakeFormStore.addChangeListener(this.onCakeFormChange.bind(this));
		if (this.props.allDayCheckbox && this.isAllDay()) {
			this.setAllDay(true);
		}
	}

	componentWillUnmount() {
		//cakeFormStore.removeChangeListener(this.onCakeFormChange.bind(this));	
	}

	/*
	onCakeFormChange() {
		//var state = this.getValuesFromCakeForm();
		//this.setState(state);

		if (this.props.allDayCheckbox) {
			let isAllDay = this.isAllDay();
			if (isAllDay != this.state.allDay) {
				this.setAllDay(isAllDay);
			}
		}
	}
	*/
	

	componentWillReceiveProps(newProps) {
		this.setState(this.getValuesFromCakeForm());
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.allDayCheckbox && this.state.valid) {
			let isAllDay = this.isAllDay();
			if (isAllDay != this.state.allDay) {
				this.setAllDay(isAllDay);
			}
		}

		if (prevState.duration != this.state.duration) {
			this.props.onDurationChange(this.state.duration);
		}
	}

	getValuesFromCakeForm() {
		return {
			value1: cakeFormStore.getVal(this.props.cakeName1),
			value2: cakeFormStore.getVal(this.props.cakeName2)
		};
	}

	getState(newState) {
		var state = {
			tempValue1: "",
			tempValue2: "",

			value1: "",
			value2: "",
			moment1: false,
			moment2: false,
			duration: 0,
			valid: false,
			allDay: false
		};
		if (this.state) {
			for (var i in this.state) {
				state[i] = this.state[i];
			}
		}
		if (typeof newState !== "undefined") {
			for (var i in newState) {
				state[i] = newState[i];
			}
		}
		state.moment1 = moment(state.value1, this.props.valueFormat),
		state.moment2 = moment(state.value2, this.props.valueFormat);

		// Forces times to All-day parameters
		if (state.allDay) {
			if (state.moment1.isValid()) {
				state._storedTime1 = state.moment1.format(this.props.timeFormat);
				state.value1 = this.forceTime(state.value1, ALLDAY_TIME_START);
				state.moment1 = moment(state.value1, this.props.valueFormat);
			}
			if (state.moment2.isValid()) {
				state._storedTime2 = state.moment2.format(this.props.timeFormat);
				state.value2 = this.forceTime(state.value2, ALLDAY_TIME_END);
				state.moment2 = moment(state.value2, this.props.valueFormat);
			}
		}

		if (state.moment1.isValid() && state.moment2.isValid()) {
			state.valid = true;
			state.duration = moment.duration(state.moment2.diff(state.moment1)).asMilliseconds();
		} else {
			state.valid = false;
			state.duration = 0;
		}
		return state;
	}

	handleInputChange1(e) {
		this.handleValueChange1(e.target.value);		
	}

	handleInputChange2(e) {
		this.handleValueChange2(e.target.value);
	}

	handleValueChange1(newVal) {
		if (this.state.allDay) {
			newVal = this.forceTime(newVal, ALLDAY_TIME_START);
		}
		this.setState({tempValue1: newVal}, () => {
			if (!this._input1Focus) {
				this.updateValue1();
			}
		});
	}

	handleValueChange2(newVal) {
		if (this.state.allDay) {
			newVal = this.forceTime(newVal, ALLDAY_TIME_END);
		}	
		this.setState({tempValue2: newVal}, () => {
			if (!this._input1Focus) {
				this.updateValue2();
			}
		});
	}

	updateValue1() {
		var newVal = this.state.tempValue1,
			state = this.getState({tempValue1: newVal, value1: newVal});
		
		if (cakeFormStore.getStatus() == "ready" && state.moment1.isValid()) {
			if (!this._input1Focus) {
				//&& (!state.moment2.isValid() || state.duration < 0)) {
				var moment2 = state.moment1.add(this.getDuration()),
					newValue2 = moment2.format(this.props.valueFormat);
				state = this.getState({
					value1: newVal,
					tempValue2: newValue2,
					value2: newValue2,
					moment2: moment2
				});
			}
		}
		this.setState(state);
	}

	updateValue2() {
		var newVal = this.state.tempValue2,
			state = this.getState({value2: newVal});
		if (!this._input2Focus && cakeFormStore.getStatus() == "ready" && state.moment2.isValid()) {
			if (state.duration < 0) {
				var newValue1 = state.moment2.subtract(this.getDuration()).format(this.props.valueFormat);
				state = this.getState({
					tempValue1: newValue1,
					value1: newValue1,
					value2: newVal
				});
			}
		}
		this.setState(state);		
	}

	handleFocus1(e) {
		this._input1Focus = true;
	}
	handleFocus2(e) {
		this._input2Focus = true;
	}
	handleBlur1(e) {
		this._input1Focus = false;
		this.updateValue1();
	}

	handleBlur2(e) {
		this._input2Focus = false;
		this.updateValue2();
	}

	getDuration() {
		var Duration;
		if (this.state.duration > 0) {
			Duration = moment.duration(this.state.duration, 'milliseconds');
		} else {
			Duration = moment.duration(this.props.defaultDuration);
		}
		return Duration;
	}

	handleAllDayClick(e) {
		this.setAllDay(e.target.checked);
	}

	setAllDay(set) {
		var value1 = moment(this.state.tempValue1, this.props.valueFormat).isValid() ? this.state.tempValue1 : this.state.value1,
			value2 = moment(this.state.tempValue2, this.props.valueFormat).isValid() ? this.state.tempValue2 : this.state.value2,
			moment1 = moment(value1, this.props.valueFormat),
			moment2 = moment(value2, this.props.valueFormat),
			date1 = moment1.format(this.props.dateFormat),
			date2 = moment2.format(this.props.dateFormat);

		if (set) {
			this._storedTime1 = moment1.format(this.props.timeFormat);
			this._storedTime2 = moment2.format(this.props.timeFormat);
			value1 = date1 + " " + ALLDAY_TIME_START;
			value2 = date2 + " " + ALLDAY_TIME_END;
		} else {
			if (this._storedTime1) {
				value1 = date1 + " " + this._storedTime1;
			}
			if (this._storedTime2) {
				value2 = date2 + " " + this._storedTime2;
			}
			moment1 = moment(value1, this.props.valueFormat);
			moment2 = moment(value2, this.props.valueFormat);
			if (
				moment1.format(this.props.timeFormat) == ALLDAY_TIME_START && 
				moment2.format(this.props.timeFormat) == ALLDAY_TIME_END
			) {
				// Makes sure the value doesn't equal a full day if we're unchecking the checkbox
				value2 = moment2.format(this.props.dateFormat) + " 23:58:00"; 
			}
		}

		var state = {
			value1: value1,
			value2: value2,
			tempValue1: value1,
			tempValue2: value2,
			allDay: set
		};
		//console.log(["SETTING STATE", this.getState(state)]);
		//console.trace();
		this.setState(this.getState(state));		
	}

	isAllDay() {
		return (this.state.moment1.format(this.props.timeFormat) == ALLDAY_TIME_START) && 
				(this.state.moment2.format(this.props.timeFormat) == ALLDAY_TIME_END);
	}

	forceTime(date, newTime, dateFormat, timeFormat) {
		if (typeof dateFormat === "undefined") {
			var dateFormat = this.props.dateFormat;
		}
		if (typeof timeFormat === "undefined") {
			var timeFormat = this.props.timeFormat;
		}
		var valueFormat = dateFormat + " " + timeFormat,
			m = moment(date, valueFormat),
			date = m.format(dateFormat) + " " + newTime;
		date = moment(date, valueFormat).format(valueFormat);
		return date;
	}

	render() {
		var {label, className, cakeName1, cakeName2, cakeModel, ...other} = this.props;
		className += " cakeDateRangeInput";

		other.cakeModel = cakeModel;
		other.valueFormat = this.props.valueFormat;
		other.label = false;

		var allDayCheckbox = [];
		if (this.props.allDayCheckbox) {
			allDayCheckbox = <label className="cakeDateRangeInput-addon">
				<input 
					type="checkbox" 
					onClick={this.handleAllDayClick.bind(this)} 
					checked={this.state.allDay}
				/>
				 All Day
			</label>
		}

		return (<BSFormGroup
				className={className}
				label={label}
			>
				<div className="cakeDateRangeInput-inner">
					<CakeDateInput
						{...other}
						cakeName={cakeName1}
						onChange={this.handleInputChange1}
						onValueChange={this.handleValueChange1}
						value={this.state.tempValue1}
						onFocus={this.handleFocus1.bind(this)}
						onBlur={this.handleBlur1.bind(this)}
						hiddenTime={this.state.allDay}
					/>
					<span className="cakeDateRangeInput-to cakeDateRangeInput-addon">to</span>
					<CakeDateInput
						{...other}
						flip={true}
						cakeName={cakeName2}
						onChange={this.handleInputChange2}
						onValueChange={this.handleValueChange2}
						value={this.state.tempValue2}
						onFocus={this.handleFocus2.bind(this)}
						onBlur={this.handleBlur2.bind(this)}
						hiddenTime={this.state.allDay}
					/>
					{allDayCheckbox}
				</div>
			</BSFormGroup>
		);
	}
}

export default CakeDateRangeInput;