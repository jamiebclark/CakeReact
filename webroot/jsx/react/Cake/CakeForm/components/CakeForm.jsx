//var React 			= require("react");
import React 				from 'react';
import ReactDOM				from 'react-dom';
import CakeInput 			from "./CakeInput.jsx";
import SubmitButton			from "./SubmitButton.jsx";

import LoadingOverlay 		from "react/LoadingOverlay.jsx";
import Alert				from "react/Alert/components/Alert.jsx";

import alertActions 		from 'react/Alert/actions/alertActions.jsx';
import alertStore 			from 'react/Alert/stores/alertStore.jsx';

import cakeFormActions		from '../actions/cakeFormActions.jsx';
import cakeFormStore		from '../stores/cakeFormStore.jsx';
import CakeRouter			from 'react/Cake/lib/CakeRouter.jsx';
import Inflector			from 'react/Cake/lib/Inflector.jsx';

import classNames 			from "classnames";

import _ from "lodash";

require("scss/modules/react/cake_form/_cake_form.scss");

var defaultLoadingOverlays = {
	saving: {
		show: true,
		message: 'Saving',
		iconType: 'save',
		iconAnimation: 'pulsate'
	},
	redirecting: {
		show: true,
		message: 'Redirecting',
		iconType: 'refresh',
		iconAnimation: 'spin'
	},
	loading: {
		show: true,
		message: 'Loading...',
		iconType: 'spinner',
		iconAnimation: 'spin'
	}
};

class CakeForm extends React.Component {
	constructor(props) {
		super(...arguments);
		this._defaultProps = this.constructor.defaultProps;

		this.state = {
			loading: 		this.props.loading || this.props.loadUrl,
			storeStatus: 	"",
			dataLoaded: 	false,
			loadingOverlayKey: 		false,
			loadingOverlayProps: 	{show: false}
		};

		this.handleSubmit = this.handleSubmit.bind(this);

		this.onCakeFormStoreChange = this.onCakeFormStoreChange.bind(this);
		this.onCakeFormStoreSaved = this.onCakeFormStoreSaved.bind(this);
		this.onCakeFormStoreLoaded = this.onCakeFormStoreLoaded.bind(this);

		this.onAlertChange = this.onAlertChange.bind(this);
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
			alertIndex: 		"CakeFormAlert",

			loadingOverlays: {}
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

		ReactDOM.findDOMNode(this).scrollIntoView();

		e.preventDefault();
		this.setState({loading: true}, () => {
			if (this.props.onSubmit) {
				return this.props.onSubmit(e);
			}
			var data = cakeFormStore.getData(modelName);
			if (typeof this.props.getData === "function") {
				data = this.props.getData(data);
			}
			console.log(["SAVING", CakeRouter.parse(this.props.action), data]);
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
		alertStore.addChangeListener(this.onAlertChange);

		this.loadUrl();
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.loadUrl !== "" && this.props.loadUrl !== prevProps.loadUrl) {
			this.loadUrl();
		}
		this.setLoadingOverlayProps();
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
		alertStore.removeChangeListener(this.onAlertChange);
	}

	onAlertChange() {
		if (this._isMounted) {
			if (alertStore.get(this.props.alertIndex)) {
				this.setState({loading: false});
			}
		}
	}

	onCakeFormStoreChange() {
		if (this._isMounted) {
			this.setLoadingOverlayState();
		}
	}

	onCakeFormStoreLoaded() {
		console.log("LOADED!");
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
					var result = cakeFormStore.getResult(modelName),
						redirect = this.props.redirectOnSave;
					if (redirect === true) {
						redirect = {
							controller: Inflector.tableize(modelName),
							action: 'view',
							pass: [result.id]
						};
					} else if (typeof redirect === "object") {
						if (typeof redirect.pass === "undefined") {
							redirect.pass = [];
						}
						redirect.pass.push(result.id);
					}

					if (typeof redirect === "object") {
						redirect = CakeRouter.parse(redirect);
					}
					
					window.location.href = redirect;
				}
			} else {
				this.setLoadingOverlayState(() => {
					this.setLoadingOverlayProps();
					this.props.onSubmitFail();
				});
			}
		}
	}

	/**
	 * Updates the LoadingOverlay state based on CakeFormStore values
	 *
	 * @param function afterSet Method to call after the state has been set
	 * @return bool;
	 **/
	setLoadingOverlayState(afterSet) {
		var modelName = this.getCakeModel();
		return this.setState({
			loading: cakeFormStore.isLoading(modelName),
			dataLoaded: !cakeFormStore.isLoading(modelName),
			storeStatus: cakeFormStore.getStatus(modelName)
		}, () => {
			if (typeof afterSet === "function") {
				afterSet();
			}
		});
	}

	/**
	 * Returns the LoadingOverlay props
	 *
	 * @param string key The LoadingOverlay key
	 * @return object
	 **/
	getLoadingOverlayProps(key) {
		var props = {};
		if (typeof defaultLoadingOverlays[key] !== "undefined") {
			_.merge(props, defaultLoadingOverlays[key]);
		}
		if (typeof this.props.loadingOverlays[key] !== "undefined") {
			_.merge(props, this.props.loadingOverlays[key]);
		}
		return Object.keys(props).length ? props : false;
	}

	setLoadingOverlayProps() {
		var loadingOverlayKey = false,
			loadingOverlayProps = this.state.loadingOverlayProps,
			isLoading = this.state.loading || this.props.status == "loading";

		if (this.state.storeStatus === "saving") {
			loadingOverlayKey = 'saving';
		} else if (this.state.storeStatus === "saved" && this.props.redirectOnSave) {
			loadingOverlayKey = 'redirecting';
		} else if (isLoading) {
			loadingOverlayKey = 'loading';
		} 
		var newLoadingOverlayProps = this.getLoadingOverlayProps(loadingOverlayKey);
		if (newLoadingOverlayProps) {
			loadingOverlayProps = newLoadingOverlayProps;
		} else {
			loadingOverlayProps.show = false;
		}

		if (loadingOverlayKey != this.state.loadingOverlayKey) {
			this.setState({
				loadingOverlayKey: loadingOverlayKey, 
				loadingOverlayProps: loadingOverlayProps
			});
		}
	}

	render() {
		var {className, action, ...other} = this.props,
			dataLoaded = this.state.dataLoaded,
			className = classNames(
				className, 
				"form", 
				"cakeForm",
				{"cakeForm-unloaded": this.state.dataLoaded === false},
				"hasLoadingOverlay"
			);

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
			<LoadingOverlay className="loadingOverlayFixed" {...this.state.loadingOverlayProps} />
			{this.props.children}
		</form>);
	}
};

CakeForm.Submit = SubmitButton;
export default CakeForm;