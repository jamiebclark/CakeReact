import React 		from "react";
import FAIcon 		from "react/FAIcon.jsx";
import _ 			from 'lodash';
import classNames 	from 'classnames';

import ValueValidate from "react/Cake/CakeForm/lib/ValueValidate.jsx";

class BSDropdown extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			open: this.props.open,
			mouseDown: false,
			activeIndex: this.props.activeIndex,
			activeValue: this.props.activeValue,
			buttonText: this.props.buttonText
		};

		this._defaultButtonText = this.state.buttonText;
		this.mouseDown = false;
	}

	static get defaultProps() {
		return {
			id: "dropdownId",
			buttonText: "Dropdown",
			btnClassName: null,
			options: [],
			data: [],
			className: null,
			align: "",	// "left" or "right"
			onOptionClick: function(e) {},
			onOptionValueClick: function(val) {},
			onOpen: function(isOpen) {},

			menuComponent: "ul",

			renderOption: 		null,
			getOptionValue: 	null,
			replaceButtonText: 	false,

			activeIndex: 		null,
			activeValue: 		null,

			linkWrap: 			false,
			open: 				false,
			required: 			false,
			hasError: 			false
		};
	}

	componentDidMount() {
		this._mounted = true;
		window.addEventListener('mousedown', this.handlePageClick.bind(this), false);
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	componentDidUpdate(oldProps, oldState) {
		let copyIfChanged = ["activeValue", "buttonText"],
			state = {},
			match = 0;
		for (let i in copyIfChanged) {
			// If the user has updated a prop, make sure it gets set into state
			if (this.props[copyIfChanged[i]] != oldProps[copyIfChanged[i]]) {
				state[copyIfChanged[i]] = this.props[copyIfChanged[i]];
				state["open"] = false;
				match++;
			}
		}
		if (match) {
			this.setState(state);
		}
	}

	handlePageClick(e) {
		if (this.mouseDown) {
			return;
		}
		if (this._mounted) {
			this.setState({open: false});
		}
	}

	handleMouseDown() {
		this.mouseDown = true;
	}

	handleMouseUp() {
		this.mouseDown = false;
	}

	handleButtonClick(setVal) {
		this.setState({open: setVal}, () => {
			this.props.onOpen(setVal);
		});
	}

	handleOptionClick(e) {
		return this.props.onOptionClick(e);
	}

	handleOptionValueClick(value, index, content) {
		this.props.onOptionValueClick(value);
		var state = {
			activeIndex: parseInt(index),
			activeValue: value
		};
		if (this.props.replaceButtonText) {
			state.buttonText = content;
		}
		this.setState(state);
	}

	getIndexFromValue(value) {
		if (this.props.data) {
			for (var i in this.props.data) {
				if (typeof this.props.getOptionValue === "function") {
					var lineValue = this.props.getOptionValue(this.props.data[i]);
					if (lineValue === value) {
						return i;
					}
				}
			}
		} else if (this.props.options) {
			for (var i in this.props.options) {
				var option = this.props.options[i],
					lineValue = option.key;
				if (lineValue == value) {
					return i;
				}
			}
		}
		return null;
	}

	getValueFromIndex(index) {

	}

	_renderData() {
		// Accepts a data Object
		// used with getOptionValue and get
		var children = [];
		for (var i in this.props.data) {
			var options = {
				key: i,
				index: i,
				linkWrap: this.props.linkWrap
			};
			var isActive = (i === this.state.activeIndex);
			if (typeof this.props.getOptionValue === "function") {
				var val = this.props.getOptionValue(this.props.data[i]);
				isActive = ValueValidate.compare(val, this.state.activeValue, ["Numeric", "Blank"]);
			}
			options.data = this.props.data[i];
			if (typeof this.props.renderOption === "function") {
				options.renderData = this.props.renderOption.bind(this);
			}
			if (typeof this.props.getOptionValue === "function") {
				options.getDataValue = this.props.getOptionValue.bind(this);
			}
			options.active = isActive;
			children.push(<BSDropdownOption {...options} />);
		}
		return children;
	}

	_renderOptions() {
		// Accepts an option array of {key, value} objects
		children = [];
		for (var i in this.props.options) {
			var options = {
				key: i,
				index: i,
				linkWrap: this.props.linkWrap
			};
			var option = this.props.options[i],
				label = option.value,
				value = option.key;
			children.push(<BSDropdownOption 
				{...options}
				value={value}
				active={value === this.state.activeValue || i === this.state.activeIndex}
			>{label}</BSDropdownOption>);
		}
		return children;
	}

	render() {
		var children = this.props.children;

		if (_.size(this.props.data) > 0) {
			children = this._renderData();
		} else if (this.props.options.length) {
			children = this._renderOptions();
		}

		var childrenWithProps = React.Children.map(children, (element, i) => {
			return React.cloneElement(element, {
				onOptionClick: this.handleOptionClick.bind(this),
				onOptionValueClick: this.handleOptionValueClick.bind(this)
			});
		});

		var menuClassName = "dropdown-menu";
		if (this.props.align) {
			menuClassName += " dropdown-menu-" + this.props.align;
		}


		var button = [],
			buttonText = this.state.buttonText;
		if (buttonText === "" || buttonText === null || !buttonText) {
			buttonText = this._defaultButtonText;
		}

		if (buttonText !== "") {
			button = <BSDropdownButton 
				id={this.props.id}
				onClick={this.handleButtonClick.bind(this)}
				open={this.state.open}
				className={this.props.btnClassName}
				required={this.props.required}
				hasError={this.props.hasError}
				>
				{buttonText}
			</BSDropdownButton>
		}
		var menu = React.createElement(this.props.menuComponent, {
			className: menuClassName, 
			//ariaLabelledby: this.props.id
		}, childrenWithProps);

		var className = classNames("dropdown", 
			this.props.className,
			{open: this.state.open}
		);

		return <div 
			className={className}
			onMouseDown={this.handleMouseDown.bind(this)}
			onMouseUp={this.handleMouseUp.bind(this)}
		>
			{button}
			{menu}
		</div>		
	}
}

class BSDropdownButton extends React.Component {
	static get defaultProps() {
		return {
			id: null,
			open: false,
			onClick: function(setVal) {},
			className: null,
			required: false,
			hasError: false
		};
	}

	handleClick(e) {
		e.preventDefault();
		this.props.onClick(!this.props.open);
	}

	render() {
		//data-toggle="dropdown"
		var className = classNames("btn", "btn-default", "dropdown-toggle", this.props.className, {
			"required": this.props.required,
			"has-error": this.props.hasError
		});
		return <button 
			className={className} 
			type="button"
			id={this.props.id}
			onClick={this.handleClick.bind(this)}
			aria-haspopup="true"
			aria-expanded={this.props.open ? "true" : "false"}
		>
			<div className="dropdown-toggle-body">
				{this.props.children}
			</div>
			<div className="dropdown-toggle-arrow">
				<FAIcon type="caret-down" />
			</div>
		</button>
	}
}

class BSDropdownOption extends React.Component {
	static get defaultProps() {
		return {
			className: "",
			value: null,
			disabled: false,
			data: [],

			index: 0,
			active: false,
			linkWrap: false,

			onOptionClick: function(e) {},
			onOptionValueClick: function(val) {},

			renderData: null,
			getDataValue: function(data) {}
		};
	}

	componentDidMount() {
		if (this.props.active) {
			this.handleValueSelect();
		}
	}
	

	componentDidUpdate(prevProps, prevState) {
		if (!prevProps.active && this.props.active) {
			this.handleValueSelect();
		}
	}

	handleClick(e) {
		e.preventDefault();
		this.handleValueSelect();
	}

	handleValueSelect() {
		var value = this.getValue();
		if (value != null) {
			this.props.onOptionValueClick(
				value,
				this.props.index,
				this.getContent()
			);
		}
	}

	handleOptionClick(e) {
		this.props.onOptionClick(e);
	}

	getValue() {
		var value = this.props.value;
		if (value === null) {
			value = this.getDataValue(this.props.data);			
		}
		return value;
	}

	getDataValue(data) {
		if (typeof this.props.getDataValue === "function") {
			return this.props.getDataValue(data);
		}
		return data.key;
	}

	getContent() {
		var children = this.props.children;
		if(_.keys(this.props.data).length) {
			children = this.renderData(this.props.data);
		}
		return children;
	}

	renderData(data) {
		if (typeof this.props.renderData === "function") {
			return this.props.renderData(data);
		}
		return data.value;
	//	return <a href="#">{data.value}</a>
	}

	render() {
		var {className, index, linkWrap, renderData, getDataValue, active, onOptionClick, onOptionValueClick, ...other} = this.props;
		var children = this.getContent();

		if (this.props.linkWrap) {
			children = <a key={this.props.index} href="#">{children}</a>			
		}

		if (typeof children === "string") {
			var childrenWithProps = <span onClick={this.handleOptionClick.bind(this)}>{children}</span>;
		} else {
			var childrenWithProps = React.Children.map(children, (element) => {
				return React.cloneElement(element, {
					onClick: this.handleOptionClick.bind(this)
				});
			});
		}

		className = classNames(className, {
			active: this.props.active,
			"dropdown-header": this.props.header,
			"dropdown-separator": this.props.separator,
			disabled: this.props.disabled
		});

		return <li 
				onClick={this.handleClick.bind(this)}
				{...other} 
				className={className}
			>
				{childrenWithProps}
			</li>
	}
}

BSDropdown.Button = BSDropdownButton;
BSDropdown.Option = BSDropdownOption;
export default BSDropdown;