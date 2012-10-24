/**
 * Turret which waits for turret-father ('turret') onDomReady execution
 */
;(function(AnnJS) {
	var config = {
		namespace : 'fast-white-turret',
		refs : {
			turret : 'turret.onDomReady'
		},
		extend : ['white-turret']
	};

	AnnJS.registerMixin(config, {
		data : {
			fire : 2
		},
		shot : function() {
			var that = this;

			console.info('shot.', that.namespace);
		},
		blink : function() {
			var that = this;
		}
	});
})(AnnJS);