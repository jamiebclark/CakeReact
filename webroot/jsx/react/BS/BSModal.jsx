import React 		from 'react';
import ReactDOM 	from 'react-dom';

import JQueryTransition from 'react/JQuery/JQueryTransition.jsx';

import FAIcon		from 'react/FAIcon.jsx';

var jQuery = require('jquery');
window.jQuery = jQuery;
global.jQuery = jQuery;
var $ = jQuery;
require('bootstrap/js/modal');

class BSModal extends React.Component {
	static get defaultProps() {
		return {
			show: false,
			onShow: function() {},
			onHide: function() {}
		}
	}

	handleShown() {
		this.props.onShow();
	}

	handleHidden() {
		this.props.onHide();
	}

	componentDidMount() {
		$(ReactDOM.findDOMNode(this))
			.on('hidden.bs.modal', () => {
				this.handleHidden();
			})
			.on('shown.bs.modal', () => {
				this.handleShown();
			});
	}

	render() {
		var transitionTypes = {
			show: {
				onTrue: function($el) {
					$el.modal('show');
				},
				onFalse: function($el) {
					$el.modal('hide');
				}
			}
		};
		return (
			<JQueryTransition 
				id={this.props.id} 
				className="modal fade" 
				tabIndex="-1" 
				role="dialog"
				style={{display: this.props.show ? 'block' : 'none'}}
				transitionTypes={transitionTypes}
				show={this.props.show}
				onShown={this.handleShown.bind(this)}
				onHidden={this.handleHidden.bind(this)}
			>
				<div className="modal-dialog">
					<div className="modal-content">
						{this.props.children}
					</div>
				</div>
			</JQueryTransition>
		);
	}
};


class Body extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			slideUp: false
		};
	}
	handleClick(e) {
		e.preventDefault();
		this.setState({slideUp: true});
	}
	render() {
		return (
			<div className="modal-body">
				{this.props.children}
			</div>
		);
	}
}

class Header extends React.Component {
	render() {
		return (
			<div className="modal-header">
				<button type="button" className="close" data-dismiss="modal" aria-label="Close"><FAIcon type="times" /></button>
				<h4 className="modal-title">{this.props.children}</h4>
			</div>
		);
	}
}

class Footer extends React.Component {
	render() {
		return (
			<div className="modal-footer">
				{this.props.children}
			</div>
		);
	}
}



//BSModal = ConnectJQueryTransitions(BSModal, jQueryTransitions);

BSModal.Header = Header;
BSModal.Body = Body;
BSModal.Footer = Footer;

export default BSModal;
