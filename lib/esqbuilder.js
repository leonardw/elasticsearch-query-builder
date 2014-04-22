/*!
 * elasticsearch-query-builder
 * Copyright (c) 2014 Leonard Wu <leonard.wu92@alumni.ic.ac.uk>
 * https://github.com/leonardw/elasticsearch-query-builder
 * MIT Licensed
 */
(function () {
	function hasWildcard(str) {
		return str.match(/(^|[^\\])[\*\?]/);
	}
	
	function unescWildcard(str) {
		return str.replace(/\\([\?\*])/g, '$1');
	}
	
	function esEscape(str) {
		return str.replace(/([\+\-\&\|\!\(\)\{\}\[\]\^\"\~\:\/\\])/g, '\\$1');
	}
	
	function addCriteria(qobj, criteria) {
		if (!qobj.filter) {
			qobj.filter = criteria;
		} else if (!qobj.filter.and) {
			var arr = [];
			arr.push(qobj.filter);
			arr.push(criteria);
			qobj.filter = {and : arr};
		} else {
			qobj.filter.and.push(criteria);
		}
	}
	
	function stringCriteria(src, qobj, prop) {
		if (src) {
			var input = src.trim(),
				len = input.length;
			if (len > 0) {
				if (hasWildcard(src)) {
					var wildcard = {};
					wildcard[prop] = esEscape(src);
					addCriteria(qobj, {query: {wildcard: wildcard}});
				} else {
					var term = {};
					term[prop] = unescWildcard(src);
					addCriteria(qobj, {term: term});
				}
			}
		}
	}
	
	function selectCriteria(src, qobj, prop) {
		var r = [];
		for ( var key in src) {
			if (src.hasOwnProperty(key) && src[key] === true) r.push(key);
		}
		var term = {};
		if (r.length === 1) {
			term[prop] = r[0];
			addCriteria(qobj, {term: term});
		} else if (r.length > 1) {
			term[prop] = r.sort();
			addCriteria(qobj, {terms: term});
		}
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
