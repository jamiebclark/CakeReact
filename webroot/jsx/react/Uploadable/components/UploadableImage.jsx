import React from "react";
import _ from "lodash";

class UploadableImage extends React.Component {
	static get defaultProps() {
		return {
			data: {},
			field: "",
			size: ""
		};
	}

	getSrc() {
		return _.get(
			this.props.data, 
			"uploadable." + this.props.field + ".sizes." + this.props.size + ".src", 
			""
		);
	}

	render() {
		var {data, field, size, ...props} = this.props;
		return <img {...props} src={this.getSrc()} />
	}
}

export default UploadableImage;