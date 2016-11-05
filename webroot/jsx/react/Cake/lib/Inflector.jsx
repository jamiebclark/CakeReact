import pluralize 	from "./Inflector/pluralize";
import _ 			from 'lodash';

var Inflector = {
	pluralize: pluralize,
	singularize: function(str) {
		return pluralize(str, true);
	},
	tableize: function(str) {
		return this.chain(str, ["pluralize", "underscore"]);
	},
	modelize: function(str) {
		return this.camelCase(str);
	},
	variable: function(str) {
		return this.chain(str, ["camelCase", "firstToLower"]);
	},

	firstToUpper: function(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	},
	firstToLower: function(str) {
		return str.charAt(0).toLowerCase() + str.slice(1);
	},
	underscore: function(str) {
		return this.splitAndJoin(str, /(?=[A-Z])/, "_", function(w) {
			return this.firstToLower(w);
		}.bind(this));
	},
	camelCase: function(str) {
		return this.splitAndJoin(str,/[_\s]/, "", function(w) {
			return this.firstToUpper(w);
		}.bind(this));
	},
	chain: function (str, functions) {
		for (var i in functions) {
			var fn = functions[i];
			if (this[fn]) {
				str = this[fn](str);
			}
		}
		return str;
	},
	splitAndJoin: function(str, split, join, onEachWord) {
		var words = str.split(split);
		str = "";
		for (var i in words) {
			var w = words[i];
			if (onEachWord) {
				w = onEachWord(w);
			}
			if (str != "") {
				str += join;
			}
			str += w;
		}
		return str;
	}
};
export default Inflector;