AnnJS.define(['app/dom'], function(DOM) {
	return {
		DOM : DOM,
		array : {
			forEach : function(array, callback) {
				for(var i = 0; i < array.length; i++) {
					var arrayElement = array[i];

					if(array.hasOwnProperty(arrayElement)) {
						callback(i, arrayElement);
					}
				}
			}
		}
	};
});