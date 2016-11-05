//var React 			= require("react");
import React 				from 'react';
import CakeInput 			from "./CakeInput.jsx";
import SubmitButton			from "./SubmitButton.jsx";

import LoadingOverlay 		from "react/LoadingOverlay.jsx";
import Alert				from "react/Alert/components/Alert.jsx";

import alertActions 		from 'react/Alert/actions/alertActions.jsx';
import cakeFormActions		from '../actions/cakeFormActions.jsx';
import cakeFormStore		from '../stores/cakeFormStore.jsx';
import CakeRouter			from 'react/Cake/lib/CakeRouter.jsx';
import Inflector			from 'react/Cake/lib/Inflector.jsx';

import classNames 			from "classnames";

import _ from "lodash";

require("scss/modules/react/cake_form/_cake_form.scss");

class CakeForm extends React.Component {
	constructor(props) {
		super(...arguments);
		this._defaultProps = this.constructor.defaultProps;

		this.state = {
			loading: 		this.props.loading || this.props.loadUrl,
			storeStatus: 	"",
			dataLoaded: 	false
		};

		this.handleSubmit = this.handleSubmit.bind(this);

		this.onCakeFormStoreChange = this.onCakeFormStoreChange.bind(this);
		this.onCakeFormStoreSaved = this.onCakeFormStoreSaved.bind(this);
		this.onCakeFormStoreLoaded = this.onCakeFormStoreLoaded.bind(this);
	}

	static get defaultProps() {
		return {
			// Valid FORM attributes
			type: 				"POST",
			onSubmit: 			false,
			action: 			false,

			// Added
			loadUrl: 			false,
			onSubmitBeforeSend:	function() {},
			onSubmitComplete: 	function() {},
			onSubmitSuccess: 	function() {},
			onSubmitFail: 		function(data, alert) {},
			onAlert: 			function(alert) {},
			getData: 			function() {},
			
			status: 			"initialized",
			loading: 			false,
			cakeModel:			false,
			redirectOnSave: 	false,
			alertIndex: 		"CakeFormAlert"
		};
	}

	getCakeModel() {
		var cakeModel = false;
		if (this.props && this.props.cakeModel) {
			cakeModel = this.props.cakeModel;
		} else  {
			cakeModel = cakeFormStore.getModel();
		}
		return cakeModel;
	}

	handleSubmit (e) {
		var modelName = this.getCakeModel();
		alertActions.clear(this.props.alertIndex);

		e.preventDefault();
		this.setState({loading: true}, () => {
			if (this.props.onSubmit) {
				return this.props.onSubmit(e);
			}
			var data = cakeFormStore.getData(modelName);
			if (typeof this.props.getData === "function") {
				data = this.props.getData(data);
			}
			console.log(["SAVING", CakeRouter.parse(this.props.action)]);
			cakeFormActions.saveData(data, CakeRouter.parse(this.props.action), modelName);
		});
	}

	componentWillMount() {
		if (this.props.cakeModel) {
			cakeFormActions.setModel(this.props.cakeModel);
		}
	}
	
	componentDidMount() {
		var modelName = this.getCakeModel();
		this._isMounted = true;
		cakeFormStore.addChangeListener(this.onCakeFormStoreChange, modelName);
		cakeFormStore.addSavedListener(this.onCakeFormStoreSaved, modelName);
		cakeFormStore.addLoadedListener(this.onCakeFormStoreLoaded, modelName);
		this.loadUrl();
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.loadUrl !== "" && this.props.loadUrl !== prevProps.loadUrl) {
			this.loadUrl();
		}
	}

	loadUrl() {
		if (this.props.loadUrl) {
			cakeFormActions.loadDataUrl(this.props.loadUrl, this.getCakeModel());
		} else {
			this.setState({dataLoaded: true});
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
		var modelName = this.getCakeModel();
		cakeFormStore.removeLoadedListener(this.onCakeFormStoreLoaded, modelName);
		cakeFormStore.removeChangeListener(this.onCakeFormStoreChange, modelName);
		cakeFormStore.removeSavedListener(this.onCakeFormStoreSaved, modelName);
	}

	onCakeFormStoreChange() {
		if (this._isMounted) {
			var modelName = this.getCakeModel();
			this.setState({
				loading: cakeFormStore.isLoading(modelName),
				dataLoaded: !cakeFormStore.isLoading(modelName),
				storeStatus: cakeFormStore.getStatus(modelName)
			});
		}
	}

	onCakeFormStoreLoaded() {
		if (this._isMounted) {
			this.setState({dataLoaded: true});
		}
	}

	onCakeFormStoreSaved() {
		if (this._isMounted) {
			var modelName = this.getCakeModel();
			if (cakeFormStore.getStatus(modelName) === "saved") {
				this.props.onSubmitSuccess();
				if (this.props.redirectOnSave) {
					var result = cakeFormStore.getResult(modelName);
					window.location.href = CakeRouter.parse({
						controller: Inflector.tableize(modelName),
						action: 'view',
						pass: [result.id]
					});
				}
			} else {
				this.props.onSubmitFail();
			}
		}
	}

	render() {
		var {className, action, ...other} = this.props,
			loading = {show: false},
			dataLoaded = this.state.dataLoaded,
			className = classNames(
				className, 
				"form", 
				"cakeForm",
				{"cakeForm-unloaded": this.state.dataLoaded === false},
				"hasLoadingOverlay"
			);
		
		if (this.state.loading || this.props.status == "loading") {
			loading.show = true;
			dataLoaded = false;
		}

		if (this.state.storeStatus === "saving") {
			loading.show = true;
			loading.message = "Saving";
			loading.iconType = "save";
			loading.iconAnimation = "pulsate";
		} else if (this.state.storeStatus === "saved" && this.props.redirectOnSave) {
			loading.show = true;
			loading.message = "Redirecting";
			loading.iconType = "refresh";
			loading.iconAnimation = "spin";
		} else if (loading.show) {
			loading.show = true;
			loading.message = "Loading";
			loading.iconType = "spinner";
			loading.iconAnimation = "spin";
		} 

		if (!action) {
			action = cakeFormStore.getUrl(this.getCakeModel());
		} else {
			action = CakeRouter.parse(action);
		}

		other = _.pick(other, ['type', 'onSubmit', 'action']);

		return (<form 
			ref={(c) => {this._formElement = c;}}
			className={className} 
			{...other} 
			action={action}
			onSubmit={this.handleSubmit}
		>
			<Alert dismiss={true} alertIndex={this.props.alertIndex} />
			<LoadingOverlay {...loading} />
			{this.props.children}
		</form>);
	}
};

CakeForm.Submit = SubmitButton;
export default CakeForm;