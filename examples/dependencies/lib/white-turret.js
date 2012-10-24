/**
 * Turret which waits for turret-father ('turret') onDomReady execution
 */
;(function(AnnJS) {
	var config = {
		namespace   : 'white-turret',
		refs : {
			turret : 'turret.onDomReady'
		}
	}
	AnnJS.registerMixin(config, {
		__construct : function() {
			var that = this;

			console.info('construct', that.namespace);
		},
		shot : function() {
			var that = this;

			console.info('shot', that.namespace);
		}
	});
})(AnnJS);