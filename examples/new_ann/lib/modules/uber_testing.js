AnnJS.defineModule({
	require : [],
	extends : [
		'testing'
	]
},
{
	onDomReady : function() {
		var self = this;
		console.log('domReady uber_testing!');
	},
	test : function() {
		this.__super.test();
		console.log('test from uber_testing!');
	}
});