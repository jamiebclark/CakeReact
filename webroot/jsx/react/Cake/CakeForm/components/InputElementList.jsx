import React 				from "react";
import cakeFormStore 		from "react/Cake/CakeForm/stores/cakeFormStore.jsx";
import cakeFormActions		from "react/Cake/CakeForm/actions/cakeFormActions.jsx";
import {CakeInput} 			from "react/Cake/CakeForm/components/";

import FAIcon 				from "react/FAIcon.jsx";
import JQueryTransition 	from "react/JQuery/JQueryTransition.jsx";

import _ 					from "lodash";

require("scss/modules/react/form/_input_element_list.scss");

var BLANK_FIELD = "__input_element_list-isblank";

class InputElementList extends React.Component {
	constructor() {
		super(...arguments);
		var totalBlank = parseInt(this.props.addBlank),
			totalDataItems = this.getDataCount();

		this.state = {
			totalItems: totalDataItems + totalBlank,
			totalDataItems: totalDataItems,
			totalBlankItems: totalBlank,
			totalItemsVisible: 0,
			totalItemsRemoved: 0,
			blankKeys: [],
			visibleKeys: [],
			hiddenKeys: []
		};

		this.onCakeFormChange = this.onCakeFormChange.bind(this);
		this.onCakeFormLoaded = this.onCakeFormLoaded.bind(this);

		//this.setItemCount();
	}

	static get defaultProps() {
		return {
			cakeModel: null,
			repeater: function(key) {},
			addBlank: 1,
			minimum: 1,
			indexField: "id",
			onShowItem: function(key, totalItems, totalVisible, totalHidden) {},
			onAddItem: function(key, totalItems, totalVisible, totalHidden) {},
			onRemoveItem: function(key, totalItems, totalVisible, totalHidden) {},
			onCountChange: function(totalItems, totalVisible, totalHidden, visibleKeys, hiddenKeys) {},
			addButtonText: "Add",
			addButtonClass: "btn btn-default"
		}
	}

	componentDidMount() {
		this._isMounted = true;
		cakeFormStore.addChangeListener(this.onCakeFormChange);
		cakeFormStore.addLoadedListener(this.onCakeFormLoaded);
	}


	componentWillUnmount() {
		this._isMounted = false;
		cakeFormStore.removeChangeListener(this.onCakeFormChange);
		cakeFormStore.removeLoadedListener(this.onCakeFormLoaded);
	}

	onCakeFormChange() {
		this.setItemCount();
	}

	onCakeFormLoaded() {
		this.initializeItemCount();
	}

	handleAddItem(key, e) {
		e.preventDefault();
		var visibleKeys = this.state.visibleKeys,
			blankKeys = this.state.blankKeys;
		visibleKeys.push(key);
		blankKeys.push(key);

		this.setState({
			totalBlankItems: (this.state.totalBlankItems + 1),
			visibleKeys: visibleKeys,
			blankKeys: blankKeys
		}, () => {
			this.setItemCount(() => {
				this.props.onAddItem(key, this.state.totalItems, this.state.totalItemsVisible, this.state.totalItemsRemoved);
			});
		});
	}

	handleRemoveItem(key) {
		var hiddenKeys = this.state.hiddenKeys,
			visibleKeys = this.state.visibleKeys;
		_.pull(visibleKeys, key);
		hiddenKeys.push(key);
		this.setState({
			totalItemsRemoved: this.state.totalItemsRemoved + 1,
			visibleKeys: visibleKeys,
			hiddenKeys: hiddenKeys
		}, () => {
			this.setItemCount(() => {
				this.props.onRemoveItem(key, this.state.totalItems, this.state.totalItemsVisible, this.state.totalItemsRemoved);
			});
		});
	}

	handleShowItem(key) {
		var hiddenKeys = this.state.hiddenKeys,
			visibleKeys = this.state.visibleKeys;
		visibleKeys.push(key);
		_.pull(hiddenKeys, key);

		this.setState({
			visibleKeys: visibleKeys,
			hiddenKeys: hiddenKeys,
			totalItemsRemoved: this.state.totalItemsRemoved - 1
		}, () => {
			this.setItemCount(() => {
				this.props.onShowItem(key, this.state.totalItems, this.state.totalItemsVisible, this.state.totalItemsRemoved);
			});
		});
	}

	/**
	 * Determines how many items in the list have been loaded from a data source
	 *
	 * @param bool fromLoaded Whether to look at loaded data, or the available data
	 * @return int The count of data items
	 **/
	getDataCount(fromLoaded) {
		var data = fromLoaded ? cakeFormStore.getLoadedData() : cakeFormStore.getData(),
			count = 0;
		if (typeof data[this.props.cakeModel] === "object") {
			for (let i in data[this.props.cakeModel]) {
				if (!data[this.props.cakeModel][i][BLANK_FIELD]) {
					count++;
				}
			}
		}
		return count;
	}

	initializeItemCount() {
		var visibleKeys = [],
			itemCount = this.getDataCount(true);
		for (var i = 0; i < itemCount; i++) {
			visibleKeys.push(i);
		}
		this.setState({
			visibleKeys: visibleKeys,
			hiddenKeys: []
		}, () => {
			this.setItemCount(null, true);
		});
	}

	setItemCount(afterSet, fromLoaded) {
		var totalDataItems = this.getDataCount(fromLoaded),
			itemCount = totalDataItems,
			setState = {};
		
		if (totalDataItems != this.state.totalDataItems) {
			setState.totalDataItems = totalDataItems;
		}

		if (this.state.totalBlankItems) {
			itemCount += this.state.totalBlankItems;
		}

		if (this.props.minimum && itemCount < this.props.minimum) {
			itemCount = this.props.minimum;
		}

		if (itemCount != this.state.totalItems) {
			setState.totalItems = itemCount;
		}
		var totalItemsVisible = itemCount - this.state.totalItemsRemoved;
		if (totalItemsVisible != this.state.totalItemsVisible) {
			setState.totalItemsVisible = totalItemsVisible;
		}
	
		/*
		console.log({
			"Data Items": totalDataItems,
			"Blank Items": this.state.totalBlankItems,
			"Total Items": itemCount,

			"Removed Items": this.state.totalItemsRemoved,
			"Visible Items": this.state.totalItemsVisible,
			"STATE": setState
		});
		*/
		if (_.size(setState)) {
			return this.setState(setState, () => {
				if (typeof afterSet === "function") {
					afterSet();
				}
				this.props.onCountChange(
					this.state.totalItems, 
					this.state.totalItemsVisible, 
					this.state.totalItemsRemoved,
					this.state.visibleKeys,
					this.state.hiddenKeys
				);
			});
		} else if (typeof afterSet === "function") {
			afterSet();
		}
		return null;
	}

	render() {
		var itemCount = this.state.totalItems,
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
				isBlank={this.state.blankKeys.indexOf(i) !== -1}
			>
				{this.props.repeater(i, this.props.cakeModel)}
			</InputElementListItem>)
		}
		return <div className="InputElementList panel panel-default">
			<div className="InputElementList-Body">
				{children}
			</div>
			<div className="InputElementList-Footer panel-footer">
				<button 
					type="button" 
					className={this.props.addButtonClass}
					onClick={this.handleAddItem.bind(this, i)}
				>{this.props.addButtonText}</button>
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
			isBlank: false,
			onRemove: function() {},
			onShow: function() {}
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.removed != prevState.removed) {
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
		}
	}

	handleRemoveClick(e) {
		e.preventDefault();
		this.toggleRemoved();
	}

	toggleRemoved() {
		this.setState({removed: !this.state.removed});
	}

	getVal() {
		var key = this.props.index + "." + this.props.indexField;
		if (this.props.cakeModel !== null) {
			key = this.props.cakeModel + "." + key;
		}
		return cakeFormStore.getVal(key);
	}


	render() {
		var removeBtnClass = "InputElementListItemRemoveBtn btn ",
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
				>
				<FAIcon type="times" />
			</button>;
			itemClass += " InputElementListItem-hasRemoveBtn";
		}

		var children = this.props.children, 
			isBlank = "";
		if (this.state.removed) {
			children = [];
		}
		if (this.props.isBlank) {
			isBlank = <CakeInput type="hidden" cakeName={this.props.cakeModel + "." + this.props.index + "." + BLANK_FIELD} value="1" />
		}

		return <div className={itemClass} style={{overflow: "hidden"}}>
			{isBlank}
			{removeButton}
			<div className="InputElementListItem-inner">{children}</div>
		</div>
	}
}

export default InputElementList;