import React 		from "react";
import FAIcon		from 'react/FAIcon.jsx';
import CakeTreeList from "./CakeTreeList.jsx";
import PropCompare	from 'react/lib/PropCompare.jsx';

import $ 			from 'jquery';

class CakeTreeListItem extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			collapseAnimate: 	false,
			collapsed: 			!this.props.depth
		};
		if (typeof this.props.collapsed !== "undefined") {
			this.state.collapsed = this.props.collapsed;
		}
		this.handleToggle 		= this.handleToggle.bind(this);
	}

	static get defaultProps() {
		return {
			data: 			{},
			depth: 			0,
			parentPath: 	"",
			collapsed: 		null,
			getLayout: 		function(data) { return {}},
			onRender: 		function() {},
			primaryKey: 	0,
			onSetActive: 	function(primaryKey) {}
		}
	}

	shouldComponentUpdate(newProps, newState) {
		return PropCompare.hasElementChanged(this, newProps, newState);
	}

	componentDidMount() {
		this.animateCollapse();
	}
	
	componentDidUpdate() {
		this.animateCollapse();
	}

	handleToggle(toggleKey, toggleValue) {
		var state = {};
		state[toggleKey] = toggleValue;
		this.setState(state);
	}

	handleGetLayout(data) {
		return this.props.getLayout(data);
	}

	handleSetActive(primaryKey) {
		this.props.onSetActive(primaryKey);
	}

	handleRender() {
		return this.props.onRender();
	}

	animateCollapse() {
		var $el = $(this._el),
			$children = $('> .CakeTreeListItem-Children', $el);
		if (this.state.collapseAnimate) {
			$children.stop().slideToggle(400, () => {
				this.setState({collapseAnimate: false, collapsed: !this.state.collapsed});
			});
		}
	}

	getLayoutElement(type) {
		var layout = this.props.getLayout(this.props.data);
		if (typeof layout[type] !== "undefined") {
			return layout[type]();
		} else {
			return "";
		}
	}

	setActive() {
		this.handleSetActive(this.props.primaryKey);
	}

	render() {
		var children = [],
			collapseControl = "";
		if (this.props.data.children.length) {
			children = <CakeTreeList 
				data={this.props.data.children} 
				depth={this.props.depth + 1} 
				parentPath={this.props.parentPath + ".children"}
				getItemLayout={this.handleGetLayout.bind(this)}
				onRendereItem={this.handleRender.bind(this)}
				onSetListItemActive={this.handleSetActive.bind(this)}
				cakeModel={this.props.cakeModel}
				activePrimaryKey={this.props.activePrimaryKey}
			/>;
			collapseControl = <ToggleControl
					toggleKey="collapseAnimate"
					value={this.state.collapseAnimate}
					onToggle={this.handleToggle}
					className="CakeTreeListItem-collapseControl"
				>
					<FAIcon type={this.state.collapsed ? 'plus-square' : 'minus-square'} />
				</ToggleControl>
		} else {
			collapseControl = <span className="CakeTreeListItem-collapseControl CakeTreeListItem-collapseControl-empty">
				<FAIcon type="square" />
			</span>;
		}

		if (!this.state.collapseAnimate && this.state.collapsed) {
			children = [];
		}

		var title = this.getLayoutElement("title"),
			body = this.getLayoutElement("body"),
			listItemClass = "CakeTreeListItem";

		if (this.props.activePrimaryKey === this.props.primaryKey) {
			listItemClass += " CakeTreeListItem-active";
		}
		this.handleRender();

		return <li className={listItemClass}
			ref={(c) => {this._el = c;}} >
			{collapseControl}
			<div className="CakeTreeListItem-title">
				{title}
			</div>

			<div className="CakeTreeListItem-body">
				{body}
			</div>

			<div className="CakeTreeListItem-Children">
				{children}
			</div>
		</li>;
	}
}



export default CakeTreeListItem;


class ToggleControl extends React.Component {
	constructor() {
		super(...arguments);
		this.handleToggle = this.handleToggle.bind(this);
	}
	static get defaultProps() {
		return {
			toggleKey:  	"",
			value: 			false,
			onToggle: 		function(toggleKey, toggleValue) {}
		};
	}
	handleToggle(e) {
		e.preventDefault();
		var k = this.props.toggleKey,
			v = !this.props.value;
		this.props.onToggle(k, v);
	}
	render() {
		var {toggleKey, value, onToggle, ...other} = this.props;

		return <a
			href="#"
			{...other}
			onClick={this.handleToggle}
		>
			{this.props.children}
		</a>
	}
}