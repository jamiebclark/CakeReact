import React from "react";
import BSDropdown from "react/BS/BSDropdown.jsx";
import {AutofillInput, CakeInput} from "react/Cake/CakeForm/components/";

import cakeFormStore from "react/Cake/CakeForm/stores/cakeFormStore.jsx";
import cakeFormActions from "react/Cake/CakeForm/actions/cakeFormActions.jsx";

import $ from "jquery";
import _ from "lodash";
import classNames from "classnames";

import PropCompare from "react/lib/PropCompare.jsx";
import ValueValidate from "react/Cake/CakeForm/lib/ValueValidate.jsx";

class DropdownInput extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			value: this.props.value || this.props.default,
			refresh: false,
			collapseOption: false,
			open: false,
			hasError: false
		};
	}
	static get defaultProps() {
		return {
			cakeName: null,
			value: null,
			default: "",

			options: [],
			data: [],
			renderOption: null,
			getOptionValue: null,

			help: "",

			onValueChange: function(newVal) {},
			useStore: 	true
		}
	}

	
	componentDidUpdate(prevProps, prevState) {
		if (
			PropCompare.hasDifferenceByPick(this.state, prevState, ['value']) ||
			PropCompare.hasDifferenceByPick(this.props, prevProps, ['data', 'options'])
		) {
			this.changeValue(this.state.value, true);
		}
	}

	shouldComponentUpdate(newProps, newState) {
		if (
			PropCompare.hasDifferenceByPick(newState, this.state, ['value', 'open', 'collapseOption', 'hasError']) ||
			PropCompare.hasDifferenceByPick(newProps, this.props, ['options', 'data'])
		) {
			return true;
		}
		return false;
	}

	componentDidMount() {
		this._isMounted = true;
		var value = this.state.value;
		if (this.props.useStore) {
			value = cakeFormStore.getVal(this.props.cakeName);
		}
		this.changeValue(value);
	}

	componentWillUnmount() {
		this._isMounted = false;
	}


	handleOptionValueClick(newVal) {
		this.changeValue(newVal);
	}

	handleValueChange(newVal) {
		this.changeValue(newVal, true);
	}

	handlePickCollapseOption(option) {
		this.setState({collapseOption: option}, () => {this.changeValue(option.key)});
	}

	handleLabelClick() {
		this.setState({open: true});
	}

	handleDropdownOpen(isOpen) {
		if (isOpen != this.state.open) {
			this.setState({open: isOpen});
		}
	}

	handleError(errorMsgs) {
		this.setState({hasError: true});
	}

	handleErrorFix() {
		this.setState({hasError: false});
	}

	changeValue(newVal, forceUpdate) {
		newVal = ValueValidate.fixNumeric(newVal);
		var storeVal = cakeFormStore.getVal(this.props.cakeName);
		if (this._isMounted && 
			(forceUpdate || newVal != this.state.value)
		) {
			var state = {
				value: newVal,
				open: false
			};
			if (this.state.collapseOption && !PropCompare.compareKeys(this.state.collapseOption.key, this.state.value)) {
				state.collapseOption = false;
			}

			this.setState(state, () => {
				cakeFormActions.setValAndUpdate(this.props.cakeName, newVal);
				this.props.onValueChange(newVal);
			});
		}
	}

	render() {
		var inputOptions = _.pick(this.props, ["cakeName", "value", "default", "required"]),
			dropdownOptions = _.pick(this.props, ["options", "renderOption", "getOptionValue", "renderButton", "data", "buttonText", "linkWrap", "label", "required"]),
			helpText = this.props.help,
			validationMessage = cakeFormStore.getValidationErrors(this.props.cakeName),
			dropdownId = inputOptions.cakeName.replace(/[^A-Za-z0-9]+/g, "") + "_dropdown",
			className = classNames("dropdownInput", {
				"has-error": this.state.hasError,
				"dropdownInput-required": inputOptions.required
			}),
			children = this.props.children;

		if (validationMessage !== null) {
			helpText = validationMessage;
		}

		if (helpText !== "") {
			helpText = <span className="help-block">{helpText}</span>;
		}

		dropdownOptions.replaceButtonText = true;
		dropdownOptions.onOptionValueClick = this.handleOptionValueClick.bind(this);
		dropdownOptions.activeValue = this.state.value;
		dropdownOptions.open = this.state.open;
		//dropdownOptions.btnClassName = "form-control";
		dropdownOptions.style = {height: "auto;"};
		dropdownOptions.className = "form-group";
		if (this.props.dropdownClassName) {
			dropdownOptions.className += " " + this.props.dropdownClassName;
		}
		dropdownOptions.onOpen = this.handleDropdownOpen.bind(this);
		dropdownOptions.hasError = this.state.hasError;

		inputOptions.onValueChange = this.handleValueChange.bind(this);
		inputOptions.value = this.state.value;
		inputOptions.inputLocation = dropdownId;

		var label = [];
		if (this.props.label) {
			label = <label
					className="control-label"
					onClick={this.handleLabelClick.bind(this)}
				>{this.props.label}</label>
		}

		if (this.props.collapse) {
			let options = this.props.options;
			delete dropdownOptions.options;
			children = <CollapseMenuControl 
				options={options} 
				onPick={this.handlePickCollapseOption.bind(this)}
				activeValue={this.state.value}
				open={this.state.open}
			/>

			if (this.state.collapseOption && PropCompare.compareKeys(this.state.collapseOption.key, this.state.value)) {
				dropdownOptions.buttonText = this.state.collapseOption.collapseValue;
			}
		} else {
			
		}

		return <div className={className} id={dropdownId}>
			<CakeInput 
				type="hidden" 
				onError={this.handleError.bind(this)}
				onErrorFix={this.handleErrorFix.bind(this)}
				{...inputOptions} 
			/>
			{label}
			<BSDropdown {...dropdownOptions}>{children}</BSDropdown>
			{helpText}
		</div>
	}
}

export default DropdownInput;

require ("scss/modules/react/cake_form/_dropdown_collapse_input.scss");

class CollapseMenuControl extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			autoFillText: ""
		}
	}
	static get defaultProps() {
		return {
			options: {},
			activeValue: false,
			open: false,
			onPick: function(option) {}
		}

		this._collapseData = [];
		this._collapseDataFlat = [];
		this._textLabelOptions = [];
		this._activeOption = false;
	}

	componentWillMount() {
		this.setCollapseData();
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.options != nextProps.options || this.props.activeValue != nextProps.activeValue) {
			this.setCollapseData(nextProps.options, nextProps.activeValue);
		}
	}

	componentDidMount() {
		this._isMounted = true;
		this.updateActive();
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	componentDidUpdate(prevProps, prevState) {
		this.updateActive();
	}

	handleInputClick(value, label) {
		if (this._isMounted) {
			this.setState({autoFillText: ""}, () => {
				this.props.onPick(this._collapseDataFlat[value]);
			});
		}
	}

	handleInputType(newText) {
		if (this._isMounted) {
			this.setState({autoFillText: newText});
		}
	}

	updateActive(forceUpdate) {
		if (typeof forceUpdate === "undefined") {
			var forceUpdate = false;
		}
		if (this._activeOption) {
			if (forceUpdate || !PropCompare.compareKeys(this._activeOption.key, this.props.activeValue)) {
				this.props.onPick(this._activeOption);
			}
		}
	}

	setCollapseData(passedOptions, activeValue, onFinished) {
		if (typeof passedOptions === "undefined") {
			var passedOptions = this.props.options,
				activeValue = this.props.activeValue;
		}
	
		var oActiveOption = this._activeOption,
			pathSep = "/";
		
		this._collapseData = [];
		this._collapseDataFlat = [];
		this._textLabelOptions = [];
		this._activeOption = false;

		var options = passedOptions.slice(0),
			sep = " - ",
			data = [],
			dataFlat = {},
			indexes = {},
			container,
			activeOption = false;

		for (let i in options) {
			var option = options[i],
				words = option.value.split(sep),
				label = words.shift(),
				index = 0;
			
			option.children = [];
			option.path = "";

			while (label === "") {
				label = words.shift();
				index++;
			}

			if (words.length > 0) {
				label += sep + words.join(sep);
			}
			option.collapseValue = label;
			option.active = false;

			if (PropCompare.compareKeys(activeValue, option.key)) {
				option.active = true;
			}

			container = (index > 0) ? indexes[index - 1].children : data;

			if (typeof indexes[index - 1] !== "undefined") {
				option.path = indexes[index - 1].path + '.children.' + container.length;
				option.textPath = indexes[index - 1].textPath + pathSep + label;
			} else {
				option.path = container.length;
				option.textPath = label;
			}

			this._textLabelOptions.push({
				key: option.key,
				value: option.textPath
			});

			dataFlat[option.path] = option.key;

			if (option.active) {
				activeOption = option;
			}

			container.push(option);
			indexes[index] = container[container.length - 1];
			if (option.key > 0) {
				this._collapseDataFlat[option.key] = option;
			}
		}

		for (var i in data) {
			this._collapseData[i] = $.extend(true, {}, data[i]);
		}


		this._activeOption = activeOption;
		if (oActiveOption !== this._activeOption) {
			this.updateActive(true);
		}

		if (typeof onFinished === "function") {
			onFinished();
		}

	//	this.updateActive(true);
	}

	render() {
		var {options, activeValue, ...other} = this.props,
			collapseMenu = [];

		if (this.state.autoFillText == "") {
			collapseMenu = <CollapseMenu 
				{...other}
				open={true}
				activeValue={activeValue}
				options={this._collapseData.slice(0)} 
			/>
		}

		return <div>
			<AutofillInput
				value={this.state.autoFillText}
				options={this._textLabelOptions}
				onClick={this.handleInputClick.bind(this)}
				onChange={this.handleInputType.bind(this)}
				autoFocus={this.props.open}
			/>
			{collapseMenu}
		</div>
	}
}

class CollapseMenu extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			open: false
		};
		this._isMounted = false;
	}

	static get defaultProps() {
		return {
			open: false,
			onPick: function(newValue) {},
			onContainsActive: function() {},
			options: [],
			activeValue: false
		}
	}

	componentDidMount() {
		this._isMounted = true;
	}
	
	componentWillUnmount() {
		this._isMounted = false;
	}

	shouldComponentUpdate(newProps, newState) {
		return (this.props.activeValue != newProps.activeValue) || 
			!_.isEqual(this.props.options, newProps.options) ||
			(this.state.open != newState.open) ||
			(this.props.open != newProps.open);
	}

	handleOpen(setOpen) {
		if (this._isMounted) {
			this.setState({open: setOpen});
		}
	}

	handleContainsActive() {
		if (this._isMounted) {
			if (!this.state.open) {
				this.setState({open: true}, () => {
					this.props.onContainsActive();
				});
			} else {
				this.props.onContainsActive();
			}
		}
	}

	// Passes the selected option from the child to the parent
	passPick(option) {
		if (this._isMounted) {
			if (!this.state.open) {
				this.setState({open: true}, () => {
					this.props.onPick(option);
				});
			} else {
				this.props.onPick(option);
			}
		}
	}

	render() {
		let children = [],
			className = classNames("collapseMenu", "dropdown-sub-menu",
				{open: this.props.open}
			);

		for (let i in this.props.options) {
			children.push(<CollapseMenuItem 
				key={i !== "" ? i : '__blank__'}
				onPick={this.passPick.bind(this)}
				option={this.props.options[i]}
				activeValue={this.props.activeValue}
				onOpen={this.handleOpen.bind(this)}
				onContainsActive={this.handleContainsActive.bind(this)}
			/>);
		}

		return <ul className={className}>{children}</ul>
	}
}

/**
 * A line-item of the CollapseMenu
 *
 **/
class CollapseMenuItem extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			open: false
		};
	}

	static get defaultProps() {
		return {
			option: {},
			activeValue: false,
			onOpen: function(setOpen) {}
		};
	}

	componentDidMount() {
		this.updateActive();
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.activeValue !== this.props.activeValue) {
			this.updateActive();
		}
	}

	handleControlOpen(setOpen) {
		this.setState({open: setOpen});
	}

	handleClick(e) {
		e.preventDefault();
		this.handlePick();
	}

	handlePick() {
		this.props.onPick(this.props.option);
	}

	// Passes the selected option from the child to the parent
	passPick(option) {
		this.setState({open: true}, () => {
			this.props.onPick(option);
		});
	}
	
	updateActive() {
		if (this.isActive()) {
			this.handlePick();
		}
	}

	isActive() {
		return PropCompare.compareKeys(this.props.option.key, this.props.activeValue);
	}

	render() {
		let isActive = this.isActive(),
			isOpen = this.state.open,
			className = classNames('extra collapseMenuItem-link', {
				active : isActive,
				"collapseMenuItem-link-with-children": this.props.option.children.length
			}, this.state.open ? "im-open" : "im-closed"),
			children = [],
			label = this.props.option.collapseValue;

		if (this.props.option.children.length) {
			children = <CollapseMenu
				onPick={this.passPick.bind(this)}
				options={this.props.option.children}
				activeValue={this.props.activeValue}
				open={this.state.open} 
			/>
		}

		return <li>
			 <CollapseMenuItemControl 
				open={this.state.open} 
				onOpen={this.handleControlOpen.bind(this)}
				count={this.props.option.children.length}
			/>
			<a 
				href="#" 
				onClick={this.handleClick.bind(this)}
				className={className}
			>
				{label}
			</a>
			{children}
		</li>
	}
}

import FAIcon from "react/FAIcon.jsx";

/**
 * The +/- control linke for expanding and collapsing a Collapse Menu Item
 *
 **/
class CollapseMenuItemControl extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			open: this.props.open
		};
	}

	static get defaultProps() {
		return {
			open: false,
			onOpen: function(setOpen) {},
			count: 0
		};
	}

	handleClick(e) {
		e.preventDefault();
		this.setState({
			open: !this.state.open
		}, () => {
			this.props.onOpen(this.state.open);
		});		
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.open != prevProps.open && this.props.open != this.state.open) {
			this.setState({open: this.props.open});
		}
	}

	render() {
		return this.props.count ? this.renderLink() : this.renderBlank();
	}

	renderBlank() {
		return <span className="collapseMenuItemControl collapseMenuItemControl-blank">
			<FAIcon type="square-o" />
		</span>
	}

	renderLink() {
		var type = this.state.open ? 'minus-square' : 'plus-square',
			className = classNames(
				"collapseMenuItemControl",
				this.state.open ? "collapseMenuItemControl-open" : "collapseMenuItemControl-close"
			);

		return <a
			href="#"
			className={className}
			onClick={this.handleClick.bind(this)}
			title={"Contains " + this.props.count + " Sub-entries. Click to expand"}
		>
			<FAIcon type={type} />
		</a>
	}
}