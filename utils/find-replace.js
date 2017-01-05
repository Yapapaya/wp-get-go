/**
 * Starter Package Fetch Module
 * 
 * @module utils/find-replace
 * @todo release this as a generic package
 */

'use strict';

var glob = require( 'glob' ); // for finding files using glob patterns
var readline = require( 'readline' ); // for reading files line by line
var fs = require( 'fs' ); // for file system operations

/**
 * Main module
 * 
 * @type type
 */
var findReplace = module.exports = function( options, callback ) {

	if ( !'silent' in options ) {
		options.silent = true;
	}
	
	if ( !'path' in options ) {
		options.path = './';
	}

	var patterns;

	if ( typeof options.files === 'string' ) {
		patterns = [ options.files ];
	} else {
		patterns = options.files;
	}

	var path = options.path;

	patterns.forEach( function( pattern ) {

		find( path, pattern, options, callback );

	} );

};

/**
 * Finds the files to replace & replace keyword
 * 
 * @param {string} path The path to look in
 * @param {string} pattern The glob pattern
 * @param {object} options The module options
 * @param {function} callback Callback to be called when a file is replaced
 * @returns {undefined}
 */
var find = function( path, pattern, options, callback ) {
	
	var findablePattern = path + pattern;
	
	glob( findablePattern, { nodir: true }, function( err, files ) {

		if ( err ) {
			throw err;
		}

		files.forEach( function( file ) {

			if ( options.silent === false ) {
				console.log( 'Found file "' + file + '" from pattern "' + pattern + '"' );
			}

			replace( file, options, callback );

		} );

	} );
};

/**
 * Replace keyword in file
 * 
 * @param {string} file The path to the file that will be replaced in
 * @param {object} options The module options
 * @param {function} callback Callback to be called when a file is replaced
 * @returns {undefined}
 */
var replace = function( file, options, callback ) {

	// the result after replacement is done
	var output = '';

	var match = options.match;
	
	// first, read the file into a stream 
	var rl = readline.createInterface( {
		input: fs.createReadStream( file )
	} );

	// process line by line
	rl.on( 'line', function( line ) {
		var replaced = line;
		
		// replace all regexes in this line
		Object.keys( match ).forEach( function( key ) {
			replaced = replaced.replace( match[key].replace, match[key].with );
		} );
		
		// log it, if needed
		if ( options.silent === false ) {
			console.log( 'Replaced "' + file + '"' );
		}
		
		// add the replaced line to output
		output += replaced + '\r\n';
	} );

	// when all the lines are done
	rl.on( 'close', function() {
		
		// write the replaced output into the file
		fs.writeFile( file, output, 'utf8', function( err ) {
			// call the callback
			callback( err, file, output );
		} );
	} );

};
