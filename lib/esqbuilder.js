/*!
 * elasticsearch-query-builder
 * Copyright (c) 2014 Leonard Wu <leonard.wu92@alumni.ic.ac.uk>
 * https://github.com/leonardw/elasticsearch-query-builder
 * MIT Licensed
 * 
 * Customized: https://github.com/prasad83/elasticsearch-query-builder
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
	
	function addCriteria(qobj, criteria, filterop) {
		if (typeof filterop == 'undefined') filterop = 'and';
		
		if (!qobj.filter) {
			qobj.filter = criteria;
		} else if (!qobj.filter[filterop]) {
			var arr = [];
			arr.push(qobj.filter);
			arr.push(criteria);
			qobj.filter = {}; qobj.filter[filterop] = arr;
		} else {
			qobj.filter[filterop].push(criteria);
		}
	}
	
	function stringCriteria(src, qobj, prop, filterop) {
		if (src) {
			var input = src.trim(),
				len = input.length;
			if (len > 0) {
				if (hasWildcard(src)) {
					var wildcard = {};
					wildcard[prop] = esEscape(src);
					addCriteria(qobj, {query: {wildcard: wildcard}}, filterop);
				} else {
					var term = {};
					term[prop] = unescWildcard(src);
					addCriteria(qobj, {term: term}, filterop);
				}
			}
		}
	}
	
	function wordsCriteria(words, qobj, prop, filterop) {
		if (words.length) {
			for (var i = 0, l = words.length; i < l; i++) {
				words[i]= hasWildcard(words[i])? esEscape(words[i]) : unescWildcard(words[i]);
			}
			var term = {};
			term[prop] = words;
			addCriteria(qobj, {terms: term}, filterop);
		}
	}
	
	function selectCriteria(src, qobj, prop, filterop) {
		var r = [];
		for ( var key in src) {
			if (src.hasOwnProperty(key) && src[key] === true) r.push(key);
		}
		var term = {};
		if (r.length === 1) {
			term[prop] = r[0];
			addCriteria(qobj, {term: term}, filterop);
		} else if (r.length > 1) {
			term[prop] = r.sort();
			addCriteria(qobj, {terms: term}, filterop);
		}
	}
	
	var _me = {
			stringCriteria: stringCriteria,
			selectCriteria: selectCriteria,
			wordsCriteria : wordsCriteria
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
