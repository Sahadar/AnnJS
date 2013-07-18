AnnJS.define([], function() {
	return {
		getElements : function() {
			if(arguments.length === 1) {
				return document.querySelectorAll(arguments[0]);
			} else {
				return arguments[0].querySelectorAll(arguments[1]);
			}
		}
	};
});