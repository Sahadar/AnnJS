/**
 * Chat mini-box
 */
;(function(AnnJS) {
	var config = {
		namespace : 'chat.minibox'
	};

	AnnJS.registerMixin(config, {
		elements : {
			content : '.content'
		},
		events : {
			'msg.new' : function(msg) {
				var that = this;

				that.appendMsg(msg);
			}
		},
		appendMsg : function(msg) {
			var that = this,
				msgBox = $('<div>'+msg+'</div>');

			that.elements.content.append(msgBox);
		}
	});
})(AnnJS);