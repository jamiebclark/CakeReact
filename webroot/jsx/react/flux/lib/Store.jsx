import _ from "lodash";
/** 
 * Used to store values for Flux stores, but also easier emit changes using an emitter
 *
 **/
 
class Store {
	constructor(initialStoreValues, defaultEventEmit) {
		this.defaultEventEmit = defaultEventEmit;
		this._Emitter = {};
		this.set(initialStoreValues);
	}

/**
 * Sets the store object to emit the changes
 *
 * @param EventEmitter The event emitter
 * @return void;
 **/
	setEmitter(emitter) {
		this._Emitter = emitter;
	}

/**
 * Returns a value in the Store
 *
 * @param string varName The variable name
 * @return mixed The variable value
 **/
	get(varName) {
		return this[varName];
	}

/**
 * Sets a single or multiple values into the store
 * 
 * @param string|object The name of the variable, or an object of variables
 * @param mixed val If varName is a string, the associated value
 * @return Promise;
 **/
	set(varName, val) {
		var _this = this;
		return new Promise((resolve, reject) => {
			var props = {};
			if (typeof varName === 'object') {
				_.each(varName, (value, key) => {
					_this[key] = value;
				});
			} else {
				_this[varName] = val;
			}
			resolve();
		});
	}

/**
 * Sets a value in the store and also emits a change value
 *
 * @param string varName The name of the variable to set
 * @param mixed val The value of the variable
 * @param string eventName An optional value of the event name to emit if not the default
 * @return Promise;
 **/
	change(varName, val, eventName) {
		if (typeof eventName === "undefined") {
			var eventName = this.defaultEventEmit;
		}
		return this.set(varName, val).then(() => {
			if (typeof this._Emitter === 'object') {
				this._Emitter.emit(eventName);
			}
		});
	}
}

export default Store;