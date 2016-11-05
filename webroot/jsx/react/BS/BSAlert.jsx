
import React 			from 'react';
import classNames 		from "classnames";
import $				from 'jquery';


window.jQuery = $;
global.jQuery = $;
var jQuery = $;

require('jquery-ui');
//require("js/src/script/alert.js");

(function($) {
	$.fn.alertDismissible = function() {
		return this.each(function() {
			var $alert = $(this).addClass('alert-dismissible'),
				$placeholder = $('<div class="alert-placeholder"></div>')
					.height($alert.outerHeight(true)),
				$button = $('<div class="alert-sidebutton"></div>')
					.hide()
					.addClass($alert.attr('class')),
				fadingOut = false,
				animateDuration = 250,
				animateEasing = null, //"easeOutQuart",
				canFade = false;

			function hide() {
				fadingOut = true;
				$alert.fadeOut(animateDuration, animateEasing);
				$button
					.stop()
					.show()
					.css({'right': (-1 * $button.outerWidth()) + 'px'})
					.animate({
						'right': 0
					}, {
						'duration': animateDuration,
						'easing': animateEasing
					});
			}

			function show() {
				fadingOut = false;
				$alert.fadeIn(animateDuration, animateEasing);
				$button
					.stop()
					.animate({
						'right': (-1 * $button.outerWidth()) + 'px'
					}, {
						'duration': animateDuration,
						'easing': animateEasing,
						'complete': function() {
							$button.hide();
						}
					});
			}

			if (!$alert.data('dismiss-init')) {
				$placeholder.insertAfter($alert);
				$button.insertAfter($alert);

				$('<a href="#" class="close"><i class="fa fa-times"></i></a>')
					.click(function(e) {
						e.preventDefault();
						hide();
					})
					.css({
						position: 'absolute',
						top: '5px',
						right: '5px'
					})
					.appendTo($alert);

				$('<a href="#"><i></i></a>')
					.appendTo($button)
					.click(function(e) {
						e.preventDefault();
						show();
					});


				$(window).load(function() {
					// Waits a set amount of time 
					setTimeout(function() {
						canFade = true;
					}, 2000);
				});

				$(window).scroll(function(e) {
					if ($(this).is(':animated')) {
						// Animated

					} else if (e.originalEvent) {
						// Manual Scroll
						if (!fadingOut && canFade) {
							hide();
						}
					} else {
						// Called Scroll

					}
				});


				$alert
					.css({
						position: "fixed",
						width: "100%",
						zIndex: 1000
					})
					.hide();
				show();

				$alert
					.on('show', show)
					.data('dismiss-init', true);

			}
		});
	};

	$(document).ready(function() {
		$('.alert-dismissible').alertDismissible();
		$('#formdata-alert').alertDismissible().each(function() {
			var $alert = $(this),
				$errors = $(':input.form-error');
			if ($errors.length) {
				var $errorList = $('<ul></ul>').appendTo($alert);
				$errors.each(function() {
					var $this = $(this),
						elementId = $this.attr('id'),
						$group = $this.closest('.form-group'),
						msg = $('.help-block.text-danger', $group).html(),
						$link = $('<a></a>', {
							'href': '#' + elementId,
						}).html(msg);
					$errorList.append($('<li></li>').append($link));
				});
			}
		})
	});

})(jQuery);


class BSAlert extends React.Component {
	static get defaultProps() {
		return {
			type: 		"info",
			title: 		"",
			message: 	"",
			errors: 	{},
			typeAlias: 	{
				error: "danger"
			},
			dismiss: false
		};
	}

	getTypeClass() {
		var type = this.props.type;
		if (typeof this.props.typeAlias[type] !== "undefined") {
			type = this.props.typeAlias[type];
		}
		return "alert-" + type;
	}

	getObjectList(data) {
		var children = [];
		for (var i in data) {
			var v = data[i],
				title = i.match(/[0-9]+/) ? "" : <strong>{i}</strong>;
			// Includes each item of an object unless it's a React Component
			if (typeof v === "object" && typeof v.key === "undefined" && typeof v.type === "undefined") {
				v = this.getObjectList(v);
			}
			children.push(<li key={i}>{title}{v}</li>);
		}
		if (children.length > 0) {
			return <ul>{children}</ul>
		} else {
			return "";
		}
	}

	componentDidMount() {
		this.updateDismissible();
	}

	componentDidUpdate(prevProps) {
		var show = this.props.message !== "" && this.props.message != prevProps.message;
		this.updateDismissible(show);
	}

	updateDismissible(show) {
		if (typeof show === "undefined") {
			var show = false;
		}
		if (this._el && this.props.dismiss) {
			$(this._el).alertDismissible();
			if (show) {
				$(this._el).trigger('show');
			}
		}

	}

	render() {
		let out = [],
			c = classNames(
				"alert", 
				this.props.dismiss ? "alert-dismissible" : false,
				this.getTypeClass(),
				this.props.className
			),
			{title, message, errors} = this.props;
		if (title) {
			title = <h2 className="alert-title">{title}</h2>;
		}
		if (message) {
			if (typeof message === "object") {
				let msg = [];
				for (let i in message) {
					msg.push(<div key={i}>{message[i]}</div>);
				}
				message = msg;
			}
			message = <div>{message}</div>;
		}
		if (errors) {
			errors = this.getObjectList(errors);
		}

		if (!message && !title && !errors) {
			return <span></span>
		} else {
			return (
				<div 
					ref={(c) => {this._el = c;}}
					className={c}
				>
					{title}
					{message}
					{errors}
					{this.props.children}
				</div>
			);
		}
	}
}

export default BSAlert;
