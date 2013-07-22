AnnJS.define([
	'app/dom',
	'lib/deps/pubsub/pubsub',
	'deferred'
	],
	function(DOM, mediator, deferred) {

	var core = {

		DOM : DOM,
		mediator : mediator.newInstance({
			separator : '.'
		}),
		deferred : deferred,
		array : {
			forEach : function(array, callback) {
				for(var i = 0; i < array.length; i++) {
					var arrayElement = array[i];

					if(array.hasOwnProperty(arrayElement)) {
						callback(i, arrayElement);
					}
				}
			},
			isIn : function(array, element) {
				var	index = null;

				for(var i = 0; i < array.length; i++) {
					if(array.hasOwnProperty(i)) {
						if(element === array[i]) {
							return true;
						}
					}
				}
				return false;
			},
			//merge arrays removing duplicates
			merge : function() {
				var a = [];

				for(var i = 0; i < arguments.length; i++){
					var array = arguments[i];
					for(var j = 0; j < array.length; j++){
						if(a.indexOf(array[j]) === -1) {
							a.push(array[j]);
						}
					}
				}
				return a;
			}
		},
		object : {
			forEach : function(object, callback) {
				var index = null;

				for(index in object) {
					if(object.hasOwnProperty(index)) {
						callback(index, object[index]);
					}
				}
			},
			isIn : function(object, element) {
				var	index = null;

				for(index in object) {
					if(object.hasOwnProperty(index)) {
						if(element === object[index]) {
							return true;
						}
					}
				}
				return false;
			},
			extend : function(destination, source) {
				// var isSuper = destination['__isSuper'];

				for (var property in source) {
					if (source[property] && source[property].constructor &&
						source[property].constructor === Object) {

						destination[property] = destination[property] || {};
						this.extend(destination[property], source[property]);
					} else {
						if(source[property] instanceof Array) {
							destination[property] = source[property].slice();
						} else if(typeof source[property] === 'function' && typeof destination[property] === 'function') {
							console.log('function!', property);
							destination[property] = source[property];
						} else {
							destination[property] = source[property];
						}
					}
				}
				// if(!isSuper) {
				//	destination.__super = {
				//		__isSuper : true
				//	};
				//	// prevent overriding super object
				//	core.object.extend(destination.__super, source);
				// }

				if(arguments.length > 2) {
					Array.prototype.splice.call(arguments, 1, 1);
					return this.extend.apply(this, arguments);
				} else {
					return destination;
				}
			}
		}
	};

	return core;
});