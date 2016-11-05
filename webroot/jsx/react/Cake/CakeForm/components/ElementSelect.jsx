import React 				from "react";
import {CakeInput, RadioHidden}
				 			from "react/Cake/CakeForm/components/";
import JQueryTransition 	from "react/JQuery/JQueryTransition.jsx";
import FAIcon 				from "react/FAIcon.jsx";

import _ 					from "lodash";
require("scss/modules/react/form/_element_select.scss");


class ElementSelect extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			value: this.props.value,
		}
	}
	static get defaultProps() {
		return {
			cakeName: false,
			cakeModel: null,
			options: [],
			value: null,

			onvalueChange: function(activeValue) {}
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.value != this.props.value || nextProps.value != this.state.value) {
			this.setState({value: nextProps.value});
		}		
	}

	componentWillMount() {
		var activeKey = this.getActiveKey();
		if (activeKey !== this.state.value) {
			this.setState({value: activeKey});
		}
	}

	getActiveKey() {
		var activeKey = false;
		for (var i in this.props.options) {
			let option = this.props.options[i];
			// Defaults to first element
			if (activeKey === false) {
				activeKey = i;
			}
			if (
				(option.value === this.state.value) ||
				(!this.state.value && this.props.options[i].active)
			) {
				return i;
			}
		}
		if (activeKey !== false) {
		//	activeKey = parseInt(activeKey);
		}
		return activeKey;
	}

	handleSelect(activeValue) {
		if (activeValue !== this.state.value) {
			this.setState({value: activeValue}, () => {
				this.props.onvalueChange(activeValue);
			});
		}
	}

	render() {
		var children = [], 
			existing = {},
			activeKey = this.getActiveKey();
		for (let i in this.props.options) {
			while (typeof existing[i] !== "undefined") {
				i++;
			}
			let option = this.props.options[i],
				value = option.value ? option.value : i;

			var optionProps = _.merge({},
				_.pick(this.props, ["cakeName", "cakeModel"]),
				{
					key: value, 
					index: i,
					value: value,
					active: (i === activeKey),
					onSelect: this.handleSelect.bind(this)

				},
				_.pick(option, ["label", "iconType"]),
			);

			children.push(<ElementSelectOption {...optionProps}>
				{option.children}
			</ElementSelectOption>);
			existing[i] = i;
		}
		return <div className="ElementSelect">{children}</div>
	}
}

class ElementSelectOption extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			displayChildren: this.props.active
		}
	}

	static get defaultProps() {
		return {
			cakeName: "",
			active: false,
			label: "",
			value: false,
			index: 0,
			onSelect: function(val) {},
			onChange: function(e) {},
			iconType: ""
		};
	}

	handleChange(e) {
		this.props.onChange(e);
		this.props.onSelect(this.getValue());
		this.setState({displayChildren: true});
	}

	getValue() {
		return this.props.value !== false ? this.props.value : this.props.index;
	}

	render() {
		var {children, label, ...inputProps} = this.props,
			inputProps = _.merge(inputProps, {
				className: "ElementSelectOption-label",
				value: this.getValue(),
				onChange: this.handleChange.bind(this),
				useStore: false
			}),
			labelText = label;

		if (this.props.iconType != "") {
			label = <span><FAIcon fixed={true} type={this.props.iconType} /> {label}</span>
		}
		inputProps.label = label;
		return <div className="ElementSelectOption">
			<RadioHidden {...inputProps} />
			<JQueryTransition 
				uid={labelText}
				jQuerySlideUp={this.props.active === false} 
				className="ElementSelectOption-body"
				removeChildrenOnHide={true}
			>
				{this.state.displayChildren ? children : []}
			</JQueryTransition>
		</div>
	}
}

ElementSelect.Option = ElementSelectOption;

export default ElementSelect;