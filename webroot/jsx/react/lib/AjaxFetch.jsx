import {Promise}				from "es6-promise";
import fetch 					from "node-fetch";


/**
 * Shortcut class to speed up AJAX calls
 *
 **/

class AjaxFetch {
	/**
	 * Fetches content from a url
	 *
	 * @param url The url to fetch
	 * @return Promise;
	 **/
	get(url) {
		return fetch(url, {
			method: 'get',
			headers: {
				'X-Requested-With': 'XMLHttpRequest'	// Needed to trigger CakePHP's isAjax() check
			},
			compress: false
		});
	}

	/**
	 * Fetches content from a url and returns it as JSON
	 *
	 * @param url The url to fetch
	 * @return Promise;
	 **/
	getJSON(url) {
		console.log("AJAX FETCH: " + url);
		return this.get(url).then(response => {
			return response.json();
		});
	}

	/**
	 * Saves information 
	 *
	 * @param url The url to call to save the information
	 * @param data The data to send
	 * @return Promise;
	 **/
	save(url, data) {
		data = this.param(data);
		return fetch(url, {
			compress: false,
			method: 'POST',
			body: data,
			headers: {
				"X-Requested-With": "XMLHttpRequest",
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		})
		.then((response) => {
			return response.json();
		});
	}


	/**
	 * Changes an object to a string for form data
	 *
	 * @param key Either an object of values or the current key
	 * @param val The value
	 * @param prepend A string to prepend to the key - used for recursive calls
	 * @return string;
	 **/
	 param(key, val, prepend) {
		if (typeof key === "object") {
			val = key;
			key = "";
		}
		if (typeof prepend !== "undefined" && prepend != "") {
			key = prepend + "[" + key + "]";
		}
		if (typeof val === "object") {
			let vals = "";
			for (let i in val) {
				if (vals !== "") {
					vals += "&";
				}
				vals += this.param(i, val[i], key);
			}
			return vals;
		} else {
			return encodeURIComponent(key) + '=' + encodeURIComponent(val);
		}
	}
}

export default AjaxFetch;