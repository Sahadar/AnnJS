/**
 * 
 * AnnJS JavaScript Framework
 * version: 0.02
 *
 * Author: Wojciech Dłubacz (Sahadar)
 * Licensed under GPL Version 2 license
 *
 * Uses jQuery.js
 * Copyright 2012, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 * 
 * Uses LazyLoad.js (https://github.com/rgrove/lazyload/)
 * Copyright (c) 2011 Ryan Grove (ryan@wonko.com). All rights reserved
 * 
 */
var AnnConfig = AnnConfig || {};
;(function($, LazyLoad, undefined, _AnnConfig) {
	if(typeof console === 'undefined') {
		console={log:function(){return!0},error:function(){return!0},info:function(){return!0},
		warn:function(){return!0},debug:function(){return!0},time:function(){return!0},timeEnd:function(){return!0},
		groupCollapsed:function(){return!0},groupEnd:function(){return!0},group:function(){return!0}};
	}
	console.info('Welcome in '+location.host+', u\'re now working with AnnJS framework');
	$(document).ready(function() {
		console.info('DOM content has loaded, OnDOMready started executing')
	});
	AnnConfig = $.extend(true, {
		debug			: true, //allow debugger
		cssAsset		: [], 	//array of css already loaded on page
		jsAsset			: [], 	//array of js already loaded on page
		minifyDir		: '', 	//directory to minify
		minifyAllowed	: false, //true if minify is allowed on this website
		tplDir			: '/tpl.php?file=', //where is Your mustache template directory
		jsDir			: '/lib/', //where is Your js folder directory
		cssDir			: '/css/',
		tplTimeStampPrefix		: '?',
		jsTimeStampPrefix		: '?',
		cssTimeStampPrefix		: '?',
		getTemplateMethod		: 'GET',
		timeStamp				: Math.floor(Math.random()*1000000000000000),
		language				: null,
		fulldebug				: false,
		hashString				: 'data-hash'
		
		}, AnnConfig);
	_AnnConfig = $.extend(true, {}, AnnConfig);
	
	var tracingObject = {
		length : 0
	};
	/**
	 * Method which can override other function and add special functionality
	 * @param  {object} object            Object which function we want to improve
	 * @param  {string} methodName        which function to improve
	 * @param  {function} extendingFunction Function which will be executed before basic function
	 * @return {null}
	 */
	function upgradeMethod(object, methodName, extendingFunction) {
		(function(rootObject, methodName, extendingFunction) {
			var rootFunction = rootObject[methodName],
				nsObject = getExecutionObject(rootObject.namespace+'.'+methodName);

			function newFunction() {
				var result = null;
				extendingFunction.apply(this, arguments);
				result = rootFunction.apply(this, arguments);
				if(typeof nsObject.after !== 'undefined' && nsObject.after.length > 0) {
					$.each(nsObject.after, function() {
						var callbackObject = nsObject.after.shift();
						if(typeof callbackObject.method !== 'undefined') {
							(function() {
								var methodSplitted = callbackObject.method.split('.');
								var methodName = methodSplitted.pop();
								AnnJS.namespace(methodSplitted.join('.'))[methodName].apply(rootObject, callbackObject.args);
								if(typeof callbackObject.callback === 'function') {
									callbackObject.callback.apply(rootObject, result);
								}
							})();
						} else if(typeof callbackObject.execute === 'function') {
							callbackObject.execute();
						}
					});
				}
				return result;
			}
			rootObject[methodName] = newFunction;
		})(object, methodName, extendingFunction);
	}
	/**
	 * Method which checks if given value is in array
	 * @param  {string} p_val       String which we're looking for
	 * @param  {array} arrayObject Array in which we're searching
	 * @return {boolean}
	 * 		true - if found
	 * 		false - if not found
	 */
	in_array = function(p_val,arrayObject) { //works globally
		for(var i = 0, l = arrayObject.length; i < l; i++) {
			if(arrayObject[i] == p_val) {
				return true;
			}
		}
		return false;
	}
	$.fn.getData = function(remove) {
		var that = this,
			remove = (typeof remove !== 'undefined') ? remove : true;
		
		if(that.attr('z-data') !== undefined && that.attr('z-data')) {
			var data = $.parseJSON(that.attr('z-data'));
			if(remove) {
				that.removeAttr('z-data');
			}
			return data;
		} else {
			return null;
		}
	}
	
	var _eventObject = {};
	var _executionObject = {}; //storage of execution
	var _templatesStorage = {}; //storage of callback for template
	var _controllers = {}; //object which has controllers inside
	function getExecutionObject(namespace) {
		var parts = namespace.split('.'),
			nsObject = _executionObject,
			checkedParts = [],
			i = 0;

		for (i = 0; i < parts.length; i += 1) {
			checkedParts.push(parts[i]);
			if (typeof nsObject[parts[i]] === "undefined") {
				nsObject[parts[i]] = {};
				nsObject[parts[i]]['after'] = [];
				nsObject[parts[i]]['done'] = false;
				nsObject[parts[i]]['namespace'] = checkedParts.join('.');
			}
			nsObject = nsObject[parts[i]];
		}
		return nsObject;
	};
	
	/**
	 * AnnJS private object
	 * @type {object}
	 */
	var _AnnJS = {
		/**
		 * Objected mixins
		 */
		objects : {
			/**
			 * Funkcja odpowiedzialna za obsluge przestrzeni nazw w obiekcie _objects
			 * @param ns_string string w ktorym po kropce "dyktujemy" jakie kolejne obiekty chcemy tworzyc
			 * @return parent Zwraca obiekt _objects
			 */
			namespace : function(ns_string) {
				var ns_string = (typeof ns_string === 'string') ? ns_string : (console.error('ns_string must be string type'), 'randomString'),
					parts = ns_string.split('.'),
					parent = _AnnJS.objects,
					i;
				
				if (parts[0] === "objects") {
					parts = parts.slice(1);
				}
				
				for (i = 0; i < parts.length; i += 1) {
					if (typeof parent[parts[i]] === "undefined") {
						parent[parts[i]] = {};
					}
					parent = parent[parts[i]];
				}
				parent.namespace = parts.join('.');
				return parent;
			}
		},
		mixins : {},
		/**
		 * Returns mixin from given namespace
		 * @param string namespace The name of mixin which we want to obtain
		 * @param object object which 
		 * @return boolean true -> succeeded
		 *                 false -> failed
		 */
		registerMixin : function(namespace, object) {
			var namespace = (typeof namespace === 'string') ? namespace : console.error('namespace must be string type'),
				that = this,
				functionName = null;

			if(typeof that.mixins[namespace] === 'object') {
				console.warn('Mixin with namespace '+namespace+' is already registered');
				return false;
			} else {
				_AnnJS.mixins[namespace] = object;
				return true;
			}
		},
		/**
		 * Function which tells us which things (from styles or scripts), from array are already loaded on page and returns us only things which we don't have yet
		 * @param string what we decide if it is 'css' or 'js'
		 * @param string/array thingsToLoad array or string of css/js
		 * @param string loadPrefix prefix of our css or js
		 * @return string/array Styles in proper format (depends on Minify on/off) which we don't have yet
		 */
		whatToLoad : function(what, thingsToLoad, loadPrefix) {
			var prefixFolder = (AnnJS.minifyOn()) ? '/'+_AnnConfig.minifyDir+'/b='+what+'&f=' : loadPrefix,
				thingsToLoad = (thingsToLoad instanceof Array || typeof thingsToLoad === 'string') ? thingsToLoad : console.error('thingsToLoad must be array or string type'),
				sendThingsToLoad = [],
				whatArrayName = (what === 'css') ? 'styles' : (what === 'js') ? 'scripts' : null, //array name in which we will search
				timeStampPrefix = (what === 'css') ? _AnnConfig.cssTimeStampPrefix : (what === 'js') ? _AnnConfig.jsTimeStampPrefix : AnnJS.generateRandomNumber(),
				timeStamp = _AnnConfig.timeStamp;
			
			if(whatArrayName === null) {
				return (console.warn('"what" has to be "css" or "js"'), null);
			}
			if(typeof thingsToLoad === 'string' && !in_array(thingsToLoad, AnnJS[whatArrayName]["__loaded"])) {
				AnnJS[whatArrayName]["__loaded"].push(thingsToLoad);
				return prefixFolder + thingsToLoad + '.' + what + timeStampPrefix + timeStamp;
			} else if(thingsToLoad instanceof Array && thingsToLoad.length === 1 && !in_array(thingsToLoad[0], AnnJS[whatArrayName]["__loaded"])) {
				AnnJS[whatArrayName]["__loaded"].push(thingsToLoad[0]);
				return prefixFolder + thingsToLoad[0] + '.' + what + timeStampPrefix + timeStamp;
			} else if(thingsToLoad instanceof Array  && thingsToLoad.length > 1) { //from here there will be no strings
				$.each(thingsToLoad, function(index, value) {
					var fileName = value;
					if(!in_array(fileName, AnnJS[whatArrayName]["__loaded"])) {
						AnnJS[whatArrayName]["__loaded"].push(fileName);
						sendThingsToLoad.push(((!AnnJS.minifyOn()) ? prefixFolder : '') + fileName + '.' + what);
					}
				});
			}
			if(AnnJS.minifyOn() && sendThingsToLoad.length > 0) {
				sendThingsToLoad = prefixFolder + sendThingsToLoad.join(',') + timeStampPrefix + timeStamp;
				return sendThingsToLoad;
			} else if(sendThingsToLoad instanceof Array && sendThingsToLoad.length === 1) {
				sendThingsToLoad[0] += timeStampPrefix + timeStamp;
			} else if(sendThingsToLoad instanceof Array) {
				$.each(sendThingsToLoad, function(index) {
					sendThingsToLoad[index] += timeStampPrefix + timeStamp;
				});
			}
			
			if(sendThingsToLoad instanceof Array && sendThingsToLoad.length > 0) {
				return sendThingsToLoad;
			} else {
				return null;
			}
		},
		/**
		 * Metoda pobierajÄ…ca template'y
		 * @param string templateName Nazwa template'a ktÃ³rego chcemy pobrac
		 * @param function callback Nazwa metody ktÃ³rÄ… chcemy wykonÄ…c po zaÅ‚adowaniu template'a
		 * @return undefined - nic nie zwracamy, dziaÅ‚amy na callbacku, jeÅ¼eli nie podamy callbacka return false;
		 */
		getTemplate : function(templateName, callback) {
			var templateName = (typeof templateName === 'string') ? templateName : console.error('templateName must be string type'),
				callback = (typeof callback === 'function') ? callback : (function(){return false}),
				that = AnnJS.templates,
				tplRotator = null; //interval function
		
			if(typeof _templatesStorage[templateName] !== 'object' || !(_templatesStorage[templateName] instanceof Array)) {
				_templatesStorage[templateName] = [];
			}
			_templatesStorage[templateName].push(callback);
			if(typeof that[templateName] === 'undefined') {
	    		that[templateName] = 'loading';
				$.ajax({
					type : "GET",
					contentType: 'text/plain',
					cache : true,
				    url: window.location.protocol + '//' + window.location.host + AnnConfig.tplDir + templateName + "&" + _c("TPL_TIMESTAMP"),
				    success : function(data) {
				    	var template = null,
				    		result = null,
				    		i = 0,
				    		templateStorageLength = 0;
				    	
				    	if(data === '') {
				    		console.error('We\'re sorry but there is no such template with name '+templateName);
				    		return;
				    	}
				    	if(typeof Mustache === 'object') {
				    		if(data.match(/^\<\*CSS_TO_LOAD\*(.*)\*\>/i)) {
					    		result = data.match(/^\<\*CSS_TO_LOAD\*(.*)\*\>/i)[1].trim().split(',');
					    		template = data.replace(/^\<\*CSS_TO_LOAD\*(.*)\*\>\s*/i, '');
				    		} else {
					    		template = data;
				    		}
				    		if(result !== null && result.length > 0) {
				    			$A.styles.loadStyles(result, function() {
				    				var i = 0,
				    					templateStorageLength = _templatesStorage[templateName].length;
				    				that[templateName] = template;
				    				
							    	for(i = 0; i < templateStorageLength; i++) {
							    		_templatesStorage[templateName].shift()(that[templateName]);
							    	}
								}, true);
				    		} else {
					    		that[templateName] = template;
					    		templateStorageLength = _templatesStorage[templateName].length;
						    	for(i = 0; i < templateStorageLength; i++) {
						    		_templatesStorage[templateName].shift()(that[templateName]);
						    	}
				    		}
				    	} else {
				    		delete that[templateName];
				    		console.error('We\'re sorry but template engine has not occured');
				    	}
				    }
				});
			}
		},
		/**
		 * Controllers supervisor
		 * If object already exists then this existing object will be returned
		 * 		otherwise object will be attached to namespace
		 * @param ns_string string in this string dot is separator for the objects
		 * @return parent returns created object
		 */
		controller : function(ns_string) {
			var ns_string = (typeof ns_string === 'string') ? ns_string : console.error('ns_string must be string type'),
				parts = ns_string.split('.'),
				checkedParts = [],
				parent = _controllers, //setting initialization namespace
				i = 0;

			for (i = 0; i < parts.length; i += 1) {
				checkedParts.push(parts[i]);
				if(typeof parent[parts[i]] !== 'object') {
					parent[parts[i]] = {
						controller : null,
						namespace : checkedParts.join('.'),
						innerControllers : {}
					};
				}
				if(i < parts.length-1) {
					parent = parent[parts[i]].innerControllers;
				} else {
					parent = parent[parts[i]].controller;
				}
			}
			if(parent == null) {
				parent = {};
			}
			parent.namespace = ns_string;
			parent.createdObjects = [];
			parent.rebuildObjectsTable = function() {
				var that = this,
					objectArray = [];
				
				for(dataName in that.createdObjects.all) {
					//if element has to be removed
					if(typeof that.createdObjects.all[dataName] !== 'object' || (that.createdObjects.all[dataName].data && that.createdObjects.all[dataName].data.toRemove === true)) {
						if(typeof that.createdObjects.all[dataName] === 'object') {
							that.createdObjects.all[dataName].elements.main.remove();
						}
						continue;
					};
					objectArray.push(that.createdObjects.all[dataName]);
				}
				
				delete that.createdObjects;
				that.createdObjects = [];
				that.createdObjects.all = [];
				
				for(rootObjectName in objectArray) {
					rootObject = objectArray[rootObjectName];
					that.createdObjects.push(rootObject);
					that.createdObjects.all.push(rootObject);
					if(rootObject.data) {
						for(dataName in rootObject.data) {
							if(dataName instanceof Array || typeof dataName === 'object') {
								continue;
							}
							if(!that.createdObjects[dataName]) {
								that.createdObjects[dataName] = {};
							}
							if(that.createdObjects[dataName][rootObject.data[dataName]] && !(that.createdObjects[dataName][rootObject.data[dataName]] instanceof Array)) {
								(function(givenObject) {
									that.createdObjects[dataName][rootObject.data[dataName]] = [];
									that.createdObjects[dataName][rootObject.data[dataName]].push(givenObject);
									that.createdObjects[dataName][rootObject.data[dataName]].push(rootObject);
								})(that.createdObjects[dataName][rootObject.data[dataName]]);
							} else if(that.createdObjects[dataName][rootObject.data[dataName]] && that.createdObjects[dataName][rootObject.data[dataName]].length) {
								that.createdObjects[dataName][rootObject.data[dataName]].push(rootObject);
							} else {
								that.createdObjects[dataName][rootObject.data[dataName]] = rootObject;
							}
						}
					}
				}
			}
			
			parent.makeObject = function(main, extension) {
				var that = this;
				var rootObject = {};
				
				//for making clear objects without element relation
				if(typeof main === 'object' && !(main instanceof jQuery)) {
					extension = main;
				}
				//If it is already AnnJS "object"
				if(main instanceof jQuery && AnnJS.getObject(main) !== null) {
					rootObject = AnnJS.getObject(main);
				} else if(main instanceof jQuery) {
					rootObject = {
						elements : {
							main : main
						}
					}
					
					if(main.attr('data-a') !== undefined) {
						$.extend(true, extension, {
							data: main.getData()
						});
					}
				}
				
				if(typeof extension !== 'undefined') {
					$.extend(true, rootObject, extension);
				}
				
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
								rootObject.elements[element] = AnnJS.callQueries(properSelector, mainElement, rootObject);
							})();
							}
						} else if(typeof selector === 'object' && (selector instanceof Array) && typeof selector[0] === 'string') {
							if(rootObject.elements[selector[0]].length === 1) {
							(function() {
								var mainElement = rootObject.elements[selector[0]];
								rootObject.elements[element] = AnnJS.callQueries(selector, mainElement, rootObject);
							})();
							}
						}
					}
					/*
					 * Checking every element
					 */
					$.each(rootObject.elements, function(item) {
						if(rootObject.elements[item].length === 0) {
							console.warn('There is no element ', item, ' in ', rootObject, ' object, from ', that.namespace);
						}
					});
				}
				if(main instanceof jQuery) {
					var hashObject = _AnnJS.objects.namespace(that.namespace);
					$A.addToHash(hashObject, rootObject);
				}
				
				
				if(rootObject.data) {
					for(dataName in rootObject.data) {
						if(dataName instanceof Array || typeof dataName === 'object') {
							continue;
						}
						if(!that.createdObjects[dataName]) {
							that.createdObjects[dataName] = {};
						}
						if(that.createdObjects[dataName][rootObject.data[dataName]] && !(that.createdObjects[dataName][rootObject.data[dataName]] instanceof Array)) {
							(function(givenObject) {
								that.createdObjects[dataName][rootObject.data[dataName]] = [];
								that.createdObjects[dataName][rootObject.data[dataName]].push(givenObject);
								that.createdObjects[dataName][rootObject.data[dataName]].push(rootObject);

							})(that.createdObjects[dataName][rootObject.data[dataName]]);
						} else if(that.createdObjects[dataName][rootObject.data[dataName]] && that.createdObjects[dataName][rootObject.data[dataName]].length) {
							that.createdObjects[dataName][rootObject.data[dataName]].push(rootObject);
						} else {
							that.createdObjects[dataName][rootObject.data[dataName]] = rootObject;
						}
					}
				}
				
				rootObject.root = that;
				
				that.createdObjects.push(rootObject);
				
				if(!that.createdObjects.all) that.createdObjects.all = [];
				that.createdObjects.all.push(rootObject);
				
				//objects can make other objects but reference will be assigned
				rootObject.makeObject = function() {
					var madeObject = parent.makeObject.apply(parent, arguments);
					madeObject.parentObject = rootObject;
					return madeObject;
				}
				
				//executing construct
				if(typeof rootObject.__construct === 'function') {
					rootObject.__construct();
					delete rootObject.__construct;
				}
				
				//rootObject - for objects made by controller - events subscribing
				if(rootObject.events) {
					for(ns_string in rootObject.events) {
						(function() {
						var eventCallback = rootObject.events[ns_string];
						var subscribtion = AnnJS.subscribe(ns_string, eventCallback, rootObject);
						
						rootObject.events[ns_string] = subscribtion;
						})();
					}
				}
				return rootObject;
			};
			return parent;
		},
		/**
		 * Calls queries for "elements" object
		 * @param queryObject object/array list of every method and parametr which should be executed on elements
		 * @param mainElement element Element on which execution will start
		 * @param executingObject object object which executed callQueries
		 * @return element Result element (if script crashes then this element is the last found element)
		 */
		callQueries : function(queryObject, mainElement, executingObject) {
			var callParam = null,
				calledFunction = null,
				calledObject = null,
				obtainedElement = mainElement,
				property = null,
				errorWhileExecuting = false;
			
			for(calledFunction in queryObject) {
				calledObject = null;
				//If array will be given, first element won't be used
				if(typeof queryObject === 'object' && queryObject instanceof Array && typeof queryObject[calledFunction] !== 'object') {
					continue;
				//calledFunction replacement (into objects)
				} else if(typeof queryObject[calledFunction] === 'object') {
					calledObject = queryObject[calledFunction];
				}
				if(calledObject !== null) {
					for(property in calledObject) {
						if(calledObject.hasOwnProperty(property) && typeof property !== 'function') {
							break;
						}
					}
					calledFunction = property;
					callParam = calledObject[property];
				} else if(typeof calledFunction === 'string') {
					callParam = queryObject[calledFunction];
				} else {
					continue;
				}
				/*
				 * Proper action
				 */
				if(callParam === null) {
					obtainedElement = (obtainedElement[calledFunction]().length === 0) ?
										(console.warn('Your "'+calledFunction+'" function, didn\'t work on "',obtainedElement,'" element, by ', executingObject), errorWhileExecuting = true, $([]))
										: obtainedElement[calledFunction]();
					if(errorWhileExecuting === true) {
						break;
					}
				} else if(typeof callParam === 'string') {
					obtainedElement = (obtainedElement[calledFunction](callParam).length === 0) ?
										(console.warn('Your "'+calledFunction+'" function with parameter "'+callParam+'", didn\'t work on "',obtainedElement,'" element, by', executingObject), errorWhileExecuting = true, $([]))
										: obtainedElement[calledFunction](callParam);
					if(errorWhileExecuting === true) {
						break;
					}
				}
			}
			return obtainedElement;
		},
		/**
		 * Executes onDomReady for AnnJS.registerController method
		 * @param givenObject object extension
		 */
		onDomReady : function(givenObject) {
			var that = this,
				functionName = null,
				rootObject = _AnnJS.controller(givenObject.namespace),
				namespace = givenObject.namespace,
				onDomReadyRotator = null,
				reference = null,
				ns_string = null, //strings used to loop through events
				selector = null;

			$.extend(true, rootObject, givenObject);
			/*
			 * method logging engine
			 */
			if(_AnnConfig.fulldebug === true) {
				console.info('Upgrading methods for ' + namespace + ' ...');
			}
			for(functionName in rootObject) {
				if(typeof rootObject[functionName] !== 'function') {
					continue;
				}
				upgradeMethod(rootObject, functionName, (function(methodName) {
					var i = 0,
						callbacksLength = 0;
					var _executionObject = getExecutionObject(namespace+'.'+methodName);

					if(_executionObject.after.length > 0) {
						$.each(_executionObject.after, function() {
							var callbackObject = _executionObject.after.shift();
							if(typeof callbackObject.method !== 'undefined') {
								(function() {
									var methodSplitted = callbackObject.method.split('.');
									var methodName = methodSplitted.pop();
									AnnJS.namespace(methodSplitted.join('.'))[methodName].apply(rootObject, callbackObject.args);
									if(typeof callbackObject.callback === 'function') {
										callbackObject.callback.apply(rootObject, result);
									}
								})();
							} else if(typeof callbackObject.execute === 'function') {
								callbackObject.execute();
							}
						});
					}
					return function() {
						var that = this;
						
						_executionObject.done = true;
						if(_AnnConfig.fulldebug === true) {
							tracingObject[tracingObject.length] = {
								object : that,
								method : methodName,
								arguments : arguments,
								number : tracingObject.length,
								type : 'method'
							}
							tracingObject.length++;
							console.groupCollapsed(that.namespace, ', ',methodName);
							console.warn('rootFunction: ', methodName);
							console.log('object: ', that);
							console.log('arguments: ', arguments);
							console.groupEnd();
						}
					}
				})(functionName));
			}
			delete functionName;
			
			if(typeof rootObject.onDomReady === 'function' && _AnnConfig.fulldebug === true) {
				console.info('Appending domReady for ' + rootObject.namespace);
			}
			
			if(rootObject.events) {
				for(ns_string in rootObject.events) {
					(function() {
					var eventCallback = rootObject.events[ns_string];
					var subscribtion = AnnJS.subscribe(ns_string, eventCallback, rootObject);
					
					rootObject.events[ns_string] = subscribtion;
					})();
				}
			}
			
			if(typeof rootObject.__construct === 'function') {
				rootObject.__construct(); //executing constructor
				delete rootObject.__construct;
			}
			
			$(document).ready(function() {
				function onDomReady() {	
					if(typeof rootObject.onDomReady === 'function') {
						if(_AnnConfig.fulldebug === true) {
							console.info('DomReady for ' + rootObject.namespace + ' started');
						}
						rootObject.onDomReady();
						if(_AnnConfig.fulldebug === true) {
							console.info('DomReady for ' + rootObject.namespace + ' ended');
						}
					}
				}
				function executeCallQueries() {
					if(rootObject.elements) {
						for(element in rootObject.elements) {
							var selector = rootObject.elements[element];
							if(typeof selector === 'string') {
								rootObject.elements[element] = $(rootObject.elements[element]);
							} else if(typeof selector === 'object' && !(selector instanceof Array)) {
								if(rootObject.elements[selector.main].length > 0) {
								(function() {
									var mainElement = rootObject.elements[selector.main];
									var properSelector = $.extend({}, selector);
									delete properSelector.main;
									rootObject.elements[element] = _AnnJS.callQueries(properSelector, mainElement, rootObject);
								})();
								}
							} else if(typeof selector === 'object' && (selector instanceof Array)) {
								if(typeof rootObject.elements[selector[0]] !== 'undefined' && rootObject.elements[selector[0]].length > 0) {
									(function() {
										var mainElement = rootObject.elements[selector[0]];
										rootObject.elements[element] = _AnnJS.callQueries(selector, mainElement, rootObject);
									})();
								}
							}
							(rootObject.elements[element].length === 0) ? console.warn('There is no element with "'+selector+'" selector, executed by "'+namespace+'" object') : null;	
						}
					}
					onDomReady();
				}
				/**
				 * Going through all refs object
				 * @param  {refsFromObject} refsObject object of references to another object
				 * @return {array} array of object namespaces
				 */
				function getAllRefs(refsObject) {
					var refs = [],
						reference = null;

					for(referenceName in refsObject) {
						referenceObjectNamespace = refsObject[referenceName];
						if(typeof referenceObjectNamespace === 'string') {
							refs.push(referenceObjectNamespace);
						}
					}
					if(refs.length > 0) {
						return refs;
					} else {
						return null;
					}
				}
				//executes onDomReady for controller
				if(rootObject.refs) {
					AnnJS.execute({
						execute : executeCallQueries,
						relatives : getAllRefs(rootObject.refs)
					});
				} else {
					executeCallQueries();
				}
			});
			
			if(_AnnConfig.fulldebug === true) {
				console.info('End of '+namespace);
			}
		}
	};
	/**
	 * AnnJS initialization
	 * @param {string} ns_string define where event will be sent
	 * @param {array} args arguments which will be applied to callbacks
	 * @param {boolean} recurrent define if we want to execute callbacks in every part of namespace
	 * @param {number} depth depth to which event will bubble (executing from bottom to end)
	 */
	$A = AnnJS = {
		/**
		 * Executes method and then callback after given method executions
		 * @param  {object} givenObject 
		 * @return {[type]}
		 */
		execute : function(givenObject) {
			var that = this,
				relatives	= (givenObject.relatives != null) ? givenObject.relatives : null,
				args		= givenObject.args || [],
				type 		= givenObject.type || 'controller',
				method		= givenObject.method, //namespace to method
				callback	= givenObject.callback,
				execute     = givenObject.execute,
				nsObject	= null,
				controllerObject = null,
				result      = null,
				methodName  = null, //method name given to execute
				methodController = null; //controller of method given to execute

			if(typeof relatives === 'object' && relatives instanceof Array) { // if execution has relation with other method
				(function(relatives) {
					var relatives = relatives;
					var relativeObjectName = null;
					var relativeObject = null;
					/**
					 * Check if all references has done its execution
					 */
					function checkAllReferences() {
						var relativeObjectName = null;
						var relativeObject = null;

						for(relativeObjectName in relatives) {
							if(typeof relativeObjectName !== 'string') {
								continue;
							}
							relativeObjectName = relatives[relativeObjectName];
							relativeObject = getExecutionObject(relativeObjectName);
							if(relativeObject.done === false) {
								return false;
							}
						}
						if(typeof method === 'string') {
							that.execute({
								method		: method,
								args		: args,
								callback	: callback
							});
						} else if(typeof execute === 'function') {
							execute();
						}
						return true;
					}
					if(checkAllReferences() === false) {
						for(relativeObjectName in relatives) {
							if(typeof relativeObjectName !== 'string') {
								continue;
							}
							relativeObjectName = relatives[relativeObjectName];
							relativeObject = getExecutionObject(relativeObjectName);
							if(relativeObject.done === false) {
								relativeObject['after'].push({
									execute : checkAllReferences
								});
							}
						}
					}
				})(relatives);
			} else { // otherwise
				methodName = null;
				//namespace to controller of method
				methodController = (function(methodNamespace) {
					var methodNamespace = methodNamespace.split('.');
					methodName = methodNamespace.pop();
					var controllerNamespace = methodNamespace;
					return controllerNamespace.join('.');
				})(method);
				if(that.namespace(methodController) !== null) {
					controllerObject = that.namespace(methodController);
					result = that.namespace(methodController)[methodName].apply(controllerObject, args);
					if(typeof callback === 'function') {
						callback.apply(controllerObject, [result]);
					}
				} else {
					nsObject = getExecutionObject(method);
					nsObject['after'].push({
						method	 : method,
						args	 : args,
						callback : callback
					});
				}
			}
		},
		/**
		 * Publish event
		 * @param ns_string string namespace string splited by dots
		 * @param args array of arguments given to callbacks
		 * @param recurrent bool should execution be bubbled throught namespace
		 * @param depth integer how many namespaces separated by dots will be executed
		 */
		publish : function(ns_string, args, recurrent, depth) {
			var ns_string = (typeof ns_string === 'string') ? ns_string : (console.error('ns_string must be string type'), 'randomString'),
				parts = ns_string.split('.'),
				recurrent = recurrent || false, // bubbles event throught namespace if true
				nsObject, //Namespace object to which we attach event
				args = (args) ? args : [],
				i;
			
			function executeCallback(subscribtions) {
				$.each(subscribtions, function() {
					this.callback.apply(this.object, args);
				});
			}
			
			nsObject = _eventObject;
			for (i = 0; i < parts.length; i += 1) {
				if (typeof nsObject[parts[i]] === "undefined") {
					console.warn('There is no ' + ns_string + ' subscription');
					return null;
				}
				nsObject = nsObject[parts[i]];
				if(recurrent === true && typeof depth !== 'number') { //depth is not defined
					executeCallback(nsObject['_events']);
				} else if(recurrent === true && typeof depth === 'number' && i >= parts.length - depth) { //if depth is defined
					executeCallback(nsObject['_events']);
				}
			}
			
			if(recurrent === false) {
				executeCallback(nsObject['_events']);
			}
			nsObject['_publishes'].push(args);
		},
		/**
		 * Subscribe event
		 * @param ns_string string namespace string splited by dots
		 * @param callback function function executed after publishing event
		 * @param givenObject object/nothing Optional object which will be used as "this" in callback
		 * @param cachedSubscribtion boolean Optional - if true then this subscribtion will execute all previous publishes
		 */
		subscribe : function(ns_string, callback, givenObject, cachedSubscribtion) {
			var ns_string = (typeof ns_string === 'string') ? ns_string : (console.error('ns_string must be string type'), 'randomString'),
				parts = ns_string.split('.'),
				nsObject, //Namespace object to which we attach event
				givenObjectSet = (givenObject) ? true : false,
				givenObject = (givenObjectSet) ? givenObject : callback,
				eventObject = null,
				i = 0,
				k = 0,
				subscribeArguments = arguments; //executing cachedSubscribtion
			
			//Iterating through _eventObject to find proper nsObject
			nsObject = _eventObject;
			for (i = 0; i < parts.length; i += 1) {
				//if there is "_" in namespace then try getting value from nsObject.data
				if(givenObjectSet && parts[i].substring(0, 1) === '_') {
					parts[i] = givenObject.data[parts[i].substring(1, parts[i].length)]; //parts[i].substring(1, parts[i].length) = the name of object property
					arguments[0] = parts.join('.');
					return AnnJS.subscribe.apply(AnnJS, arguments);
				}
				//if there is "+" in namespace then there will be multisubscribtion
				if(givenObjectSet && parts[i].substring(0, 1) === '+') {
					return (function(namespace_element, ns_string) {
						var j = 0,
							subscribeArray = [];
						
						for(j = 0; j < namespace_element.length; j++) {
							parts[i] = namespace_element[j];
							subscribeArguments[0] = parts.join('.');
							subscribeArray.push(AnnJS.subscribe.apply(AnnJS, subscribeArguments));
						}
						subscribeArguments[0] = ns_string;
						return [ns_string, subscribeArray];
					})(givenObject.data[parts[i].substring(1, parts[i].length)], ns_string);
				}
				//if there is "+" in namespace then try getting value from nsObject.data
				if(givenObjectSet && parts[i].substring(0, 1) === '{') {
					return (function(ns_string) {
						var j = 0,
							subscribeElements = parts[i].split(','),
							subscribeArray = [];
						
						subscribeElements[0] = subscribeElements[0].substring(1, subscribeElements[0].length);
						subscribeElements[subscribeElements.length-1] = subscribeElements[subscribeElements.length-1].substring(0, subscribeElements[subscribeElements.length-1].length-1);
						
						for(j = 0; j < subscribeElements.length; j++) {
							parts[i] = subscribeElements[j];
							subscribeArguments[0] = parts.join('.');
							subscribeArray.push(AnnJS.subscribe.apply(AnnJS, subscribeArguments));
						}
						subscribeArguments[0] = ns_string;
						return [ns_string, subscribeArray];
					})(ns_string);
				}
				if (typeof nsObject[parts[i]] === "undefined") {
					nsObject[parts[i]] = {};
					nsObject[parts[i]]['_events'] = [];
					nsObject[parts[i]]['_publishes'] = [];
				}
				nsObject = nsObject[parts[i]];
				if(cachedSubscribtion === true) {
					while(k < nsObject['_publishes'].length) {
						callback.apply(givenObject, nsObject['_publishes'][k]);
						k++;
					}
				}
			}
			
			eventObject = {
				callback	: callback,
				object		: givenObject // "this" parameter in executed function
			};
			
			nsObject['_events'].push(eventObject);
			return [parts.join('.'), eventObject];
		},
		unsubscribe : function(subscribeObject) {
			var ns_string = subscribeObject[0],
				parts = ns_string.split('.'),
				eventObject = subscribeObject[1],
				nsObject;
			
			//Iterating through _eventObject to find proper nsObject
			nsObject = _eventObject;
			for (i = 0; i < parts.length; i += 1) {
				if (typeof nsObject[parts[i]] === "undefined") {
					console.error('There is no ' + ns_string + ' subscription');
					return null;
				}
				nsObject = nsObject[parts[i]];
			}
			
			nsObject && $.each(nsObject['_events'], function(functionId){
				if(this == eventObject) {
					nsObject['_events'].splice(functionId, 1);
				}
			});
		},
		/**
		 * Styles place
		 */
		styles : {
			__loaded : [],
			/**
			 * Loads styles if we dont have it already
			 */
			loadStyles : function(styles, callback, cssDir) {
				var styles = (typeof styles === 'string' || styles instanceof Array) ? styles : console.error('styles must be string or array type'),
					cssDir = (typeof cssDir !== 'undefined') ? cssDir : _AnnConfig.cssDir,
					that = this;
				
				var stylesToLoad = _AnnJS.whatToLoad('css', styles, cssDir);
				if(stylesToLoad === null) {
					if(_AnnConfig.fulldebug === true) {
						console.info('There were no css to load');
					}
					if(callback) callback();
				} else {
					LazyLoad.css(stylesToLoad, function() {
						if(callback) callback();
					});
				}
			}
		},
		/**
		 * Scripts place
		 */
		scripts : {
			__loaded : [],
			/**
			 * Loads scripts if we dont have it already
			 */
			loadScripts : function(scripts, callback, jsDir) {
				var styles = (typeof scripts === 'string' || scripts instanceof Array) ? scripts : console.error('scripts must be string or array type'),
					jsDir = (typeof jsDir !== 'undefined') ? jsDir : _AnnConfig.jsDir,
					that = this;
					
				var scriptsToLoad = _AnnJS.whatToLoad('js', scripts, jsDir);
				if(scriptsToLoad === null) {
					if(_AnnConfig.fulldebug === true) {
						console.info('There were no js to load');
					}
					if(callback) callback();
				} else {
					LazyLoad.js(scriptsToLoad, function() {
						if(callback) callback();
					});
				}
			}
		},
		/**
		 * Tutaj przechowywana jest lista template'Ã³w aktualnie zaÅ‚adowanych na stronie
		 */
		templates : {
		},
		/**
		 * Metoda wykonujÄ…ca operacjÄ™ na templacie
		 * @param string templateName Nazwa template'a ktÃ³rego chcemy pobrac
		 * @param json data Dane ktÃ³re dostarczamy do template'a
		 * @param callback function function which will be called after template preparation
		 * @param bindObject object Object which will be replaced as "this" in callback
		 */
		tpl : function(templateName, data, callback, bindObject) {
			var templateName = (typeof templateName === 'string') ? templateName : console.error('templateName must be string type'),
				data = (data instanceof Array || typeof data === 'object') ? data : console.error('data must be array/JSON type'),
				callback = (typeof callback === 'function') ? callback : console.error('callback must be function type'),
				that = this.templates,
				bindObject = bindObject || window;
			
			if(typeof that[templateName] === 'string' && that[templateName] !== 'loading' && typeof Mustache === 'object') {
				callback.call(bindObject, $(Mustache.to_html(that[templateName], data)));
			} else {
				_AnnJS.getTemplate(templateName, function(template) {
					callback.call(bindObject, $(Mustache.to_html(that[templateName], data)));
				});
			}
		},
		/**
		 * Returns mixin from given namespace
		 * @param string namespace The name of mixin which we want to obtain
		 * @return object mixin object
		 */
		mixin : function(namespace) {
			var namespace = (typeof namespace === 'string') ? namespace : console.error('namespace must be string type'),
				that = this,
				functionName = null;
			if(typeof _AnnJS.mixins[namespace] === 'object') {
				return $.extend(true, {}, _AnnJS.mixins[namespace]);
			} else {
				console.warn('There\'s no mixin with '+namespace+' namespace');
				return null;
			}
		},
		/**
		 * Controllers getter function
		 * If object already exists then this existing object will be returned
		 * 		otherwise object will be attached to namespace
		 * @param namespace string in this string dot is separator for the objects
		 * @return parent returns created object
		 */
		namespace : function(namespace) {
			var namespace = (typeof namespace === 'string') ? namespace : console.error('Namespace must be string type'),
				parts = namespace.split('.'),
				parent = _controllers, //setting initialization namespace
				i = 0;

			for (i = 0; i < parts.length; i += 1) {
				if(typeof parent[parts[i]] !== 'object') {
					return null;
				}
				if(i < parts.length-1) {
					parent = parent[parts[i]].innerControllers;
				} else {
					parent = parent[parts[i]].controller;
				}
			}
			return parent;
		},
		/**
		 * Random number generating function
		 * @return randomNumber
		 */
		generateRandomNumber : function() {
			var randomNumber = Math.floor(Math.random()*1000000000000000);
			return randomNumber;
		},
		/**
		 * Appending hash for element by which element will be unique
		 * @param placement namespace in which element will be
		 * @param element html element which will have special attribute
		 * @return randomNumber
		 */
		appendHashForElement : function(placement, element) {
			var that = this;
			var randomNumber = that.generateRandomNumber();
			var elementHash = placement + '.' + randomNumber;
			
			element.attr(_AnnConfig.hashString, elementHash);
			return randomNumber;
		},
		getHash : function(element) {
			return element.attr(_AnnConfig.hashString);
		},
		/**
		 * Gets object from element
		 * @param element/string objecthash (string) or element
		 * @return elementObject object from element
		 */
		getObject : function(element) {
			var elementHash;
			
			if(!element) {
				return null;
			}
			
			if(typeof element === 'string') {
				elementHash = element;
			} else if(typeof element === 'object') {
				if(typeof AnnJS.getHash(element) === 'string') {
					elementHash = AnnJS.getHash(element);
				} else {
					return null;
				}
			}
			var parts = elementHash.split('.'),
				parent = _AnnJS.objects,
				i;
			
			if (parts[0] === "AnnJS") {
				parts = parts.slice(1);
			}
			for (i = 0; i < parts.length; i += 1) {
				if (typeof parent[parts[i]] === "undefined") {
					return null;
				}
				parent = parent[parts[i]];
			}
			return parent;
		},
		/**
		 * Appends object to the namespace array
		 * @param hashObject namespace reference
		 * @param elementObject object which will be appended
		 * @return hashObject
		 */
		addToHash : function(hashObject, elementObject) {
			var elementObject = (elementObject instanceof Object) ? elementObject : console.error('elementObject must be object type');
			
			if(hashObject === null) {
				hashObject = this;
			}
			var elementNumber = AnnJS.appendHashForElement(hashObject.namespace, elementObject.elements.main);
			hashObject[elementNumber] = elementObject;
			return hashObject;
		},
		/**
		 * Checks if minify is on
		 * @return bool
		 */
		minifyOn : function() {
			return _AnnConfig.minifyAllowed;
		},
		/**
		 *  Main method for AnnJS controllers
		 *  @param string namespace Object namespace
		 *  @param array/string templates Templates which we need
		 *  @param array/string scripts Scripts to load
		 *  @param object extension Object extension
		 */
		registerController : function(configure, extension) {
			var that = this,
				namespace = (typeof configure.namespace === 'string') ? configure.namespace : console.error('namespace must be string type, while running '+namespace);
			if(_AnnConfig.fulldebug === true) {
				console.info('Registering controller: ' + namespace);
			}
			var	extension =  (typeof extension === 'object') ? extension : console.error('extenstion must be object type, while running '+namespace);
			//give namespace parameter to extension
			if(typeof configure.refs === 'object' && configure.refs !== null) {
				extension.refs = configure.refs;
			}
			var obtainedController = that.namespace(configure.namespace);
			if(typeof obtainedController === 'object' &&
				obtainedController != null) {
				console.error('Controller with namespace ' + namespace + ' is already registered');
				return;
			}
			extension.namespace = configure.namespace;

			_AnnJS.onDomReady(extension);
		},
		/**
		 * Main method for AnnJS mixins
		 * @param  {object} configure Mixin configuration
		 * @param  {object} extension Mixin structure, methods
		 */
		registerMixin : function(configure, extension) {
			var that = this,
				namespace = (typeof configure.namespace === 'string') ? configure.namespace : console.error('namespace must be string type, while running '+namespace);
			
			if(_AnnConfig.fulldebug === true) {
				console.info('Registering mixin: ' + namespace);
			}
			extension.namespace = configure.namespace;

			_AnnJS.registerMixin(configure.namespace, extension);
		}
	}
	$.extend(AnnJS.scripts['__loaded'], _AnnConfig.jsAsset);
	$.extend(AnnJS.styles['__loaded'], _AnnConfig.cssAsset);
})(jQuery, LazyLoad, void(0), AnnConfig);