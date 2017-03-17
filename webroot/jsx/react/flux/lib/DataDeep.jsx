import _ from "lodash";
import ValueValidate 			from 'react/Cake/CakeForm/lib/ValueValidate.jsx';

class DataDeep {
	constructor(data) {
		this.dataDeep = {};
		this.dataFlat = {};
		this.dataDefault = {};

		if (typeof data !== "undefined") {
			this.data = data;
		}
	}

	set data (obj) {
		this.dataDeep = obj;
		this.dataFlat = this.getFlattened(obj);
	}

	get data () {
		return this.dataDeep;
	}

	setVal(key, val, isDefault) {
		if (typeof val === "undefined") {
			var val = "";
		}
		if (typeof isDefault === "undefined") {
			var isDefault = false;
		}
		
		// Makes sure numbers stay as numbers
		//val = ValueValidate.fixNumeric(val);

		_.set(this.dataDeep, key, val);
		this.dataFlat[key] = val;
		if (isDefault) {
			this.dataDefault[key] = val;
		}
	}

	getVal(key) {
		return this.dataFlat[key];
	}

	unsetVal(key) {
		_.unset(this.dataDeep, key);
		delete(this.dataFlat[key]);
	}

	delete() {
		this.data = {};
	}

	empty(data) {
		for (var i in this.dataFlat) {
			let v = null;
			if (this.dataDefault[i]) {
				v = this.dataDefault[i];
			}
			this.setVal(i, v);
		}
	}

	getFlattened(data, prefix, vals) {
		if (typeof vals === "undefined") {
			var vals = {};
		}
		if (typeof prefix === "undefined") {
			var prefix = "";
		}
		for (var i in data) {
			var val = data[i];
			if (typeof val === "object") {
				vals = this.getFlattened(val, prefix + i + ".", vals);
			} else {
				vals[prefix + i] = val;
			}
		}
		return vals;
	}
};

export default DataDeep;