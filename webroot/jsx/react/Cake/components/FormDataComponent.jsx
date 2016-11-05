import { Component }  from 'react';
var _ = require('lodash');

export var FormDataComponent = ComposedComponent => class extends Component {
	constructor (props, context) {
		console.log("FORM DATA COMPONENT CONSTRUCTOR");
		super(props, context);
		this.setFormData = this.setFormData.bind(this);
		this.getFormData = this.getFormData.bind(this);
	}
	getCakeModel() {
		var model = false;
		if (this.props && this.props.model) {
			model = this.props.model;
		} else if (this.context && this.context.model) {
			model = this.context.model;
		}
		return model;
	}
	getCakeName (cakeName) {
		var model = this.getCakeModel();
		if (model && cakeName[0] != cakeName[0].toUpperCase()) {
			cakeName = model + "." + cakeName;
		}
		return cakeName;
	}
	getFormData (cakeName) {
		if (this.state && this.state.formData) {
			return _.get(this.state.formData, cakeName);
		}
		if (this.props && this.props.formData) {
			return _.get(this.props.formData, cakeName);
		}
		return null;
	}
	setFormData (cakeName, v) {
		if (this.state && this.state.formData) {
			_.set(this.state.formData, cakeName, value);
		}
		if (this.props && this.props.onFormDataChange) {
			this.props.onFormDataChange(cakeName, v);
		}
	}
	render() {
		return <ComposedComponent {...this.props} />;
	}
};

export default FormDataComponent;