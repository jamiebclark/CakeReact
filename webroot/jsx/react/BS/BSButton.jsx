import React from "react";
import FAIcon from "react/FAIcon.jsx";

class BSButton extends React.Component {
	static get defaultProps() {
		return {
			icon: false,
			component: "a",
			buttonType: "default",
			size: false
		}
	}

	render() {
		var {component, loading, buttonType, size, icon, ...other} = this.props;
		var children = [];

		if (icon) {
			children.push(<FAIcon key="icon" type={icon} className="btn-icon" />);
		}

		children.push(this.props.children);
		
		if (typeof other.className === "undefined") {
			other.className = "btn";
			other.className += " btn-" + this.props.buttonType;
			other.className += " btn-" + this.props.size;
		}
		return React.createElement(this.props.component, other, children);
	}
}

export default BSButton;