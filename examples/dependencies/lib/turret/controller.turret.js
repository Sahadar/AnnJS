/**
 * Father turret
 */
;(function(AnnJS) {
	var config = {
		namespace	: 'turret'
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

			setTimeout(function() {
				that.shot();
			}, 2000);
			setTimeout(function() {
				that.touch();
			}, 5000);
			that.elements.mainBox.append(info);
		},
		shot : function() {
			var that = this,
				text = 'Main box shooted by '+that.namespace,
				info = $('<div>'+text+'</div>');

			that.elements.mainBox.append(info);
		},
		touch : function() {
			var that = this,
				text = 'Main box touched by '+that.namespace,
				info = $('<div>'+text+'</div>');

			that.elements.mainBox.append(info);
		}
	});
})(AnnJS);