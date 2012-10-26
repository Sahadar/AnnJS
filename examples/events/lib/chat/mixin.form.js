/**
 * Chat mini-box
 */
;(function(AnnJS) {
	var config = {
		namespace : 'chat.form'
	};

	AnnJS.registerMixin(config, {
		elements : {
			content : '.content',
			textarea : 'textarea',
			submit : 'input[type="submit"]'
		},
		events : {
			'msg.new' : function(msg) {
				var that = this;

				that.appendMsg(msg);
			}
		},
		__construct : function() {
			var that = this,
				submitBtn = that.elements.submit;

			submitBtn.on('click', function(event) {
				var textToSend = that.elements.textarea.val();

				that.elements.textarea.val('');
				AnnJS.publish('msg.new', [textToSend]);
			});
		},
		appendMsg : function(msg) {
			var that = this,
				msgBox = $('<div>'+msg+'</div>');

			that.elements.content.append(msgBox);
		}
	});
})(AnnJS);