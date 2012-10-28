/**
 * Grid controller
 * 
 * @author Wojciech Dłubacz (Sahadar)
 * @since 27.10.2012
 */
;(function(AnnJS) {
	var config = {
		namespace	: 'grid'
	}
	AnnJS.registerController(config, {
		elements : {
			grids : '.ann-grid'
		},
		onDomReady : function() {
			var that = this;

			if(that.elements.grids.length > 0) {
				$.each(that.elements.grids, function() {
					var grid = $(this);

					that.makeGridObject(grid);
				});
			}

		},
		makeGridObject : function(gridElement) {
			var that = this;

			that.makeObject(gridElement, AnnJS.mixin('grid'));
		}
	});
})(AnnJS);