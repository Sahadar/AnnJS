AnnJS.defineModule({
	require : [],
	depends : []
},
{
	elements : {
		mainBox : '#main-box'
	},
	__construct : function() {
		var self = this;

		self.makeObject(null, {
			hello : 'world!'
		});
		console.info('construct', self.namespace);
		console.log(this);
	},
	data : {
		name : 'lala'
	},
	onDomReady : function() {
		var self = this,
			text = 'onDomReady executed for '+self.namespace,
			info = $('<div>'+text+'</div>');

		setTimeout(function() {
			self.shot();
		}, 2000);
		setTimeout(function() {
			self.touch();
		}, 5000);
		self.elements.mainBox.append(info);
	},
	shot : function() {
		var self = this,
			text = 'Main box shooted by '+self.namespace,
			info = $('<div>'+text+'</div>');

		self.elements.mainBox.append(info);
	},
	touch : function() {
		var self = this,
			text = 'Main box touched by '+self.namespace,
			info = $('<div>'+text+'</div>');

		self.elements.mainBox.append(info);
	}
});