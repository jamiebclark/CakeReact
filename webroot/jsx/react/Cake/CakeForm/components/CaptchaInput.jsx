import React from "react";
import Inflector from "react/Cake/lib/Inflector.jsx";
import CakeRouter from "react/Cake/lib/CakeRouter.jsx";
import CakeInput from "react/Cake/CakeForm/components/CakeInput.jsx";
import FAIcon from "react/FAIcon.jsx";

class CaptchaInput extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			url: this.getUrl(),
			loading: false
		};
	}

	static get defaultProps() {
		return {
			cakeModel: null,
			base: "",
			validField: "__captchaField",
			prevalidate: false
		}
	}

	handleRefresh(e) {
		e.preventDefault();
		this.setState({url: this.getUrl()});
	}

	getUrl() {
		var url = new CakeRouter({
			base: this.props.base,
			controller: Inflector.tableize(this.props.cakeModel),
			action: 'captcha_image'
		}).getUrl();
		url += "?" + Math.round(Math.random(0) * 1000) + 1;
		return url;
	}


	renderPrevalidated() {
		return <CakeInput type="hidden" cakeName={this.props.validField} useStore={false} value="1" />
	}

	renderInput() {
		var inputId = "captchaInput";
		return <div className="CaptchaInput">
			<div className="media">
				<div className="pull-left">
					<label htmlFor={inputId}>
						<img src={this.state.url} /><br/>
						<button onClick={this.handleRefresh.bind(this)} className="btn btn-default">
							<FAIcon type="refresh" /> Refresh
						</button>
					</label>
				</div>
				<div className="media-body">
					<CakeInput
						cakeModel={this.props.cakeModel}
						cakeName="captcha"
						label="Please enter the text as seen in the image"
						id={inputId}
						required={true}
					/>
				</div>
			</div>
		</div>
	}

	render() {
		if (!this.props.prevalidate) {
			return this.renderInput();
		} else {
			return this.renderPrevalidated();
		}
	}
}

export default CaptchaInput;