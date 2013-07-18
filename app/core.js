AnnJS.define([
	'app/dom',
	'lib/deps/pubsub/pubsub',
	'deferred'
	],
	function(DOM, mediator, deferred) {

	console.log(deferred);
	return {
		DOM : DOM,
		mediator : mediator.newInstance(),
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
				for (var property in source) {
					if (source[property] && source[property].constructor &&
						source[property].constructor === Object) {
						destination[property] = destination[property] || {};
						arguments.callee(destination[property], source[property]);
					} else {
						destination[property] = source[property];
					}
				}
				return destination;
			}
		}
	};
});