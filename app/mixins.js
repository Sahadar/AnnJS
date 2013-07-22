AnnJS.define([
	'app/core',
	'app/object'
	],
	function(core, appObject) {

	function elementsSelector() {
		/*
		 * Elements selector execution
		 */
		if(typeof rootObject.elements === 'object') {
			for(element in rootObject.elements) {
				if(!rootObject.elements.hasOwnProperty(element)) {
					continue;
				}
				selector = rootObject.elements[element];

				if(typeof selector === 'string') {
					rootObject.elements[element] = main.find(rootObject.elements[element]);
				} else if(typeof selector === 'object' && !(selector instanceof Array) && typeof selector.main === 'string') {
					if(rootObject.elements[selector.main].length === 1) {
					(function() {
						var mainElement = rootObject.elements[selector.main];
						var properSelector = $.extend({}, selector);
						delete properSelector.main;
						rootObject.elements[element] = _AnnJS.callQueries(properSelector, mainElement, rootObject);
					})();
					}
				} else if(typeof selector === 'object' && (selector instanceof Array) && typeof selector[0] === 'string') {
					if(rootObject.elements[selector[0]].length === 1) {
					(function() {
						var mainElement = rootObject.elements[selector[0]];
						rootObject.elements[element] = _AnnJS.callQueries(selector, mainElement, rootObject);
					})();
					}
				}
			}
			/*
			 * Checking every element
			 */
			$.each(rootObject.elements, function(item) {
				if(rootObject.elements[item].length === 0) {
					console.warn('There is no element ', item, ' in ', rootObject, ' object, from ', self.namespace);
				}
			});
		}
	}

	function generateStorage() {
		if(rootObject.data) {
			for(dataName in rootObject.data) {
				if(dataName instanceof Array || typeof dataName === 'object') {
					continue;
				}
				if(!self.createdObjects[dataName]) {
					self.createdObjects[dataName] = {};
				}
				if(self.createdObjects[dataName][rootObject.data[dataName]] && !(self.createdObjects[dataName][rootObject.data[dataName]] instanceof Array)) {
					(function(givenObject) {
						self.createdObjects[dataName][rootObject.data[dataName]] = [];
						self.createdObjects[dataName][rootObject.data[dataName]].push(givenObject);
						self.createdObjects[dataName][rootObject.data[dataName]].push(rootObject);

					})(self.createdObjects[dataName][rootObject.data[dataName]]);
				} else if(self.createdObjects[dataName][rootObject.data[dataName]] && self.createdObjects[dataName][rootObject.data[dataName]].length) {
					self.createdObjects[dataName][rootObject.data[dataName]].push(rootObject);
				} else {
					self.createdObjects[dataName][rootObject.data[dataName]] = rootObject;
				}
			}
		}
	}

	var mixinExtension = core.object.extend({}, appObject);
	delete mixinExtension.onDomReady;

	return mixinExtension;
});