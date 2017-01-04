/**
 * General utility functions
 * 
 * @module utils/utils.js
 */
var fs = require( 'fs' ); // for file system operations

var utils = function(){
	
};

/**
 * Return an equivalent svn url for a given git url on GitHub
 * 
 * @param {string} gitURL git URL of repo
 * @returns {string} https url
 */
utils.httpsURL = function( gitURL ) {
	return gitURL.replace( /:/gi, "/" ).replace( /^git@/gi, "https://" ).replace( /.git$/gi, "/" );
};

/**
 * Read contents of a json file into a json object
 * 
 * @param {type} path
 * @returns {JSON.parse.j|Array|Object}
 */
utils.readJSON = function( path ) {
	if ( !fs.existsSync( path ) ) {
		throw new Error( 'File ' + path + ' not found' );
	}
	var obj = JSON.parse( fs.readFileSync( path, 'utf8' ) );

	return obj;

};

module.exports = utils;


