'use strict';

exports.getTOC = function(json) {
	
	var addIndents = function( level ) {
		var indents = '', hashes = '#';
		for ( var i = 0; i < level; i++ ) {
			indents += '\t';
			hashes += '#';
		}
		return indents + hashes + ' ';
	};

	var jsonToIndentedText = function( object, level ) {
		var result = '';

		level = level || 0;
		Object.keys( object ).forEach( function( key ) {
			var i = level;
			result += addIndents( level );
			if ( typeof object[key] === 'object' && object[key] !== null ) {
				result += key + '\n';
				result += jsonToIndentedText( object[key], level + 1 );
				return;
			}
			result += key + ': ' + object[key] + '\n';

		} );
		return result;
	};
	
	var toc = jsonToIndentedText(json);
	return toc;
};