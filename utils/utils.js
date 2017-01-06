/**
 * General utility functions
 * 
 * @module utils/utils.js
 */
var fs = require( 'fs' ); // for file system operations

var utils = function() {

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

utils.mkdir_p = function(path, mode, callback, position) {
    mode = mode || 0777;
    position = position || 0;
    var parts = require('path').normalize(path).split('/');

    if (position >= parts.length) {
        if (callback) {
            return callback();
        } else {
            return true;
        }
    }

    var directory = parts.slice(0, position + 1).join('/');
    fs.stat(directory, function(err) {
        if (err === null) {
            mkdir_p(path, mode, callback, position + 1);
        } else {
            fs.mkdir(directory, mode, function (err) {
                if (err) {
                    if (callback) {
                        return callback(err);
                    } else {
                        throw err;
                    }
                } else {
                    utils.mkdir_p(path, mode, callback, position + 1);
                }
            });
        }
    });
};

module.exports = utils;


