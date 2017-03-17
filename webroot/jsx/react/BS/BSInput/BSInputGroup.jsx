import React from 'react';
import classNames from "classnames";

class BSInputGroup extends React.Component {
	static get defaultProps() {
		return {
			addonBefore: "",
			addonAfter: "",
			buttonBefore: "",
			buttonAfter: "",
			className: ""
		};
	}
	render() {
		var addons = {before: [], after: []};
		var map = [
			["addonBefore", "before", 'BSInputGroupAddon'],
			["addonAfter", "after", "BSInputGroupAddon"],
			["buttonBefore", "before", 'BSInputGroupButton'],
			["buttonAfter", "after", 'BSInputGroupButton']
		];
		var className = classNames(this.props.className, "input-group");

		for (var i in map) {
			if (this.props[map[i][0]]) {
				addons[map[i][1]].push(React.createElement(eval(map[i][2]), {key: map[i][1]}, this.props[map[i][0]]));
			}
		}

		return (<div className={className}>
			{addons.before}
			{this.props.children}
			{addons.after}
		</div>);
	}
}


class BSInputGroupButton extends React.Component {
	render() {
		return (<div className="input-group-btn">
			{this.props.children}
		</div>);
	}
}

class BSInputGroupAddon extends React.Component {
	render() {
		return (<div className="input-group-addon">
			{this.props.children}
		</div>);
	}
}

export default BSInputGroup;