import React 			from "react";
import cakeFormStore 	from "react/Cake/CakeForm/stores/cakeFormStore.jsx";
import BSButton 		from "react/BS/BSButton.jsx";

class SubmitButton extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			loading: false,
			status: "",
			icon: this.props.icon,
			disabled: false
		}

		this.onCakeFormStoreChange = this.onCakeFormStoreChange.bind(this);
		this._isMounted = false;
	}

	static get defaultProps() {
		return {
			component: "button",
			icon: {type: "save"},
			type: "submit",
			buttonType: "primary",
			size: "lg"
		};
	}

	componentDidMount() {
		this._isMounted = true;
		cakeFormStore.addChangeListener(this.onCakeFormStoreChange)
	}

	componentWillUnmount() {
		this._isMounted = false;
		cakeFormStore.removeChangeListener(this.onCakeFormStoreChange)
	}

	onCakeFormStoreChange() {
		if (this._isMounted) {
			var loading = cakeFormStore.isLoading(),
				status = cakeFormStore.getStatus();

			if (loading != this.state.loading || status != this.state.status) {
				this.setState({
					loading: loading,
					status: status
				});
			}
		}
	}

	render() {
		var {...props} = this.props;

		if (this.state.loading) {
			props.disabled = "disabled";
			if (typeof props.icon === "string") {
				props.icon = {type: props.icon};
			}
			if (typeof props.icon !== "object") {
				props.icon = {type: "spinner", animation: "spin"};
			} else {
				props.icon.animation = "pulsate";
			}
		}
		return <BSButton {...props}>{this.props.children}</BSButton>
	}
}

export default SubmitButton;