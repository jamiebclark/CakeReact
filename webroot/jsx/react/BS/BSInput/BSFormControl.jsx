import React 			from 'react';
import $				from 'jquery';
import _ 				from 'lodash';
import classNames		from 'classnames';

import ValueValidate 	from 'react/Cake/CakeForm/lib/ValueValidate.jsx';

window.jQuery = require('jquery');
require('jquery-ui/ui/widgets/datepicker');
require('js/jquery/timepicker/jquery.timepicker.min.js');

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

class BSFormControl extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			value: this.props.value,
			checked: this.props.checked
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.handleValueChange = this.handleValueChange.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleFocus = this.handleFocus.bind(this);

		this._isMounted = false;
	}
	static get defaultProps () {
		return {
			type: 			'text',
			id:				'',
			className: 		'',
			name: 			'',
			value: 			null,
			checked: 		null,
			default: 		null,
			input: 			false,
			inputRef: 		"formControl",
			onChange: 		function(e) {},
			onChecked: 		function(newChecked) {},
			onClick: 		function(e) {},
			onValueChange: 	function(newVal) {},
			onBlur: 		function() {},
			onFocus: 		function() {},
			component: 		false,
			disabled: 		false,
			style: 			{}
		};
	}

	componentDidMount() {
		this._isMounted = true;
		this.checkValue();

		if (this._input) {
			if (this.props.type == "date") {
				var $el = $(this._input);
				$el.datepicker({
					onSelect: () => {
						this.handleValueChange($el.val());
						$el.trigger('change');
					}
				});
			} else if (this.props.type == "time") {
				var $el = $(this._input);
				$el.timepicker();
				$el
					.on('focus', () => {
						$el.data('last-value', $el.val());
					})
					.on('blur', () => {
						if ($el.data('last-value') != $el.val()) {
							$el.trigger('changeTime');
						}
					})
					.on('changeTime', () => {
						this.handleValueChange($el.val());
					});
			}
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	componentWillReceiveProps(newProps) {
		if (newProps.value !== this.props.value) {
			this.checkValue(newProps.value);
		}
		if (newProps.checked !== this.props.checked) {
			this.handleChecked(newProps.checked);
		}

		if (newProps.options !== this.props.options) {
			this.handleValueChange(newProps.value, true);
		}
	}

	handleChange(e) {
		if (!this.canBeChecked()) {
			this.handleValueChange(e.target.value);
			this.props.onChange(e);
		}
	}

	handleValueChange(newVal, forceUpdate) {
		if (this._isMounted && 
			(forceUpdate || newVal !== this.state.value)
		) {
			this.setState({value: newVal}, () => {
				this.props.onValueChange(this.state.value);	
			});
		}
	}

	handleClick(e) {
		e.persist();
		if (this.canBeChecked()) {
			this.handleChecked(e.target.checked);
		}
		this.props.onClick(e);
	}

	handleChecked(checked, forceUpdate) {
		if (this._isMounted) {
			var val = checked ? this.props.value : null;
			this.setState({
				checked: checked,
			}, () => {
				this.handleValueChange(val, true);
				this.props.onChecked(checked);
			});
		}
	}

	handleBlur (e) {
		//console.log("BLURRED " + this.props.className);
		this.props.onBlur(e);
	}

	handleFocus(e) {
		//console.log('FOCUS ' + this.props.className);
		this.props.onFocus(e);
	}

	getOptions(data) {
		var options = [],
			optGroupIndex = 0;
		for (var key in data) {
			var opt = data[key],
				value = opt,
				display = opt,
				props = {};

			if (opt && typeof opt === "object") {
				if (typeof opt.key !== "undefined" && typeof opt.value !== "undefined") {
					value = opt.key;
					display = opt.value;
					if (opt.disabled) {
						props.disabled = true;
					}
				} 
				if (typeof display === "object") {
					options.push(<optgroup key={optGroupIndex++} label={value} >
						{this.getOptions(display)}
					</optgroup>);
					continue;
				}
			}
			options.push(<option 
				key={value} 
				value={value}
				{...props}
			>{display}</option>);
		}
		return options;
	}

	checkValue(value) {
		if (typeof value === "undefined") {
			var value = this.state.value;
		}
		var oValue = value,
			{type, options} = this.props;

		if (value === null) {
			if (this.props.default !== null) {
				value = this.props.default;
			} else if (typeof options === "object") {
				value = options[0].key;
			}
		}

		// Converts number strings to actual numbers
		//value = ValueValidate.fixNumeric(value);

		if (type === "select" && typeof options === "object") {
			value = ValueValidate.fixOptions(value, options);
		}

		if (value !== oValue) {
			//console.log(["NEW VALUE", this.props.cakeName, oValue, value]);
			this.handleValueChange(value, true);
		} else if (value !== this.state.value) {
			this.handleValueChange(value);
		}
	}

	canBeChecked() {
		return this.props.type == "checkbox" || this.props.type == "radio";
	}

	render () {
		var _this = this,
			tagName = "input",
			value = this.state.value,
			checked = this.state.checked,
			childOptions = null,
			{className, type, options, id, ...other} = this.props;

		className = classNames(className, {
			'form-control': !_.includes(["checkbox", "radio"], type)
		});

		if (this.canBeChecked()) {
			checked = checked === true;
			value = checked ? this.props.value : null;
		} else {
			checked = null;
		}

		var props = {
			ref: 			this.props.inputRef,
			type: 			type,
			className: 		className,

			id: 			this.props.id,
			name: 			this.props.name,
			placeholder: 	this.props.placeholder,
			checked: 		this.props.checked,
			autoComplete: 	this.props.autoComplete,

			step: 			this.props.step,
			min: 			this.props.min,
			max: 			this.props.max,
			pattern: 		this.props.pattern,

			value: 			value,
			checked: 		checked,

			onChange: 		this.handleChange,
			//onValueChange: 	this.handleValueChange,
			onClick: 		this.handleClick,
			onBlur: 		this.handleBlur,
			onFocus: 		this.handleFocus,
			//options: 		options,
			disabled: 		this.props.disabled,
			required: 		this.props.required,
			style: 			this.props.style,

			rows: 			this.props.rows,
			cols: 			this.props.cols,
		};

		if (this.props.component) {
			tagName = this.props.component;
		} else if (type == "textarea" || type == "select") {
			tagName = type;
			type = null;
		} else if (type == "date") {
			props.type = "text";
			props.ref = (c) => this._input = c;
		} else if (type === "time") {
			props.type = "text";
			//props.className += " timepicker";
			props.ref = (c) => this._input = c;
		}
		if (typeof options != "undefined") {
			childOptions = this.getOptions(options);
		}

		if (typeof props.value === "undefined" || props.value === null) {
			props.value = "";
		}

		return React.createElement(tagName, props, childOptions);
	}
}
export default BSFormControl;
