/**
 *
 * AnnJS JavaScript Framework
 * version: 0.03
 *
 * Author: Wojciech Dłubacz (Sahadar)
 * Licensed under MIT license
 */
(function() {
	if(typeof console === 'undefined') {
		window.console={log:function(){return!0;},error:function(){return!0;},info:function(){return!0;},
		warn:function(){return!0;},debug:function(){return!0;},time:function(){return!0;},timeEnd:function(){return!0;},
		groupCollapsed:function(){return!0;},groupEnd:function(){return!0;},group:function(){return!0;}};
	}
	var coreObject = null;
	var config = null;

	window.AnnJS = {
		define : function() {
			define.apply(this, arguments);
		},
		require : function() {
			require.apply(this, arguments);
		},
		start : function(startConfig) {
			var self = this;

			config = startConfig;
			require.config(startConfig.loader);
			AnnJS.require(['app/core'], function(core) {
				coreObject = core;
				var body = core.DOM.getElements('body');
				self.initialize(body);
			});
		},
		initialize : function(element) {
			var self = this;

			if(element instanceof Array) {
				coreObject.array.forEach(element, function(index, value) {
					self.initialize(value);
				});
				return;
			} else if(element instanceof NodeList) {
				for(var i = 0; i < element.length; i++) {
					self.initialize(element[i]);
				}
				return;
			}
			var annJSElement = coreObject.DOM.getElements(element, '.annjs');
			self.initializeModule(annJSElement);
		},
		getNamespace : function(annJSElement) {
			return annJSElement.getAttribute('data-namespace');
		},
		initializeModule : function(annJSElement) {
			var self = this;

			if(annJSElement instanceof Array) {
				coreObject.array.forEach(annJSElement, function(index, value) {
					self.initializeModule(value);
				});
				return;
			} else if(annJSElement instanceof NodeList) {
				for(var i = 0; i < annJSElement.length; i++) {
					self.initializeModule(annJSElement[i]);
				}
				return;
			}
			var namespace = AnnJS.getNamespace(annJSElement); //currently its one element

			AnnJS.require(['modules/'+namespace], function(obtainedObject) {
				var privCore = coreObject.object.extend({}, coreObject);

				obtainedObject.namespace = namespace;
				obtainedObject.core = privCore;
				obtainedObject.__construct();
			});
		},
		defineModule : function(options, givenObject) {
			// var args = Array.prototype.slice.call(arguments);

			AnnJS.define.apply(this, [options.require, givenObject]);
		},
		log : function() {
			console.info.apply(this, arguments);
		}
	};
	AnnJS.log('Welcome in '+location.host+', u\'re now working with AnnJS framework');
})();