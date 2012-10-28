/**
 * Grid - content mixin
 */
;(function(AnnJS) {
	var config = {
		namespace : 'grid.row'
	};

	AnnJS.registerMixin(config, {
		__construct : function() {
			var that = this;

			console.info('that: ', that);
			that.elements.main.css({
				position : 'absolute',
				top : that.root.data.rowHeight*that.data.number,
				left : 0
			});
		},
		appendToGrid : function() {
			var that = this;

			that.root.elements.grid.append(that.elements.main);
		},
		detach : function() {
			var that = this;

			that.elements.main.detach();
		}
	});
})(AnnJS);