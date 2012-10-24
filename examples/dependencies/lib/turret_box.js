/**
 * Another turret
 */
;(function(AnnJS) {
	var config = {
		namespace  : 'turret.box',
		refs : {
			turret : 'turret.shot',
			mop : 'turret.touch'
		}
	}
	AnnJS.registerController(config, {
		elements : {
			mainBox : '#main-box'
		},
		__construct : function() {
			var that = this;

			console.info('construct.', that.namespace);
		},
		onDomReady : function() {
			var that = this,
				text = 'onDomReady executed for '+that.namespace,
				info = $('<div>'+text+'</div>');

			that.elements.mainBox.append(info);
			that.blaze();
		},
		blaze : function() {
			var that = this,
				text = 'Main box blazed by '+that.namespace,
				info = $('<div>'+text+'</div>');

			that.elements.mainBox.append(info);
		}
	});
})(AnnJS);