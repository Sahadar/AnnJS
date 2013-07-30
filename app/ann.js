/**
 *
 * AnnJS JavaScript Framework
 * version: 0.03
 *
 * Author: Wojciech Dłubacz (Sahadar)
 * Licensed under MIT license
 */
(function() {
var config = null;
if(typeof console === 'undefined') {
	window.console={log:function(){return!0;},error:function(){return!0;},info:function(){return!0;},
	warn:function(){return!0;},debug:function(){return!0;},time:function(){return!0;},timeEnd:function(){return!0;},
	groupCollapsed:function(){return!0;},groupEnd:function(){return!0;},group:function(){return!0;}};
}

function onStartCallback(core, startCallback) {
	var domReady = core.deferred();

	// console.log(core.deferred);
	function registerEvents(bindedObject) {
		var objectNamespace = bindedObject.namespace;
		core.object.forEach(bindedObject.events, function(namespace, callback) {
			var eventNamespace = '';

			if(namespace.charAt(0) !== '!') {
				eventNamespace = objectNamespace+'.'+namespace;
			} else {
				eventNamespace = namespace.substring(1,namespace.length);
			}

			var subscribtion = core.mediator.subscribe(eventNamespace, callback, bindedObject);
			bindedObject.events[namespace] = subscribtion;
		});
	}

	function extend(appObject, obtainedObject) {
		return core.object.extend({}, appObject, obtainedObject);
	}

	(function onDomReady(){
		var addListener = document.addEventListener || document.attachEvent,
			removeListener =  document.removeEventListener || document.detachEvent,
			eventName = document.addEventListener ? "DOMContentLoaded" : "onreadystatechange";

		if(document.readyState = 'complete') {
			domReady.resolve();
		} else {
			addListener.call(document, eventName, function(){
				removeListener( eventName, arguments.callee, false );
				domReady.resolve();
			}, false );
		}
	})();

	window.AnnJS = core.object.extend(window.AnnJS, {
		initialize : function(element) {
			var self = this;

			if(element instanceof Array) {
				core.array.forEach(element, function(index, value) {
					self.initialize(value);
				});
				return;
			} else if(element instanceof NodeList) {
				for(var i = 0; i < element.length; i++) {
					self.initialize(element[i]);
				}
				return;
			}
			var annJSElement = core.DOM.getElements(element, '.annjs');
			self.initializeModule(annJSElement);
		},
		getNamespace : function(annJSElement) {
			return annJSElement.getAttribute('data-namespace');
		},
		initializeModule : function(annJSElement) {
			var self = this;

			if(annJSElement instanceof Array) {
				core.array.forEach(annJSElement, function(index, value) {
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
			console.log('namespace:' , namespace);

			AnnJS.require(['modules/'+namespace, 'app/object'], function(module, appObject) {
				var requires = module.___options.require || [];
				if(module.___options.extends instanceof Array) {
					requires = core.array.merge(requires, module.___options.extends);
				}
				console.log(namespace, requires);
				AnnJS.require(requires, function() {
					var dependencies = arguments;
					console.log('dependencies:', namespace, dependencies, requires);
					var moduleObject = extend(appObject, module);

					moduleObject.namespace = namespace;
					moduleObject.core = core;

					if(moduleObject.events) {
						registerEvents(moduleObject);
					}
					moduleObject.__construct();
					domReady.promise(function() {
						moduleObject.onDomReady.apply(moduleObject, []);
					});
				});
			});
		},
		defineModule : function(options, givenObject) {
			givenObject.___options = options;
			AnnJS.define.apply(this, [options.require, givenObject]);
		},
		log : function() {
			console.info.apply(this, arguments);
		}
	});
	AnnJS.log('Welcome in '+location.host+', u\'re now working with AnnJS framework');
	startCallback();
}

window.AnnJS = {
	define : function() {
		define.apply(this, arguments);
	},
	require : function() {
		require.apply(this, arguments);
	},
	start : function(startConfig, startCallback) {
		var self = this;

		config = startConfig;
		require.config(startConfig.loader);
		AnnJS.require(['app/core'], function(core) {
			var body = core.DOM.getElements('body');

			onStartCallback(core, function() {
				self.initialize(body);
			});
		});
	}
};
})();