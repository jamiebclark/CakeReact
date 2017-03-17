import React 	from 'react';
import FAIcon 	from './FAIcon.jsx';
//import JQueryTransition from 'react/JQuery/JQueryTransition.jsx';
import classNames from 'classnames';

require('../../scss/modules/react/_loading_overlay.scss');

var defaultCarouselTimer = 5000;

class LoadingOverlay extends React.Component {
	static get defaultProps() {
		return {
			className: "",
			show: false,
			beforeMessage: [],
			message: "Loading",
			iconType: "spinner",
			iconAnimation: "spin",
			carousel: false,
			carouselTimer: defaultCarouselTimer
		};
	}

	render() {
		if (this.props.carousel) {
			var out = [], i;
			for (i in this.props.carousel) {
				out.push(<LoadingOverlay 
					key={i} 
					carousel={false} 
					className={this.props.className}
					beforeMessage={this.props.beforeMessage}
					iconType={this.props.iconType}
					iconAnimation={this.props.iconAnimation}
					{...this.props.carousel[i]} 
				/>);
			}
			return <LoadingOverlayCarousel 
					timer={this.props.carouselTimer}
					show={this.props.show}
				>
					{out}
				</LoadingOverlayCarousel>
		} else {
			let icon = [];
			if (this.props.iconType) {
				icon = <div className="loadingOverlayInner-icon">
					<FAIcon 
						animation={this.props.iconAnimation} 
						type={this.props.iconType} 
					/>
				</div>;
			}
		
			return <div className={classNames("loadingOverlay", this.props.className, {show: this.props.show})}>
					<div className="loadingOverlayInner">
						{icon}
						{this.props.beforeMessage}
						<div className="loadingOverlayInner-message">
							{this.props.message}
						</div>
					</div>
				</div>
		}
	}
}

class LoadingOverlayCarousel extends React.Component {
	constructor(props) {
		super(...arguments);
		this.state = {
			currentKey: 0,
			isLast: false,
		};

		this._timer = false;
	}

	static get defaultProps() {
		return {
			timer: defaultCarouselTimer,
			show: false,
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.show != this.props.show) {
			if (nextProps.show) {
				this.setTimer();
			} else {
				this.clearTimer();
			}
		}
	}

	componentDidMount() {
		this._isMounted = true;
		this.setTimer();
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	clearTimer() {
		clearTimeout(this._timer);
	}

	setTimer() {
		this._timer = setTimeout(() => {
			let childCount = this.props.children.length,
				nextKey = this.getNextKey();
			if (this._isMounted) {
				this.setState({
					currentKey: nextKey,
					isLast: (nextKey == (childCount - 1))
				}, () => {
					this.setTimer();
				});
			}
		}, this.props.timer);
	}

	getNextKey() {
		return this.state.isLast ? 0 : this.state.currentKey + 1;
	}

	getPrevKey() {
		return this.state.currentKey == 0 ? this.props.children.length - 1 : this.state.currentKey - 1;
	}

	render() {
		var count = 0,
			childrenWithProps = [],
			className = classNames("loadingOverlayCarousel", {show: this.props.show, hidden: !this.props.show});
		if (typeof this.props.children !== "undefined") {
			var childCount = this.props.children.length;
			childrenWithProps = React.Children.map(this.props.children, (child) => {
				let active = count == this.state.currentKey,
					display = active || (count == this.getPrevKey());
				count++;
				if (!display) {
					return [];
				} else {
					return React.cloneElement(child, {show: active});
				}
			});
		}
		return <div className={className}>
			{childrenWithProps}
		</div>;
	}
}
LoadingOverlay.Carousel = LoadingOverlayCarousel;
export default LoadingOverlay;