import React 	from 'react';
import ReactDOM from 'react-dom';
//import BSFormControl from 'react/BS/BSInput/BSFormControl.jsx';
//import CakeInput from 'react/Cake/CakeForm/components/CakeInput.jsx';
import DropdownInput from "react/Cake/CakeForm/components/DropdownInput.jsx";

import $		from 'jquery';

class SelectCollapse extends React.Component {
	render() {
		return <DropdownInput 
			{...this.props} 
			collapse={true} 
			linkWrap={true}
		/>
	}

}

/*
require('../../../../../../Plugin/Layout/webroot/js/src/form/select-collapse.js');
class SelectCollapse extends React.Component {

	constructor() {
		super(...arguments);
		this.state = {
			value: this.props.value
		};
	}

	static get defaultProps () {
		return {
			onChange: 		function(e) {},
			onValueChange: 	function(newVal) {},
			onBlur: 		function() {},
			onFocus: 		function() {}
		};
	}

	setFormElements() {
		var $select = this.getElement();
		$select.selectCollapse();
		$select.on('change', () => {
			this.setState({value: $select.val()});
		});
	}

	updateFormElements() {
		this.getElement().trigger('refresh');
	}

	getElement() {
		return $('select', $(ReactDOM.findDOMNode(this)));
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.value != this.props.value || nextProps.value != this.state.value) {
			var newVal = nextProps.value;
			this.setState({value: newVal}, () => {
				this.handleValueChange(newVal);
			});
		}
		this.updateFormElements();
	}

	componentDidMount() {
		this.setFormElements();
	}

	handlePassThrough(fnName) {
		console.log("PASSTHROUGH: " + fnName);
		this.props[fnName].apply(this, Array.prototype.slice.call(arguments, 1));
	}

	handleValueChange(newVal) {
		this.setState({value: newVal}, () => {
			this.updateFormElements();
			this.props.onValueChange(newVal);
		});
	}

	render() {
		var {component, ...other} = this.props;
		var passThroughFunctions = ['onChange', 'onBlur', 'onFocus'];
		for (var i in passThroughFunctions) {
			other[passThroughFunctions[i]] = this.handlePassThrough.bind(this, passThroughFunctions[i]);
		}
		return <CakeInput
				{...other} 
				type="select"
				value={this.state.value}
				onValueChange={this.handleValueChange.bind(this)}
			>
				{this.props.children}
			</CakeInput>
	}
}
*/
export default SelectCollapse;