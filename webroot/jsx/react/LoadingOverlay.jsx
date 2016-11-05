import React 	from 'react';
import FAIcon 	from './FAIcon.jsx';
import JQueryTransition from 'react/JQuery/JQueryTransition.jsx';
import classNames from 'classnames';

require('../../scss/modules/react/_loading_overlay.scss');

class LoadingOverlay extends React.Component {
	static get defaultProps() {
		return {
			show: false,
			message: "Loading",
			iconType: "spinner",
			iconAnimation: "spin"
		};
	}

	render() {

		return <div 
				className={classNames("loadingOverlay", {show: this.props.show})}
			>
				<div className="loadingOverlayInner">
					<div className="loadingOverlayInner-icon">
						<FAIcon 
							animation={this.props.iconAnimation} 
							type={this.props.iconType} 
						/>
					</div>
					<div className="loadingOverlayInner-message">
						{this.props.message}
					</div>
				</div>
			</div>
	}

	renderOLD() {

		return <JQueryTransition 
				component="div"
				className="loadingOverlay"
				jQueryFadeIn={this.props.show}
			>
				<div className="loadingOverlayInner">
					<div className="loadingOverlayInner-icon">
						<FAIcon 
							animation={this.props.iconAnimation} 
							type={this.props.iconType} 
						/>
					</div>
					<div className="loadingOverlayInner-message">
						{this.props.message}
					</div>
				</div>
			</JQueryTransition>
	}
}
export default LoadingOverlay;