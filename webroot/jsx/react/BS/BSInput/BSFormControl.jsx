import React 			from 'react';
import $				from 'jquery';
import _ 				from 'lodash';
import classNames		from 'classnames';

import ValueValidate 	from 'react/Cake/CakeForm/lib/ValueValidate.jsx';

window.jQuery = require('jquery');
require('jquery-ui/ui/widgets/datepicker');
require('js/jquery/timepicker/jquery.timepicker.min.js');

class BSFormControl extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			value: this.props.value
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleValueChange = this.handleValueChange.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
	}
	static get defaultProps () {
		return {
			type: 			'text',
			id:				'',
			className: 		'',
			name: 			'',
			value: 			null,
			default: 		null,
			input: 			false,
			onChange: 		function(e) {},
			onValueChange: 	function(newVal) {},
			onBlur: 		function() {},
			onFocus: 		function() {},
			component: 		false,
			disabled: 		false,
			style: 			{}
		};
	}

	handleChange(e) {
		this.handleValueChange(e.target.value);
		this.props.onChange(e);
	}

	handleValueChange(newVal, forceUpdate) {
		if (forceUpdate || newVal !== this.state.value) {
			this.setState({value: newVal}, () => {
				this.props.onValueChange(this.state.value);	
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

	componentDidMount() {
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

	componentWillReceiveProps(newProps) {
		if (newProps.value !== this.props.value) {
			this.checkValue(newProps.value);
		}
	}

	getOptions(data) {
		var options = [],
			optGroupIndex = 0;
		for (var key in data) {
			var opt = data[key],
				value = opt,
				display = opt;
			if (opt && typeof opt === "object") {
				if (typeof opt.key !== "undefined" && typeof opt.value !== "undefined") {
					value = opt.key;
					display = opt.value;
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
		value = ValueValidate.fixNumeric(value);

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

	render () {
		var _this = this,
			tagName = "input",
			childOptions = null,
			value = this.state.value,
			{className, type, options, id, ...other} = this.props;

		className = classNames(className, {
			'form-control': !_.includes(["checkbox", "radio"], type)
		});

		var props = {
			ref: 			this.props.inputRef,
			type: 			type,
			className: 		className,

			id: 			this.props.id,
			name: 			this.props.name,
			placeholder: 	this.props.placeholder,
			checked: 		this.props.checked,
			autoComplete: 	this.props.autoComplete,
			value: 			value,
			onChange: 		this.handleChange,
			//onValueChange: 	this.handleValueChange,
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
