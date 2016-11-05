import React 	from 'react';
import moment 	from 'moment';
import FAIcon 	from "./FAIcon.jsx";

require("scss/modules/react/_week_picker.scss");

class WeekPicker extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			showForm: false
		};

		this.handleWeekChange = this.handleWeekChange.bind(this);
		this.handleHeadingChange = this.handleHeadingChange.bind(this);
	}

	static get defaultProps() {
		return {
			date: moment().format('YYYY-MM-DD'),
			onWeekClick: function(weekStart) {}
		};
	}
	handleWeekChange(weekStart) {
		this.props.onWeekClick(weekStart);
	}
	handleHeadingChange(showForm) {
		this.setState({showForm: showForm});
	}
	getDateProps(date) {
		var m = moment(date, "YYYY-MM-DD"),
			month = m.format("M"),
			year = m.format("YYYY");
		if (m.endOf("week").format("M") != month) {
			month++;
			if (month > 12) {
				year++;
				month = 1;
			}
		}
		return {month: month, year: year};
	}
	getWeekLinks(date) {
		var m = moment(date, "YYYY-MM-DD"),
			monthStart = moment(m).startOf("month"),
			mStart = moment(monthStart).startOf("week");
		if (m.format("M") == mStart.format("M") && mStart.format("M") != moment(m).endOf("week").format("M")) {
			monthStart.add(1, "month");
			mStart = moment(monthStart).startOf("week");
		}
		var weekLinks = [],
			activeKey = moment(m).startOf("week").format("YYYY-MM-DD"),
			mEnd = moment(monthStart).endOf("month").endOf("week"),
			month = monthStart.format("M"),
			currentKey = null,
			weekIndex = 0,
			dayIndex = 0,
			mCurrent = moment(mStart);

		while (mCurrent <= mEnd && dayIndex < 40) {
			currentKey = mCurrent.format("YYYY-MM-DD");
			weekLinks.push((<WeekPickerLink
				onWeekClick={this.handleWeekChange}
				key={++weekIndex} 
				startDate={currentKey}
				currentMonth={month}
				active={currentKey == activeKey}
			/>));
			mCurrent.add(7, "days");
			dayIndex += 7;
		}
		return weekLinks;
	}
	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.date != this.props.date || nextState != this.state;
	}
	render() {
		var weekLinks = this.getWeekLinks(this.props.date),
			dateProps = this.getDateProps(this.props.date),
			m = moment(this.props.date),
			heading = React.createElement(
				(this.state.showForm ? WeekPickerHeaderForm : WeekPickerHeaderControl), {
					onWeekChange: this.handleWeekChange,
					onHeadingChange: this.handleHeadingChange,
					month: dateProps.month,
					year: dateProps.year,
					date: this.props.date
				}
			);

		return (<div className="weekPicker panel panel-default">
			<div className="weekPicker-heading panel-heading">
				<div className="panel-title">{heading}</div>
			</div>
			<div className="weekPicker-body">
				{weekLinks}
			</div>
		</div>);
	}
}

export default WeekPicker;

class WeekPickerHeaderForm extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			month: this.props.month,
			year: this.props.year
		};

		this.handleMonthChange = this.handleMonthChange.bind(this);
		this.handleYearChange = this.handleYearChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
	}

	static get defaultProps() {
		return {
			onWeekChange: function(dateString) {},
			onHeadingChange: function(showForm) {}
		};
	}
	handleMonthChange(e) {
		this.setState({month: e.target.value});
	}
	handleYearChange(e) {
		this.setState({year: e.target.value});
	}
	handleSubmit(e) {
		e.preventDefault();
		var dateString = this.state.year + "-" + this.state.month + "-01";
		this.props.onWeekChange(dateString);
		this.props.onHeadingChange(false);
	}
	handleCancel(e) {
		e.preventDefault();
		this.props.onHeadingChange(false);
	}
	hideForm() {
		this.props.onHeadingChange(false);
	}
	showForm() {
		this.props.onHeadingChange(true);
	}
	render() {
		var monthOptions = [],
			yearOptions = [];
		for (var i = 1; i <= 12; i++) {
			monthOptions.push((<option key={i} value={i}>{moment(i,"M").format("MMM")}</option>));
		}
		for (var i = 2017; i >= 1991; i--) {
			yearOptions.push((<option key={i} value={i}>{i}</option>));
		}
		return (<div className="panel-title text-center">
			<form className="form form-inline" onSubmit={this.handleSubmit}>
				<select className="form-control" onChange={this.handleMonthChange} name="m" value={this.state.month}>
					{monthOptions}
				</select>
				<select className="form-control" onChange={this.handleYearChange} name="y" value={this.state.year}>
					{yearOptions}
				</select>
				<button className="btn btn-primary" type="submit">
					<FAIcon type="check" />
				</button>
				<button 
					type="button"
					className="btn btn-default"
					onClick={this.hideForm}
				>
					<FAIcon type="times" />
				</button>
			</form>
		</div>);
	}
}

class WeekPickerHeaderControl extends React.Component {
	constructor() {
		super(...arguments);
		this.handleWeekChange = this.handleWeekChange.bind(this);
		this.handleHeadingChange = this.handleHeadingChange.bind(this);
	}

	static get defaultProps() {
		return {
			date: moment().format("YYYY-MM-DD"),
			month: false,
			year: false
		};
	}
	handleWeekChange(weekStart) {
		this.props.onWeekChange(weekStart);
	}
	handleHeadingChange(e) {
		e.preventDefault();
		var showForm = true;
		this.props.onHeadingChange(showForm);
	}
	render() {
		var dateString = this.props.date;
		return (<div className="text-center">
			<div className="pull-left">
				<WeekPickerHeaderControlLink
					date={moment(dateString).subtract(1,"month").format("YYYY-MM-DD")}
					onClick={this.handleWeekChange}
				>
					<FAIcon type="angle-double-left" />
				</WeekPickerHeaderControlLink>
				<WeekPickerHeaderControlLink
					date={moment(dateString).subtract(1,"week").format("YYYY-MM-DD")}
					onClick={this.handleWeekChange}
				>
					<FAIcon type="angle-left" />
				</WeekPickerHeaderControlLink>
			</div>
			<div className="pull-right">
				<WeekPickerHeaderControlLink
					date={moment(dateString).add(1,"week").format("YYYY-MM-DD")}
					onClick={this.handleWeekChange}
				>
					<FAIcon type="angle-right" />
				</WeekPickerHeaderControlLink>
				<WeekPickerHeaderControlLink
					date={moment(dateString).add(1,"month").format("YYYY-MM-DD")}
					onClick={this.handleWeekChange}
				>
					<FAIcon type="angle-double-right" />
				</WeekPickerHeaderControlLink>
			</div>
			<a 
				href="#"
				onClick={this.handleHeadingChange}
			>
				{moment(dateString).format("MMM YYYY")}
			</a>
		</div>);
	}
}

class WeekPickerLink extends React.Component {
	constructor() {
		super(...arguments);
		this.handleWeekClick = this.handleWeekClick.bind(this);
	}
	static get defaultProps() {
		return {
			startDate: false,
			currentMonth: false,
			active: false,
			onWeekClick: function(weekStart) {}
		}
	}
	handleWeekClick(e) {
		e.preventDefault();
		this.props.onWeekClick(this.props.startDate);
	}
	render() {
		var m = moment(this.props.startDate),
			week = [],
			c = "weekPickerLink";
		if (this.props.active) {
			c += " active";
		}
		for (var i = 0; i <= 6; i++) {
			var disp = " ";
			if (m.format("M") == this.props.currentMonth) {
				disp = m.format("D");
			}
			week.push((<span key={i}>{disp}</span>));
			m.add(1,'days');
		}
		return (<a 
			className={c}
			href="#" 
			onClick={this.handleWeekClick}
		>
			{week}
		</a>);
	}
}

class WeekPickerHeaderControlLink extends React.Component {
	constructor() {
		super(...arguments);
		this.handleClick = this.handleClick.bind(this);
	}
	static get defaultProps() {
		return {
			date: false,
			onClick: function(date) {}
		};
	}
	handleClick(e) {
		e.preventDefault();
		this.props.onClick(this.props.date);
	}
	render() {
		return (<a 
			className="btn btn-default" 
			href="#" 
			onClick={this.handleClick}
			title={"Jump to: " + moment(this.props.date).format("YYYY-MM-DD")}
		>
			{this.props.children}
		</a>);
	}
}