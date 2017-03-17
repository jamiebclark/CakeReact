import React 				from "react";
import {CakeInput, RadioHidden}
				 			from "react/Cake/CakeForm/components/";
import JQueryTransition 	from "react/JQuery/JQueryTransition.jsx";
import FAIcon 				from "react/FAIcon.jsx";
import PropCompare 			from 'react/lib/PropCompare.jsx';

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
			renderStyle: "list",

			onValueChange: function(activeValue) {}
		}
	}

	componentWillReceiveProps(nextProps) {
		//if (nextProps.value !== null && (nextProps.value != this.props.value || nextProps.value != this.state.value)) {
		// TODO: Removing comparison to state.value to see how that works
		if (nextProps.value !== null && (nextProps.value != this.props.value)) {
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
			let option = this.props.options[i],
				optionValue = typeof option.value !== "undefined" ? option.value : i;
			// Defaults to first element
			if (activeKey === false) {
				activeKey = i;
			}
			if (
				(optionValue === this.state.value) ||
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
				this.props.onValueChange(activeValue);
			});
		}
	}

	renderList() {
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
		return <div className="ElementSelectList">{children}</div>
	}

	renderTabs() {
		var children = [], 
			existing = {},
			activeKey = this.getActiveKey(),
			tabs = [],
			body = [];

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
			tabs.push(<ElementSelectOptionLabel {...optionProps}/>);
			body.push(<ElementSelectOptionBody displayChildren={i === activeKey} {...optionProps}>
				{option.children}
			</ElementSelectOptionBody>);
			existing[i] = i;
		}

		return <div className="ElementSelectTabs">
			<div className="ElementSelectTabs-tabs">{tabs}</div>
			<div className="ElementSelectTabs-body">{body}</div>
		</div>
	}

	render() {
		var body = [];
		if (this.props.renderStyle === "tabs") {
			body = this.renderTabs();
		} else {
			body = this.renderList();
		}
		return <div className="ElementSelect">{body}</div>;
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
			onChecked: function(checked) {},
			iconType: ""
		};
	}

	handleChecked(checked) {
		this.props.onChecked(checked);
		this.setState({displayChildren: true});
	}

	handleSelect(val) {
		this.props.onSelect(val);
	}

	render() {
		var {children, ...inputProps} = this.props;
		return <div className="ElementSelectOption">
			<ElementSelectOptionLabel {...inputProps} 
				onChecked={this.handleChecked.bind(this)}
				onSelect={this.handleSelect.bind(this)}
			/>
			<ElementSelectOptionBody 
				active={this.props.active}
				displayChildren={this.state.displayChildren}
			>{children}</ElementSelectOptionBody>
		</div>
	}
}
ElementSelect.Option = ElementSelectOption;

class ElementSelectOptionLabel extends React.Component {
		constructor() {
		super(...arguments);
	}
	static get defaultProps() {
		return {
			cakeName: "",
			active: false,
			label: "",
			value: false,
			index: 0,
			onSelect: function(val) {},
			onChecked: function(checked) {},
			iconType: ""
		};
	}

	handleChecked(checked) {
		this.props.onChecked(checked);
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
				onChecked: this.handleChecked.bind(this),
				useStore: false
			});
		if (this.props.iconType != "") {
			label = <span><FAIcon fixed={true} type={this.props.iconType} /> {label}</span>
		}
		inputProps.label = label;
		return <RadioHidden {...inputProps} />
	}
}

class ElementSelectOptionBody extends React.Component {
	static get defaultProps() {
		return {
			active: false,
			displayChildren: false
		};
	}

	render() {
		var {children} = this.props;
		return <div className="ElementSelectOption-body">
			{this.props.active && this.props.displayChildren ? children : []}
		</div>
	}	
}

export default ElementSelect;

			/*
			<JQueryTransition 
				uid={labelText}
				jQuerySlideUp={this.props.active === false} 
				className="ElementSelectOption-body"
				removeChildrenOnHide={true}
			>*/
