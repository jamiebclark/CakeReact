import React 			from "react";
import {CakeInput}
				 		from "react/Cake/CakeForm/components/";
import AjaxFetch 		from "react/lib/AjaxFetch.jsx";
import JQueryTransition from "react/JQuery/JQueryTransition.jsx";

import CakeRouter 		from "react/Cake/lib/CakeRouter.jsx";
import Inflector		from "react/Cake/lib/Inflector.jsx";
import LoadingOverlay	from "react/LoadingOverlay.jsx";


class ProfileAutoFill extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			data: [],
			pickedProfile: {},
			loading: false
		}

		this._isMounted = false;
	}

	static get defaultProps() {
		return {
			cakeModel: "",
			title: "",
			state: "",
			zip: "",
			onPick: function(value, label) {}
		};
	}

	loadData() {
		if (!this._isMounted) {
			return null;
		}
		if (this.props.title === "") {
			this.setState({loading: false});
			return null;
		}

		var url = {
			prefix: "json",
			controller: "find_profiles",
			action: "model_search",
			pass: [this.props.cakeModel, this.props.title],
			named: {"hasAddress": 1}
		};

		if (this.props.zip !== "") {
			url.named["zip"] = this.props.zip;
		}
		if (this.props.state !== "") {
			url.named["state"] = this.props.state;
		}
		url = new CakeRouter(url).getUrl();
		new AjaxFetch()
			.getJSON(url)
			.then((data) => {
				if (this._isMounted) {
					this.setState({data: data}, () => {
						this.setState({loading: false});
					});
				}
			})
			.catch((err) => {
				console.error(err.message);
				if (this._isMounted) {
					this.setState({loading: false});
				}
			});
	}

	componentDidMount() {
		this._isMounted = true;
		this.loadData();
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	componentDidUpdate(prevProps) {

	//	console.log(this.props);

		if (this._isMounted && prevProps != this.props) {
			this.setState({loading: true}, () => {
				if (this._timeout) {
					clearTimeout(this._timeout);
				}
				this._timeout = setTimeout(() => {
					this.loadData();
				}, 500);
			});
		}
	}

	handlePick(data) {
		this.props.onPick(data.value, data);
	}

	render() {
		var children = [];
		for (var i in this.state.data) {
			children.push(<ProfileAutoFillItem 
				cakeModel={this.props.cakeModel}
				key={i} 
				data={this.state.data[i]} 
				onPick={this.handlePick.bind(this)} 
			/>);
		}
		return <div className="ProfileAutoFill hasLoadingOverlay">
			<div className="list-group" style={{minHeight: "200px"}} >
				{children}
			</div>
			<LoadingOverlay show={this.state.loading === true} />
		</div>
	}
}


class ProfileAutoFillItem extends React.Component {
	static get defaultProps() {
		return {
			data: {},
			onPick: function(data) {},
			cakeModel: "",
		}
	}

	handleClick(e) {
		e.preventDefault();
		this.props.onPick(this.props.data);
	}

	render() {
		return <a 
			className="ProfileAutoFillItem list-group-item" 
			href="#" 
			onClick={this.handleClick.bind(this)}>
			<span className={Inflector.underscore(this.props.cakeModel)}>{this.props.data.label}</span><br/>
			<small>{this.props.data.city_state}</small>
		</a>
	}
}

class ProfileAutoFillPicked extends React.Component {
	static get defaultProps() {
		return {
			cakeModel: "",
			data: {}
		}
	}

	render() {
		return <div className="ProfileAutoFillPicked">
			<CakeInput cakeName={this.props.cakeModel + ".id"} type="hidden" value={this.props.data.value} />
			<h4>
				<span className={Inflector.underscore(this.props.cakeModel)}>{this.props.data.label}</span><br/>
				<small>{this.props.data.subtitle}</small>
			</h4>
		</div>
	}
}

ProfileAutoFill.Picked = ProfileAutoFillPicked;
export default ProfileAutoFill;