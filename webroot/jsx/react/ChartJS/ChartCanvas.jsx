import React 			from "react";
import AjaxFetch 		from "react/lib/AjaxFetch.jsx";
import Chart 			from "chart.js";
import LoadingOverlay 	from "react/LoadingOverlay.jsx";
import PropCompare 		from "react/lib/PropCompare.jsx";

var _colors = [
'517931', '0703DF', '2C8CF8', '609158', 'E49A5F', '9B1145', '24C38A', '2A6B76', '3D6DFB', '5E0F86', 'E21045', '56A2A2', 'CCC284', '9B1F91', 'BFFBE8', '2DB3DF', '926340', '61D345', '7D19CB', 'A8AA48', '366F93', 'F3657A', '6DC310', '88DA2A', '5D2F76', 
'8BCFB6', '2A99F1', '36FF90', '029DCB', '728920', '0BCCA7', '3C1D51', 'E97D91', 'E93770', '2E2B85', 'B8074A', 'E7705D', '237910', 'BFAE72', 'FA0258', '710785', '17D982', '6A6D47', 'EF79EE', 'BD9BFE', '47F5E8', 'B00999', 'B042D8', 'AB8146', '0F49B4', 
'80B75A', '00B195', 'A55E83', '72EF43', '643ADF', 'F5FAD4', '5E51FF', '6A4C9D', 'F0FE03', '268616', '50B4B9', '818E27', 'D9225B', 'F5CE4C', '263AD4', '025C61', '6F2ED4', '6BD8D3', '4C90BD', 'DD4181', '593B5A', 'CCAEA7', '30219F', '4ECDF7', 'BD4FED', 
'1465FC', 'FB89A2', '1D34ED', '43B01B', '7C8CC6', '9EA039', 'C354D0', '7FEB3D', '870481', 'FFE8CB', 'E6986D', '23188E', '8FD7A1', '438470', '6705FD', '0D3A6A', '89D915', '7A551F', '653FAA', '012061', 'E7F125', 'CAFA41', 'FBB51D', '58387E', '37F586', 
'66D680', 'C4BBEF', 'CEB83C', '68491C', '84379C', 'D02B6B', 'B2F6DE', '5AC030', 'D9923A', 'EBE127', 'E081CE', 'C81CFF'
],
	_colorKey = 0,
	_colorsLength = _colors.length;

class ChartCanvas extends React.Component {
	constructor() {
		super(...arguments);
		this.state = {
			chartData: this.props.chartData,
			loading: this.props.loading,
		};
		this._canvas = false;
	}

	static get defaultProps() {
		return {
			url: "",
			width: 16,
			height: 9,
			loading: false,

			chartType: "line",
			chartOptions: {},
			chartData: {},

			onConvertChartData: function(data) { return data; }
		}
	}

	componentDidUpdate(oldProps, oldState) {
		var propDiff = PropCompare.hasDifference(this.props, oldProps);
		if (propDiff) {
			if (typeof propDiff.loading !== "undefined") {
				this.setState({loading: propDiff.loading});
			}
			if (typeof propDiff.url !== "undefined") {
				this.setChartData();
			} else if (typeof propDiff.chartData !== "undefined") {
				this.setState({chartData: propDiff.chartData}, () => {
					this.setChartData();
				});
			}
		}
	}

	componentDidMount() {
		this.setChartData();
	}

	handleConvertChartData(data) {
		return this.props.onConvertChartData(data);
	}

	setChartData() {
		if (this.props.url) {
			this.setState({loading: true}, () => {
				new AjaxFetch()
					.getJSON(this.props.url)
					.then((data) => {
						this.setState({
							loading: false,
							chartData: this.handleConvertChartData(data)
						}, () => {
							this.renderChart();
						})
					});
			});
		} else {
			this.renderChart();
		}
	}

	renderChart() {
		var chartOptions = this.props.chartOptions,
			chartData = this.state.chartData;
		if (!chartData && this.props.chartData) {
			chartData = this.props.chartData;
		}
		new Chart(this._canvas, {
			type: this.props.chartType,
			data: chartData,
			options: chartOptions
		});
	}

	render() {
		return <div className="ChartJS-ChartCanvas" style={{position: "relative"}}>
			<canvas width={this.props.width} height={this.props.height} ref={(canvas) => {
				this._canvas = canvas;
			}}></canvas>
			<LoadingOverlay show={this.state.loading} />
		</div>;
	}
}

ChartCanvas.getColor = function() {
	return "#" + _colors[_colorKey];
}

ChartCanvas.getNextColor = function() {
	_colorKey++;
	if (_colorKey > _colorsLength) {
		ChartCanvas.resetColor();
	}
	return ChartCanvas.getColor();
}
ChartCanvas.getNextColors = function(totalColors) {
	var colors = [];
	for (var i = 0; i < totalColors; i++) {
		colors.push(ChartCanvas.getNextColor());
	}
	return colors;
}

ChartCanvas.resetColor = function() {
	_colorKey = 0;
	return ChartCanvas.getColor();
}

export default ChartCanvas;