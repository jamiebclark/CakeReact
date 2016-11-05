window.jQuery = require('jquery');

import React 	from 'react';
import ReactDOM from 'react-dom';

var jQuery = window.jQuery,
	$ = jQuery;

//var jQuery = window.jQuery;
require("jquery-ui");

class JQueryTransition extends React.Component {
	constructor() {
		super(...arguments);

		this._defaultProps = this.constructor.defaultProps;

		this._transitionTypes = {};
		this._activeTransitions = {};
		
		this._activeTransition;
		this._activeTransitionValue;

		var params = {
			easing: this.props.animateEasing,
			duration: this.props.animateDuration
		};

		this.state = {
			displayChildren: this.props.displayChildren
		};

		var types = {
			jQueryShow: {
				onTrue: function($el) {
					if (!$el.is(':visible')) {
						$el.show(params);
					}
					return $el;
				},
				onFalse: function($el) {
					if ($el.is(':visible')) {
						$el.hide(params);
					}
					return $el;
				}
			},
			jQueryHide: {reverse: 'jQueryShow'},
			jQueryFadeIn: {
				onTrue: function($el) {
					if (!$el.is(':visible')) {
						$el.fadeIn(params);
					}
					return $el;
				},
				onFalse: function($el) {
					if ($el.is(':visible')) {
						$el.fadeOut(params);
					}
					return $el;
				}
			},
			jQueryFadeOut: {
				onTrue: function($el) {
					if ($el.is(':visible')) {
						$el.fadeOut(params);
					}
					return $el;
				},

				onFalse: function($el) {
					return types.jQueryFadeIn.onTrue($el);
				}
			},
			jQuerySlideDown: {
				onTrue: ($el) => {
					return $el.slideDown(params);
				},
				onFalse: ($el) =>  {
					return types.jQuerySlideUp.onTrue($el);
				}
			},
			jQuerySlideUp: {
				onTrue: ($el) => {
					return $el.slideUp(params);
				},
				onFalse: function($el) {
					return types.jQuerySlideDown.onTrue($el);
				}
			}
		}
		this.setTypes(types);

		if (this.props.transitionTypes) {
			this.setTypes(this.props.transitionTypes);
		}
	}

	static get defaultProps() {
		return {
			displayChildren: true,
			component: "div",
			transitionTypes: {},
			animateDuration:  400,
			animateEasing: 	"swing",
			removeChildrenOnHide: false,
			uid: "",
			onAnimateComplete: function() {},
			onShown: function() {},
			onHidden: function() {}
		};
	}

	updateTransitions() {
		if (this._el) {
			var $el = $(this._el),
				$parent = $el.parent();
			if ($parent.is(':visible')) {
				this.applyTypes($(this._el), this.props);
			}
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.transitionTypes && nextProps.transitionTypes != this.props.transitionTypes) {
			this.setTypes(nextProps.transitionTypes);
		}
	}

	componentDidMount() {
		this.updateTransitions();
	}
	componentDidUpdate() {
		this.updateTransitions();
	}

	handleAnimateStart(animationName) {
		if (!this.state.displayChildren) {
			this.setState({displayChildren: true});
		}
	}

	handleAnimateComplete(animationName) {
		this.props.onAnimateComplete(animationName);
		if (this._el) {
			if ($(this._el).is(":hidden")) {
				this.handleHidden();
			} else {
				this.handleShown();
			}
		}
	}

	handleHidden() {
		if (this.props.removeChildrenOnHide && this.state.displayChildren) {
			this.setState({displayChildren: false}, () => {
				this.props.onHidden();
			});
		} else {
			this.props.onHidden();
		}
	}

	handleShown() {
		if (this.props.removeChildrenOnHide && !this.state.displayChildren) {
			this.setState({displayChildren: true}, () => {
				this.props.onShown();
			});
		} else {
			this.props.onShown();
		}
	}

	render() {
		var {component, show, hide, transitionType, ...other} = this.props,
			children = this.state.displayChildren ? this.props.children : [];

		if (typeof component === "string") {
			// Strip out unneeded props
			for (let i in this._defaultProps) {
				delete(other[i]);
			}
			for (let i in this._transitionTypes) {
				delete(other[i]);
			}
		}

		other.ref = (c) => {this._el = ReactDOM.findDOMNode(c);};
		var el = React.createElement(component, other, children);
		return <span className="jQueryTransition-wrap">{el}</span>
	}

	setTypes(types) {
		for (let typeKey in types) {
			if (types[typeKey].reverse) {
				this.setReverseType(typeKey, types[typeKey].reverse);
			} else {
				this.setType(typeKey, types[typeKey].onTrue, types[typeKey].onFalse);
			}
		}
	}

	setType(typeKey, onTrue, onFalse) {
		this._transitionTypes[typeKey] = {
			onTrue: function($el) {
				return onTrue($el);
			},
			onFalse: function($el) {
				return onFalse($el);
			}
		};
		return this;
	}

	setReverseType(typeKey, reversedKey) {
		var reverseType = this._transitionTypes[reversedKey];
		this._transitionTypes[typeKey] = {
			onTrue: function($el) {
				return reverseType.onFalse($el);
			},
			onFalse: function($el) {
				return reverseType.onTrue($el);
			}
		};
		return this;
	}

	applyTypes($el, props) {
		for (let typeKey in this._transitionTypes) {
			if (typeof props[typeKey] !== "undefined") {
				var setTransition = props[typeKey];
				this.applyType(typeKey, $el, setTransition);
			}
		}
	}

	applyType(typeKey, $el, setTransition) {
		if (typeof setTransition === "undefined") {
			var setTransition = true;
		}
		var t = this._transitionTypes[typeKey],
			fn = setTransition ? t.onTrue : t.onFalse;

		if (this._activeTransition == typeKey && this._activeTransitionValue == setTransition) {
			return $el;
		}

		if (!this.state.displayChildren) {
			return this.setState({displayChildren: true}, () => {
				this.applyType(typeKey, $el, setTransition);
			});
		} else {
			this._activeTransition = typeKey;
			this._activeTransitionValue = setTransition;

			this._activeTransitions[typeKey] = setTransition;

			return $.when( fn($el) ).done(() => {
				this.handleAnimateComplete(this._activeTransition);
			});
		}
	}
};

export default JQueryTransition;