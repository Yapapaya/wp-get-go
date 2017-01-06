'use strict';

/*
 * 
 * https://perishablepress.com/obsessive-css-code-formatting-organization-comments-and-signatures/
 * http://www.louddog.com/2008/create-maintainable-code-with-a-css-styleguide/
 * https://www.smashingmagazine.com/2008/05/improving-code-readability-with-css-styleguides/
 * http://zqsmm.qiniucdn.com/data/20060524103932/index.html
 */

/**
 * 
 * @param {type} json
 * @returns {module.exports@new;Command.getTOC.jsonToIndentedText.result|String|module.exports@new;Command.getTOC.toc}
 */
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