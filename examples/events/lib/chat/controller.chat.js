/**
 * Chat controller
 */
;(function(AnnJS) {
	var config = {
		namespace	: 'chat'
	}
	AnnJS.registerController(config, {
		elements : {
			chatBox : '#chat-box',
			miniChatBox : '.mini-chat-box'
		},
		__construct : function() {
			var that = this;

			console.info('construct.', that.namespace);
		},
		onDomReady : function() {
			var that = this;

			that.makeObject(that.elements.chatBox, AnnJS.mixin('chat.form'));
			that.makeObject(that.elements.miniChatBox, AnnJS.mixin('chat.minibox'));
		}
	});
})(AnnJS);