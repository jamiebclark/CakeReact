/**
 * Mimics the functions of the CakePHP Router utility to convert arrays to URLs
 *
 **/

// Variables that will persist over multiple setting
var _persist = {
	base: ""
};

/** 
 * Renders a single URL element
 * 
 * @param string type The type of URL element
 * @param mixed value The values of the URL element
 * @return string;
 **/
var _render = function(type, value) {
	var output = "";
	switch (type) {
		case "pass":
			output = _renderArray(value, "/");
			break;
		case "named":
			output = _renderObject(value, ":", "/");
			break;
		case "query":
			output = "?" + _renderObject(value, "=", "&");
			break;
		default: 
			output = value;
			break;
	}
	return _removeLastSlash(output);
}

/**
 * Renders an array of a URL element type into one string
 *
 * @param array vals An array of URL elements
 * @param string separator A string to separate each value
 * @return string;
 **/
var _renderArray = function(vals, separator) {
	var output = "";
	for (let i in vals) {
		let v = vals[i];
		if (v === null || typeof v === "undefined") {
			v = "";
		}
		output += v + separator;
	}
	return output;
}

var _renderObject = function (vals, keySeparator, valueSeparator) {
	var output = "";
	for (var i in vals) {
		output += i + keySeparator + vals[i] + valueSeparator;
	}
	return output.slice(0,-1 * valueSeparator.length);
}

/**
 * Removes the last character from a string
 * 
 * @param string str The string to slice
 * @return string;
 **/
var _removeLastChar = function(str) {
	return str.slice(0, -1);
}

/**
 * Removes the last character of a string if it is a slash
 *
 * @param string str The string to slice
 * @return string;
 **/
var _removeLastSlash = function(str) {
	if (typeof str !== "undefined") {
		var len = str.length,
			lastChar = str.substring(len - 1);
		if (lastChar === "/") {
			return _removeLastChar(str);
		}
	}
	return str;
}

/**
 * Determines if a url variable is an object or string
 * If object, it converts it to string and returns it
 *
 * @param mixed url The url variable
 * @return string The parsed url string
 **/
var parse = function(url) {
	if (typeof url === "string") {
		return url;
	}
	var Router = new CakeRouter(url);
	return Router.getUrl();
}

class CakeRouter {
	constructor(urlParts, persist) {
		this.urlPartAttributes = [
			{
				key: 'base',
				persist: true,
			}, {
				key: 'prefix',
			}, {
				key: 'controller',
				default: "",
				notEmpty: true
			}, {
				key: 'action',
				notEmpty: true
			}, {
				key: 'pass',
				default: [],
			}, {
				key: 'named',
				default: {}
			}, {
				key: 'query',
				default: {}
			}
		];
		this.stored = {};
		if (typeof urlParts != "undefined") {
			this.set(urlParts, persist);
		}
	}
	setBase(urlBase) {
		_base = urlBase;
	}
	getPartAttributes(key) {
		for (var i in this.urlPartAttributes) {
			if (this.urlPartAttributes[i].key === key) {
				return this.urlPartAttributes[i];
			}
		}
		return false;
	}
	set(key, val, persist) {
		if (typeof key === "object") {
			var persist = val;
			for (var i in key) {
				this.set(i, key[i], persist);
			}
		} else {
			var attrs = this.getPartAttributes(key);
			var persist = typeof persist === "undefined" ? false : persist;
			if (attrs) {
				this.stored[key] = val;
				if (attrs.persist || persist) {
					_persist[key] = val;
				}
			}
		}
	}
	getUrl(urlParts) {
		if (typeof urlParts === "string") {
			return urlParts;
		}
		if (typeof urlParts === "undefined") {
			var urlParts = [];
		}
		var url = "", attr, v;
		for (var i in this.urlPartAttributes) {
			attr = this.urlPartAttributes[i];
			v = null;
			if (typeof urlParts[attr.key] !== "undefined") {
				v = urlParts[attr.key];
			} else if (typeof this.stored[attr.key] !== "undefined") {
				v = this.stored[attr.key]
			} else if (typeof _persist[attr.key] !== "undefined") {
				v = _persist[attr.key];
			}

			if (v) {
				url += _render(attr.key, v) + "/";
			}
		}
		if (url !== "") {
			url = url.slice(0,-1);
		}
		return url;
	}
}

CakeRouter.parse = parse;
export default CakeRouter;