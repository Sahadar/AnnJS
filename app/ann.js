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
		console={log:function(){return!0;},error:function(){return!0;},info:function(){return!0;},
		warn:function(){return!0;},debug:function(){return!0;},time:function(){return!0;},timeEnd:function(){return!0;},
		groupCollapsed:function(){return!0;},groupEnd:function(){return!0;},group:function(){return!0;}};
	}
	var coreObject = null;

	AnnJS = {
		define : function() {
			define.apply(this, arguments);
		},
		require : function() {
			require.apply(this, arguments);
		},
		start : function(config) {
			var self = this;

			require.config(config.loader);
			AnnJS.require(['app/core'], function(core) {
				coreObject = core;
				var body = core.DOM.getElements('body');
				self.initialize(body);
			});
		},
		initialize : function(elements) {
			var self = this;
			if(elements instanceof Array || elements instanceof NodeList) {
				coreObject.array.forEach(elements, function() {
					self.initialize(this);
				});
				return;
			}
			var annJSElement = coreObject.DOM.getElements(elements, '.annjs');
			self.registerModule(annJSElement);
		},
		registerModule : function(annJSElement) {
			var namespace = AnnJS.getNamespace(annJSElement); //currently its one element
			AnnJS.require([namespace], function(obtainedObject) {
				obtainedObject.__construct();
			});
		},
		log : function() {
			console.info.apply(this, arguments);
		}
	};
	AnnJS.log('Welcome in '+location.host+', u\'re now working with AnnJS framework');
})();