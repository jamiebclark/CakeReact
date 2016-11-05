import React from "react";
import {CakeInput} from "react/Cake/CakeForm/components/";

require("scss/modules/react/form/_radio_hidden.scss");


class RadioHidden extends React.Component {
	static get defaultProps() {
		return {
			className: "",
			active: false,
			label: ""
		}
	}

	render() {
		var {label, active, className, ...other} = this.props;
		className += " RadioHidden";
		if (active) {
			className += " active";
		}
		return <label className={className}>
			<CakeInput 
				{...other} 
				type="radio" 
				wrap={false}
			/>{label}
		</label>;
	}
}
export default RadioHidden;