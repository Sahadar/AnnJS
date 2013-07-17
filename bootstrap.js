require.config({
	baseUrl: '../..',
	paths: {
		modules : 'lib/modules',
		mixins : 'lib/mixins',

		deferred: 'lib/deps/deferred/deferred',
		jquery  : 'lib/deps/jquery/jquery',
		pubsub  : 'lib/deps/pubsub/pubsub',

		tmpl             : 'tmpl',

		'less-library'  : 'lib/deps/less/less',

		//require.js plugins
		text    : 'lib/deps/require/text',
		less    : 'lib/deps/require/less'
	},
	shim: {
		'less-library'  : {
			exports : 'less'
		}
	}
});

require(['app/ann'], function(AnnJS) {
	var config = {

	};
	AnnJS.start(config);
});