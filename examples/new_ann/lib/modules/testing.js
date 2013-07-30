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

		var newObject = self.makeObject(null, {
			hello : 'world!'
		});
		console.info('construct', self.namespace);
		console.log('this: ', this);
		console.log('newObject: ', newObject);
		var newObject2 = newObject.makeObject(null, {
			hello : 'lamakota!'
		});
		console.log('newObject2: ', newObject2);
		window.test = this;
	},
	events : {
		myEvent : function(text) {
			console.log('hello world1!', text);
		}
	},
	onDomReady : function() {
		var self = this;
		console.log('domReady 111 testing!');

		// console.log('mediator', self);
		// self.core.mediator.publish('testing.myEvent', ['texT!']);
		// console.log(this.__super);
		// this.__super.onDomReady();
	},
	data : {
		name : 'lala'
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