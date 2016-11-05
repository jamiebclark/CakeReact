import React from "react";
import CakeTreeListItem from "./CakeTreeListItem.jsx";

class CakeTreeList extends React.Component {
	constructor() {
		super(...arguments);
	}

	static get defaultProps() {
		return {
			data: {},
			depth: 0,
			parentPath: "",
			cakeModel: "",
			onListItemToggle: function(listItemKey, toggleKey, toggleValue) {},
			getItemLayout: function(data) {return {}},
			onRenderItem: function() {},
			onSetListItemActive: function(primaryKey) {},
			activePrimaryKey: false
		}
	}

	handleGetItemLayout(data) {
		return this.props.getItemLayout(data);
	}

	handleSetListItemActive(primaryKey) {
		this.props.onSetListItemActive(primaryKey);
	}

	handleRenderItem() {
		this.props.onRenderItem();
	}

	render() {
		if (this.props.data) {
			var children = this.props.data.map((node, index) => {
				var parentPath = index,
					primaryKey = node[this.props.cakeModel].id;

				if (this.props.parentPath !== "") {
					parentPath = this.props.parentPath + "." + parentPath;
				}

				return <CakeTreeListItem 
					key={primaryKey}
					primaryKey={primaryKey} 
					data={node} 
					depth={this.props.depth} 
					parentPath={parentPath}
					cakeModel={this.props.cakeModel}
					getLayout={this.handleGetItemLayout.bind(this)}
					onRender={this.handleRenderItem.bind(this)}
					onSetActive={this.handleSetListItemActive.bind(this)}
					activePrimaryKey={this.props.activePrimaryKey}
				/>
			});
			return <ul className="CakeTreeList">{children}</ul>;
		} else {
			return <div></div>;
		}
	}
}

export default CakeTreeList;