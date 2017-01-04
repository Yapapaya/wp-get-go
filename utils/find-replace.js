/**
 * Starter Package Fetch Module
 * 
 * @module utils/find-replace
 * @todo remove the footer.php special condition & release this as a generic package
 */
var glob = require( 'glob' ); // for finding files using glob patterns
var readline = require( 'readline' ); // for reading files line by line
var fs = require( 'fs' ); // for file system operations

var findReplace = module.exports = function( options, callback ) {
	
	console.log(options);

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

		frFind( path, pattern, options, callback );

	} );

};

var frFind = function( path, pattern, options, callback ) {
	var findablePattern = path + pattern;
	glob( findablePattern, { nodir: true }, function( err, files ) {

		if ( err ) {
			throw err;
		}

		files.forEach( function( file ) {

			if ( options.silent === false ) {
				console.log( 'Found file "' + file + '" from pattern "' + pattern + '"' );
			}

//			if ( file.search( '/footer.php' ) > -1 ) {
//				options.match = options.match.concat( options.Colophon );
//			}

			frReplace( file, options, callback );

		} );

	} );
};

var frReplace = function( file, options, callback ) {

	var output = '';

	var match = options.match;
	console.log(match);
	var rl = readline.createInterface( {
		input: fs.createReadStream( file )
	} );

	rl.on( 'line', function( line ) {
		var replaced = line;
		Object.keys( match ).forEach( function( key ) {
			replaced = replaced.replace( match[key].replace, match[key].with );
		} );
		if ( options.silent === false ) {
			console.log( 'Replaced "' + file + '"' );
		}
		output += replaced + '\r\n';
	} );

	rl.on( 'close', function() {
		fs.writeFile( file, output, 'utf8', function( err ) {
			callback( err, file, output );
		} );
	} );

};
