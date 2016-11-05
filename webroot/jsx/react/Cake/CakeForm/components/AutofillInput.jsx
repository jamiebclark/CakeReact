import React from "react";
import ReactDOM from "react-dom";
import FAIcon from "react/FAIcon.jsx";

require("scss/modules/react/cake_form/_autofill_input.scss");

// Performs a case-insensitive search
var indexOfi = function(baseString, checkString) {
	return baseString.toLowerCase().indexOf(checkString.toLowerCase());
}

class AutofillInput extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			value: ""
		};
	}

	static get defaultProps() {
		return {
			placeholder: "Search",
			options: [],
			value: false,
			onClick: function(value, label) {},
			onChange: function(text) {},
			autoFocus: false
		}
	}

	componentDidMount() {
		this._isMounted = true;
		this.handleAutoFocus();
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.value !== false && nextProps.value != this.state.value) {
			this.setState({value: nextProps.value});
		}
	}

	componentDidUpdate() {
		this.handleAutoFocus();
	}

	handleAutoFocus() {
		if (this._isMounted && this.props.autoFocus) {
			ReactDOM.findDOMNode(this.refs.autocomplete).focus();
		}
	}

	handleKeyDown(e) {
		// Ignores the Enter key
		if (e.keyCode === 13) {
			e.preventDefault();
			e.stopPropagation();
		}
	}	

	handleChange(e) {
		this.changeText(e.target.value);
	}

	handleClick(value, label) {
		this.props.onClick(value, label);	
	}


	// Clears the text box
	handleClear(e) {
		e.preventDefault();
		this.changeText("");
	}

	changeText(newText, onFinished) {
		this.setState({value: newText}, () => {
			this.props.onChange(newText);
			if (typeof onFinished === "function") {
				onFinished();
			}
		});
	}

	getResults() {
		if (this.state.value !== "") {
			let list = [],
				valueLength = this.state.value.length;
			for (let i in this.props.options) {

				let option = this.props.options[i],
					value = option.key,
					label = option.value,
					matchIndex = indexOfi(label, this.state.value);


				if (matchIndex == -1) {
					continue;
				}

				list.push(<AutofillInputOption
					key={option.key}
					value={option.key}
					label={option.value}
					match={this.state.value}
					onClick={this.handleClick.bind(this)}
				/>);
			}
			return <ul className="autofillInput-results dropdown-sub-menu" key="results">{list}</ul>;
		} else {
			return <span style={{display: "none"}} />;
		}
	}

	render() {
		return <div className="autofillInput">
			<div className="autofillInput-group input-group input-group-sm">
				<input 
					ref="autocomplete"
					autoFocus={true}
					type="text" 
					onKeyDown={this.handleKeyDown.bind(this)}
					className="autofillInput-input form-control" 
					onChange={this.handleChange.bind(this)} 
					value={this.state.value} 
					placeholder={this.props.placeholder}
				/>
				<span className="input-group-btn">
					<button 
						className="btn btn-default"
						onClick={this.handleClear.bind(this)}
					>
						<FAIcon type="times" />
					</button>
				</span>
			</div>
			{this.getResults()}
		</div>
	}
}

class AutofillInputOption extends React.Component {
	static get defaultProps() {
		return {
			value: "",
			label: "",
			match: "",
			onClick: function() {}
		}
	}

	handleClick(e) {
		e.preventDefault();
		this.props.onClick(this.props.value, this.props.label);
	}

	render() {
		let {label, value, match} = this.props,
			matchIndex = indexOfi(label, match),
			matchLength = match.length;

		if (matchLength == 0 || matchIndex == -1) {
			return [];
		}
		
		return <li key={value}>
			<a 
				href="#"
				className=""
				onClick={this.handleClick.bind(this)}
			>
				{label.substring(0, matchIndex)}
				<strong>{label.substring(matchIndex, matchIndex + matchLength)}</strong>
				{label.substring(matchIndex + matchLength)}
			</a>
		</li>
	}
}

export default AutofillInput;