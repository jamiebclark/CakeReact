var NumberFormat = {
	addCommas: function(nStr) {
		nStr += '';
		var x = nStr.split('.'),
			x1 = x[0],
			x2 = x.length > 1 ? '.' + x[1] : '',
			rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	},

	reduceReadable: function (num, precision) {
		var pow, powVal, i,
			labels = ["T", "B", "M", "K"],
			labelsCount = labels.length;
		for (i in labels) {
			pow = (labelsCount - i) * 3
			powVal = num / Math.pow(10, pow);
			if (powVal >= 1) {
				num = Number(powVal).toFixed(precision) + labels[i];			
				break;
			}
		}
		return num;
	}
}	
export default NumberFormat;