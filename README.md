AnnJS
=====
**An**other **n**ew-fashion JavaScript Framework

Requires
--------

- jQuery.js (http://jquery.com/)
- LazyLoad.js (https://github.com/rgrove/lazyload/)

Usage
--------

**Please check examples first**

Defining controller:
```js
;(function(AnnJS) {
	var config = {
		namespace	: 'controllername'
	}
	AnnJS.registerController(config, {
		__construct : function() {
			var that = this;

			console.info(that.namespace, '.construct()');
		},
		onDomReady : function() {
			var that = this;

			console.info(that.namespace, '.onDomReady()');
			setTimeout(function() {
				that.shot();
			}, 2000);
			setTimeout(function() {
				that.shot2();
			}, 5000);
		},
		shot : function() {
			var that = this;

			console.info(that.namespace, '.shot()');
		},
		shot2 : function() {
			var that = this;

			console.info(that.namespace, '.shot2()');
		}
	});
})(AnnJS);
```
Defining controller (which will wait for controllername.shot execution):
```js
;(function(AnnJS) {
	var config = {
		namespace  : 'controllername.2',
		//dependencies
		//waits until controllername.shot executes then gives to "that.refs.controllername" reference to 'controllername" object
		refs : {
			controllername : 'controllername.shot'
		}
	}
	AnnJS.registerController(config, {
		__construct : function() {
			var that = this;

			console.info(that.namespace, '.construct()');
		},
		onDomReady : function() {
			var that = this;

			console.info(that.namespace, '.onDomReady()');
			that.shot();
		},
		shot : function() {
			var that = this;

			console.info(that.namespace, '.shot()');
		}
	});
})(AnnJS);
```