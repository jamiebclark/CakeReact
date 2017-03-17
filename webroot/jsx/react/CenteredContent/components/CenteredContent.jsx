import React				from 'react';

require('../../../../../Plugin/CenteredContent/webroot/css/style.css');
require('../../../../scss/views/templates/centered_content.scss');

class CenteredContent extends React.Component {
	render() {
		return <div className="centered-content">{this.props.children}</div>;
	}
}

class CenteredContentPanel extends React.Component {
	static get defaultProps() {
		return {
			heading: [],
			footer: []
		}
	}
	render() {
		var heading, footer = [];
		if (this.props.heading) {
			heading = <div className="panel-heading"><div className="panel-title">{this.props.heading}</div></div>;
		}

		if (this.props.footer) {
			footer = <div className="panel-footer">{this.props.footer}</div>;
		}

		return <div className="centered-content-panel panel panel-default">
			{heading}
			<div className="panel-body">
				{this.props.children}
			</div>
			{footer}
		</div>;
	}
}

CenteredContent.Panel = CenteredContentPanel;
export default CenteredContent;
