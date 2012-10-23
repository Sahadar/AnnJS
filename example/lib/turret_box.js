/**
 * Father turret
 */
;(function(AnnJS) {
	var config = {
		namespace  : 'turret.box',
		refs : {
			turret : 'turret.shot',
			mop : 'turret.mop'
		}
	}
	AnnJS.registerController(config, {
		__construct : function() {
			var that = this;

			console.info('construct.', that.namespace);
		},
		onDomReady : function() {
			var that = this;

			console.info('onDomReady.', that.namespace);
			that.shot();
		},
		shot : function() {
			var that = this;

			console.info('shot.', that.namespace);
		}
	});
})(AnnJS);