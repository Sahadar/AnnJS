/**
 * Grid - content mixin
 */
;(function(AnnJS) {
	var config = {
		namespace : 'grid'
	};

	var rowFakedData = {
	}

	for(var i = 0; i < 200; i++) {
		rowFakedData['row'+i] = {
			'text' : 'hello'+i
		}
	}

	AnnJS.registerMixin(config, {
		data : {
			visibleRows : {},
			actualDataNumberMin : 0,
			actualDataNumberMax : 0,
			gridOveralHeight : 0,
			detachInvisibleRowsTimeout : null,
			renderRowsTimeout : null
		},
		elements : {
			grid : '.grid'
		},
		__construct : function() {
			var that = this;

			that.setContener();
			that.elements.contener.on('scroll', function() {
				if(that.data.renderRowsTimeout != null) {
					clearTimeout(that.data.renderRowsTimeout);
				}
				that.data.renderRowsTimeout = setTimeout(function() {
					that.renderVisibleRows();
					that.data.renderRowsTimeout = null;
				}, 100);
			});
			that.renderVisibleRows();
		},
		setContener : function() {
			var that = this,
				contener = $('<div class="contener"></div>'),
				grid = that.elements.grid,
				gridHeight = grid.height();

			contener.css({
				height : gridHeight,
				overflow : 'scroll',
				position : 'relative'
			});
			that.elements.grid.detach();
			that.elements.main.append(contener);
			contener.append(grid);
			that.data.gridOveralHeight = that.data.count*that.data.rowHeight;
			grid.css({
				height : that.data.gridOveralHeight
			});
			that.data.visibleRowsCount = Math.ceil(gridHeight/that.data.rowHeight);
			that.data.gridHeight = gridHeight;

			that.elements.contener = contener;
		},
		renderVisibleRows : function() {
			var that = this,
				scrollTop = that.elements.contener.scrollTop(),
				dataNumberMin = 0, //typeof integer
				dataNumberMax = 0,
				rowsInView = 0, //how many rows can be visible in grid viewport
				i = 0; //typeof integer

			//checks which data numbers will be rendered
			that.data.actualDataNumberMin = dataNumberMin = Math.floor(scrollTop/that.data.rowHeight)-that.data.visibleRowsCount;
			//if we've scrolled to bottom of grid
			if(scrollTop > that.data.gridOveralHeight-that.data.visibleRowsCount*that.data.rowHeight*2) {
				that.data.actualDataNumberMax = dataNumberMax = dataNumberMin+that.data.visibleRowsCount*2;
			} else {
				that.data.actualDataNumberMax = dataNumberMax = dataNumberMin+that.data.visibleRowsCount*3;
			}
			if(dataNumberMin < 0) {
				dataNumberMin = 0;
			}
			for(i = dataNumberMin; i < dataNumberMax; i++) {
				if(typeof that.data.visibleRows['row'+i] === 'undefined') {
					that.data.visibleRows['row'+i] = 'rendering';
					that.renderRow(i);
				}
			}
			that.detachInvisibleRows();
		},
		renderRow : function(rowNumber, callback) {
			var that = this;

			if(typeof that.createdObjects.number === 'object' && typeof that.createdObjects.number[rowNumber] === 'object') {
				that.createdObjects.number[rowNumber].appendToGrid();
				if(typeof callback === 'function') {
					callback(that.createdObjects.number[rowNumber]);
				}
			} else {
				AnnJS.tpl('row', rowFakedData['row'+rowNumber], function(template) {
					var rowObject = that.makeObject(template, AnnJS.mixin('grid.row', {
						data : {
							number : rowNumber
						}
					}));

					rowObject.appendToGrid();
					if(typeof callback === 'function') {
						callback(template);
					}
				});
			}
		},
		/**
		 * Row garbage collector
		 * Runs asynchronously when user is not making any action
		 */
		detachInvisibleRows : function() {
			var that = this;

			if(that.data.detachInvisibleRows != null) {
				clearTimeout(that.data.detachInvisibleRows);
				that.data.detachInvisibleRows = null;
			}
			that.data.detachInvisibleRows = setTimeout(function() {
				var rowObjectName = null,
					rowObject = null,
					actualDataNumberMin = that.data.actualDataNumberMin,
					actualDataNumberMax = that.data.actualDataNumberMax,
					rowNumber = null;

				for(rowObjectName in that.data.visibleRows) {
					if(typeof that.data.visibleRows[rowObjectName] === 'function') {
						continue;
					}
					rowObject = that.data.visibleRows[rowObjectName];
					rowNumber = rowObject.data.number;

					if(rowNumber < actualDataNumberMin || rowNumber > actualDataNumberMax) {
						rowObject.detach();
					}
				}
				that.rebuildObjectsTable();
				that.data.detachInvisibleRows = null;
			}, 2000);
		}
	});
})(AnnJS);