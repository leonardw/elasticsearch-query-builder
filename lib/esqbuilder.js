/*!
 * elasticsearch-query-builder
 * Copyright (c) 2014 Leonard Wu <leonard.wu92@alumni.ic.ac.uk>
 * https://github.com/leonardw/elasticsearch-query-builder
 * MIT Licensed
 */
(function () {
	
	function stringCriteria(src, qobj, prop) {
	}
	
	function selectCriteria(src, qobj, prop) {
	}
	
	var _me = {
			stringCriteria: stringCriteria,
			selectCriteria: selectCriteria
		};
	
	if (typeof module !== 'undefined' && module.exports) {
		// Running in Node.js
		module.exports = _me;
	} else if (window && window===this) {
		// Running in browser
		window.esqbuilder = _me;
	} else {
		// We are lost
		console.error('Unknown execution environment. Giving up.');
	}
	
})();
