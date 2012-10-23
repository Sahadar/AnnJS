/**
 * Father turret
 */
;(function(AnnJS) {
	var config = {
		namespace	: 'turret'
	}
	AnnJS.registerController(config, {
		__construct : function() {
			var that = this;

			console.info('construct.', that.namespace);
		},
		onDomReady : function() {
			var that = this;

			console.info('onDomReady.', that.namespace);
			setTimeout(function() {
				that.shot();
			}, 2000);
			setTimeout(function() {
				that.mop();
			}, 5000);
		},
		shot : function() {
			var that = this;

			console.info('shot.', that.namespace);
		},
		mop : function() {
			var that = this;

			console.info('mop.', that.namespace);
		},
		bok : function() {
			var that = this;
			console.info('bok: ', that.namespace);
		}
	});
})(AnnJS);