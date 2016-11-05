import React from 'react';
import CakeTreeList from "./CakeTreeList.jsx";

import cakeTreeActions				from 'react/Cake/CakeTree/actions/cakeTreeActions.jsx';
import cakeTreeStore				from 'react/Cake/CakeTree/stores/cakeTreeStore.jsx';


class CakeTree extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			activePrimaryKey: 		cakeTreeStore.getActive(),
			data: 					cakeTreeStore.getList(),
			cakeModel: 				cakeTreeStore.getModel()
		};
	}

	static get defaultProps() {
		return {
			activePrimaryKey: 		false
		};
	}

	nodeCount(data) {
		var total = 0;
		for (var i in data) {
			total++;
			if (data[i].children) {
				total += this.nodeCount(data[i].children);
			}
		}
		return total;
	}

	componentDidMount() {
		cakeTreeStore.addChangeListener(this.onCakeFormChange.bind(this));
	}

	componentWillUnmount() {
		cakeTreeStore.removeChangeListener(this.onCakeFormChange.bind(this));
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.activePrimaryKey && this.props.activePrimaryKey != nextProps.activePrimaryKey ) {
			this.setState({activePrimaryKey: nextProps.activePrimaryKey});
		}
	}

	onCakeFormChange() {
		this.setState({
			activePrimaryKey: cakeTreeStore.getActive(),
			data: cakeTreeStore.getList(),
			cakeModel: cakeTreeStore.getModel()
		});
	}

	render() {
		var {...other} = this.props;
		return <div className="CakeTree">
			<CakeTreeList 
				activePrimaryKey={this.state.activePrimaryKey}
				{...other} 
				data={this.state.data}
				cakeModel={this.state.cakeModel}
			/>
		</div>
	}
}

export default CakeTree;