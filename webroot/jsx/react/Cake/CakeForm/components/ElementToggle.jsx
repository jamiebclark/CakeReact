import React from "react";
import JQueryTransition from "react/JQuery/JQueryTransition.jsx";
import FAIcon from "react/FAIcon.jsx";

import classNames from "classnames";

require("scss/modules/react/cake_form/_element_toggle.scss");

class ElementToggle extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			show: this.props.show
		};
	}

	static get defaultProps() {
		return {
			show: true,
			offContent: [],
			label: "Click to toggle"
		}
	}

	handleClick(e) {
		e.preventDefault();
		return this.setState({show: !this.state.show});
	}

	render() {
		var offContent = this.props.offContent,
			className = classNames("elementToggle", 
				{"elementToggle-hidden": !this.state.show}
			);

		if (typeof offContent === "function") {
			offContent = offContent();
		}

		return <div className={className}>
			<a href="#" className="elementToggleControl" onClick={this.handleClick.bind(this)}>
				<FAIcon type="arrow-right" fixed={true} />
				{this.props.label}
			</a>
			<div className="elementToggleBody">
				{this.state.show ? this.props.children : offContent}
			</div>
		</div>
	}
}

export default ElementToggle;

/*


		if (offContent !== "" && offContent !== null) {
			offContent = <JQueryTransition
					className="elementToggleBody"
					jQuerySlideDown={!this.state.show}
					removeChildrenOnHide={true}
				>
					{offContent}
				</JQueryTransition>
		}



			{offContent}
			<JQueryTransition 
				className="elementToggleBody"
				jQuerySlideDown={this.state.show} 
				removeChildrenOnHide={true}
			>
				{this.props.children}
			</JQueryTransition>
*/