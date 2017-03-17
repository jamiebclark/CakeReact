/**
 * Helps in validating and parsing Form values
 *
 **/

var isInOptions = function(value, options) {
	for (let i in options) {
		if (typeof options[i].value === "object") {
			if (isInOptions(value, options[i].value)) {
				return true;
			}
		} else if (options[i].key == value) {
			return true;
		}
	}
	return false;
};

var ValueValidate = {
	is: function(value, methods) {
		return this.map(value, methods, "is");
	},
	isBlank: function(value) {
		return (typeof value === "undefined" || value === null || value === "");
	},
	isNumeric: function (value) {
		return !this.isBlank(value) && !isNaN(value);
	},

	fix: function(value, methods) {
		return this.map(value, methods, "fix");
	},
	fixBlank: function(value) {
		if (this.isBlank(value)) {
			value = "";
		}
		return value;
	},
	fixNumeric: function(value) {
		if (this.isNumeric(value)) {
			value = parseFloat(value, 10);
		}	
		return value;
	},
	parseNumeric: function(value) {
		if (this.isNumeric(value)) {
			value = value.toString().replace(/[^0-9\.]/, "");
		}	
		return value;
	},
	fixOptions: function(value, options) {
		let valInOptions = options[0].key;
		if (isInOptions(value, options)) {
			valInOptions = value;
		}
		return valInOptions;
	},

	compare: function(value1, value2, methods) {
		value1 = this.fix(value1, methods);
		value2 = this.fix(value2, methods);
		return value1 === value2;
	},

	map: function (value, methods, prefix) {
		if (typeof prefix === "undefined") {
			prefix = "";
		}
		if (typeof methods === "string") {
			methods = [methods];
		}
		for (let i in methods) {
			let fn = prefix + methods[i];
			if (typeof this[fn] === "function") {
				value = this[fn](value);
			}
		}
		return value;
	}
};

export default ValueValidate;