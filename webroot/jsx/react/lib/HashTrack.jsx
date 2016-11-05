var _valueSep = "/";
var _keySep = ":";

var _hash = false;	// Contains the hash object. Set to false if not yet initialized


var hashStringToObject = function(hashString) {
	var hashElements = hashString.replace(/^#\/?|\/$/g, '').split(_valueSep);
	var hashObject = {};
	for (let i in hashElements) {
		let keyVals = hashElements[i].split(_keySep);
		if (keyVals.length > 1) {
			hashObject[keyVals[0]] = keyVals[1];
		} else {
			hashObject[i] = keyVals[0];
		}
	}
	return hashObject;
}

var hashObjectToString = function(hashObject) {
	var hashString = "";
	for (let i in hashObject) {
		if (hashString != "") {
			hashString += _valueSep;
		}
		if (!isNaN(i)) {
			hashString += hashObject[i];
		} else {
			hashString += i + _keySep + hashObject[i];
		}
	}
	return hashString;
}

// Retrieves the hash values from the current location
var getLocationHash = function() {
	_hash = hashStringToObject(window.location.hash);
}

// Writes the new hash values to the current location
var setLocationHash = function() {
	return window.location.hash = hashObjectToString(_hash);

}

var HashTrack = {
	get: function(key) {
		if (_hash === false) {
			getLocationHash();
		}
		if (typeof key !== "undefined") {
			return typeof _hash[key] !== "undefined" ? _hash[key] : false;
		}
		return _hash;
	},

	set: function(newHash) {
		if (_hash === false) {
			getLocationHash();
		}
		if (typeof newHash === "string") {
			newHash = hashStringToObject(newHash);
		}
		for (let i in newHash) {
			_hash[i] = newHash[i];
		}
		return setLocationHash();
	},

	addChangeListener: function(onChange) {
		window.addEventListener("hashchange", onChange, false);
	},

	removeChangeListener: function(onChange) {
		window.removeEventListener("hashchange", onChange);
	},

	reset: function(newHash) {
		_hash = {};
		this.set(newHash);
	}
};

window.addEventListener("hashchange", function() {
	getLocationHash();
}, false);

export default HashTrack;
