import React from "react";
import _ from "lodash";

class FAIcon extends React.Component {
	static get defaultProps() {
		return {
			type: "font-awesome",
			size: false,
			fixed: false,
			spin: false,
			rotate: 0,
			flip: false,
			animation: false
		}
	}
	
	render() {
		var {...props} = this.props;
		if (typeof props.type === "object") {
			var newType = props.type.type;
			props = _.merge(props, this.props.type);
			props.type = newType;
		}

		var c = "fa";
		c += " fa-" + props.type;
		if (props.size) {
			c += " fa-" + props.size;
		}
		if (props.fixed) {
			c += " fa-fw";
		}
		if (props.spin) {
			c += " fa-spin";
		}
		if (props.rotate) {
			c += " fa-rotate-" + props.rotate;
		}
		if (props.flip) {
			c += " fa-flip-" + props.flip;
		}
		if (props.animation) {
			c += " fa-" + props.animation;
		}
		if (typeof props.className != "undefined") {
			c += " " + props.className;
		}
		return (<i className={c} />);
	}
}

export default FAIcon;