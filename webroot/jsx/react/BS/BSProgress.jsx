import React from 'react';
import classNames from 'classnames';

class BSProgress extends React.Component {
	static get defaultProps() {
		return {
			value: false,
		}
	}

	render() {
		var children = this.props.children;
		if (this.props.value !== false) {
			children = <BSProgressBar {...this.props}>{children}</BSProgressBar>
		}	
		return <div className="progress">{children}</div>
	}
}

class BSProgressBar extends React.Component {
	static get defaultProps() {
		return {
			min: 0,
			max: 100,
			value: 100,
			type: null,
			striped: false,
			animated: false
		}
	}
	render() {
		let barClassNames =  ['progress-bar', {
			'progress-bar-striped': this.props.striped,
			'active': this.props.animated
		}];
		if (this.props.type) {
			barClassNames.push('progress-bar-' + this.props.type);
		}
		return <div 
				className={classNames(barClassNames)} 
				role="progressbar" 
				aria-valuenow={this.props.value} 
				aria-valuemin={this.props.min}
				aria-valuemax={this.props.max}
				style={{width: ""}}
			>{this.props.children}</div>
	}
}

BSProgress.Bar = BSProgressBar;

export default BSProgress;