/**
 * Helper functions to aid in comparing properties between elements
 *
 **/

 import _ from "lodash";
 import ValueValidate from "react/Cake/CakeForm/lib/ValueValidate.jsx";

 var PropCompare = {
 	difference: function(obj1, obj2) {
 		return this.differenceByPick(obj1, obj2);
 	},
 	differenceByPick: function (obj1, obj2, keys) {
		var r = {},
			hasDifference = false;
		if (typeof keys === "undefined") {
			keys = _.keys(obj1);
		}

		for (let i in keys) {
			let key = keys[i],
				match = false,
				type1 = typeof obj1[key],
				type2 = typeof obj2[key];

			if (type1 === "undefined" && type2 === "undefined") {
				match = true;
			} else if (type1 === "function" || type2 === "function") {
				match = type1.toString() === type2.toString();	// Comparing functions, we can only tell if they're both functions
			} else if (typeof obj1[key] === "object") {
				match = _.isEqual(obj1[key], obj2[key]);
			} else {
				match = obj1[key] === obj2[key];
			}

			if (!match) {
				r[key] = obj1[key];
				hasDifference = true;
			}
		}
		return hasDifference ? r : false;  
	},

	hasDifference: function(obj1, obj2) {
		if (!_.isEqual(_.keys(obj1), _.keys(obj2))) {
			return true;
		} else {
			return this.hasDifferenceByPick(obj1, obj2);
		}
	},
	hasDifferenceByPick: function (obj1, obj2, keys) {
		return this.differenceByPick(obj1, obj2, keys);
	},

	hasElementChanged: function(ReactElement, newProps, newState) {
		return this.hasDifference(ReactElement.props, newProps) || this.hasDifference(ReactElement.state, newState);
	},

	compareKeys: function(key1, key2) {
		return ValueValidate.compare(key1, key2, "Numeric");
	}
 };

export default PropCompare;