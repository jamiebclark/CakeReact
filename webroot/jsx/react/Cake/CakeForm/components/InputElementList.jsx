import React 				from "react";
import cakeFormStore 		from "react/Cake/CakeForm/stores/cakeFormStore.jsx";
import cakeFormActions		from "react/Cake/CakeForm/actions/cakeFormActions.jsx";

import FAIcon 				from "react/FAIcon.jsx";
import JQueryTransition 	from "react/JQuery/JQueryTransition.jsx";

require("scss/modules/react/form/_input_element_list.scss")

class InputElementList extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			totalBlankItems: parseInt(this.props.addBlank),
			totalItemsVisible: 0,
			totalItemsRemoved: 0,
		};
	}

	static get defaultProps() {
		return {
			cakeModel: null,
			repeater: function(key) {},
			addBlank: 1,
			minimum: 1,
			indexField: "id",
			onRemoveItem: function(key) {}
		}
	}

	componentDidMount() {
		this.setVisibleItems();
	}

	handleAddItemCount(e) {
		e.preventDefault();
		this.setState({totalBlankItems: (this.state.totalBlankItems + 1)}, () => {
			this.setVisibleItems();
		});
	}

	handleRemoveItem(key) {
		this.setState({totalItemsRemoved: this.state.totalItemsRemoved + 1}, () => {
			this.setVisibleItems();
		});
		this.props.onRemoveItem(key)
	}

	handleShowItem() {
		this.setState({totalItemsRemoved: this.state.totalItemsRemoved - 1}, () => {
			this.setVisibleItems();
		});
	}

	getDataCount() {
		var data = cakeFormStore.getData(),
			count = 0;
		if (typeof data[this.props.cakeModel] === "object") {
			for (let i in data[this.props.cakeModel]) {
				if (
					typeof data[this.props.cakeModel][i][this.props.indexField] !== "undefined" && 
					data[this.props.cakeModel][i][this.props.indexField] !== ""
				) {
					count++;
				}
			}
		}
		return count;
	}

	getItemCount() {
		var itemCount = this.getDataCount();
		if (this.state.totalBlankItems) {
			itemCount += this.state.totalBlankItems;
		}
		if (this.props.minimum && itemCount < this.props.minimum) {
			itemCount = this.props.minimum;
		}
		return itemCount;
	}

	getVisibleItems() {
		return this.getItemCount() - this.state.totalItemsRemoved;// + this.state.totalBlankItems;
	}

	setVisibleItems() {
		var totalItemsVisible = this.getVisibleItems();
		if (totalItemsVisible != this.state.totalItemsVisible) {
			this.setState({totalItemsVisible: totalItemsVisible});
		}
	}

	render() {
		var itemCount = this.getItemCount(),
			children = [];
		for (var i = 0; i < itemCount; i++) {
			children.push(<InputElementListItem 
				key={i} 
				index={i} 
				cakeModel={this.props.cakeModel}
				indexField={this.props.indexField}
				allowRemove={this.state.totalItemsVisible > this.props.minimum}
				onRemove={this.handleRemoveItem.bind(this, i)}
				onShow={this.handleShowItem.bind(this, i)}
			>
				{this.props.repeater(i, this.props.cakeModel)}
			</InputElementListItem>)
		}
		return <div className="InputElementList panel panel-default">
			<div className="InputElementList-Body">
				{children}
			</div>
			<div className="InputElementList-Footer panel-footer">
				<button type="button" className="btn btn-default" onClick={this.handleAddItemCount.bind(this)}>Add</button>
			</div>
		</div>
	}
}

class InputElementListItem extends React.Component {
	constructor() {
		super(...arguments);

		this.state = {
			removed: false,
		}
	}

	static get defaultProps() {
		return {
			index: 0,
			cakeModel: null,
			indexField: "id",
			allowRemove: true,
			onRemove: function() {},
			onShow: function() {}
		}
	}

	handleRemoveClick(e) {
		e.preventDefault();
		this.toggleRemoved();
	}

	toggleRemoved() {
		this.setState({
			removed: !this.state.removed
		}, () => {
			var val = this.getVal();
			if (val > 0) {
				if (this.state.removed) {
					cakeFormActions.addDeleteId(this.props.cakeModel, val);
				} else {
					cakeFormActions.removeDeleteId(this.props.cakeModel, val);
				}
			}
			if (this.state.removed) {
				this.props.onRemove();
			} else {
				this.props.onShow();
			}
		});
	}

	getVal() {
		var key = this.props.index + "." + this.props.indexField;
		if (this.props.cakeModel !== null) {
			key = this.props.cakeModel + "." + key;
		}
		return cakeFormStore.getVal(key);
	}

	render() {
		var removeBtnClass = "InputElmenetListItemRemoveBtn btn ",
			itemClass = "InputElementListItem",
			removeButton = [];

		if (this.state.removed) {
			removeBtnClass += "btn-primary";
			itemClass += " InputElementListItem-removed";
		} else {
			removeBtnClass += "btn-default";
		}

		if (this.props.allowRemove || this.state.removed) {
			removeButton = <button 
				type="button" 
				className={removeBtnClass} 
				onClick={this.handleRemoveClick.bind(this)} 
				style={{
					float: "right"
				}} >
				<FAIcon type="times" />
			</button>;
			itemClass += " InputElementListItem-hasRemoveBtn";
		}

		return <div className={itemClass} style={{overflow: "hidden"}}>
			{removeButton}
			<JQueryTransition 
				jQuerySlideUp={this.state.removed} 
				className="InputElementListItem-inner"
				removeChildrenOnHide={true}
			>
				{this.props.children}
			</JQueryTransition>
		</div>
	}
}

export default InputElementList;