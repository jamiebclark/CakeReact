import React 							from 'react';
import {CakeForm, SubmitButton} 		from 'react/Cake/CakeForm/components/';
import CenteredContent 					from './CenteredContent.jsx';
import BSButton 						from 'react/BS/BSButton.jsx';
import _ 								from 'lodash';
import FAIcon 							from 'react/FAIcon.jsx';
class CenteredContentForm extends React.Component {
	static get defaultProps() {
		return {
			title: 		"",

			hasSubmit: true,
			submitText: 'Submit',
			formAdd: false,

			backUrl: false,
			backText: 'Back',
			backIcon: "arrow-left",

			submitUrl: false,
			submitText: 'Next',
			submitIcon: "check",

			submittedOverlay: true,
		};
	}

	render() {
		var formProps = _.clone(this.props),
			layoutProps = {},
			defaultProps = this.constructor.defaultProps;
		for (var i in defaultProps) {
			layoutProps[i] = formProps[i];
			delete formProps[i];
		}
		var footer = [];
		if (layoutProps.hasSubmit) {
			footer = [];
			var hasBack = layoutProps.backUrl;
			if (layoutProps.hasSubmit) {
				if (hasBack) {
					footer.push(
						CenteredContentFormButton(
							layoutProps.backText, 
							layoutProps.backIcon, 
							layoutProps.backUrl,
							{
								className: "btn btn-lg btn-default pull-left"
							}
						)
					);
				}
				footer.push(CenteredContentFormButton(layoutProps.submitText, layoutProps.submitIcon));
				if (hasBack) {
					footer = <div className="text-right">{footer}</div>;
				}
			}
		}

		return <CenteredContent>
			<CakeForm {...formProps}>
				<CenteredContent.Panel
					heading={layoutProps.title}
					footer={footer}
				>
					{this.props.children}
				</CenteredContent.Panel>
			</CakeForm>
		</CenteredContent>;
	}
}

export default CenteredContentForm;

var buttonCount = 1;
function CenteredContentFormButton(text, icon, url, passedOpts) {
	var opts = {
		key: 'formbutton' + (buttonCount++),
		icon: icon
	};
	if (typeof passedOpts !== "undefined") {
		opts = _.merge(opts, passedOpts);
	}

	if (typeof url !== "undefined" && url) {
		opts.component = 'a';
		opts.href = url;
	} else {
		opts.component = 'button';
		opts.type = 'submit';
		opts.buttonType = 'primary';
		opts.size = 'lg';
	}
	return <BSButton {...opts}>{text}</BSButton>;
}