AnnJS.define([
	'app/core'
	],
	function(core) {

	var domReady = core.deferred();

	function registerEvents(bindedObject) {
		var objectNamespace = bindedObject.namespace;

		core.object.forEach(bindedObject.events, function(namespace, callback) {
			var subscribtion = core.mediator.subscribe(objectNamespace+'.'+namespace, callback, bindedObject);
			bindedObject.events[namespace] = subscribtion;
		});
	}

	var objectExtension = {
		createdObjects : {
			all : []
		},
		makeObject : function(main, extension) {
			var self = this;
			var newObject = core.object.extend({}, objectExtension);

			if(typeof extension !== 'undefined') {
				core.object.extend(newObject, extension);
			}

			self.createdObjects.all.push(newObject);

			//Events subscribing
			if(newObject.events) {
				registerEvents(newObject);
			}

			//executing construct
			if(typeof newObject.__construct === 'function') {
				newObject.__construct();
				delete newObject.__construct;
			}
			return newObject;
		},
		onDomReady : function() {
			console.log('default domReady!');
		}
	};

	return objectExtension;
});