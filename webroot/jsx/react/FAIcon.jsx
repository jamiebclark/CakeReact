import React 		from "react";
import _ 			from "lodash";
import classNames 	from "classnames";

class FAIcon extends React.Component {
	static get defaultProps() {
		return {
			type: "font-awesome",
			size: false,
			
			fixed: false,
			spin: false,
			rotate: 0,
			flip: false,
			animation: false,
			stack: {}
		}
	}

	_renderStack() {
		var {...props} = this.props,
			out = [];
		for (let i in props.stack) {
			let childProps = props.stack[i];
			if (typeof childProps === "string") {
				childProps = {type: childProps};
			}
			out.push(<FAIcon key={i} {...childProps} />);
		}
		return <FAIconStack>{out}</FAIconStack>
	}

	_renderIcon() {
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
	render() {
		if (_.keys(this.props.stack).length > 0) {
			return this._renderStack();
		} else {
			return this._renderIcon();
		}

	}
}

class FAIconStack extends React.Component {
	render() {
		var {className, ...other} = this.props;
		return <span className={classNames("fa-stack", className)}>
			{this.props.children}
		</span>
	}
}
export default FAIcon;