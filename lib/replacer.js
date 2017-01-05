/**
 * Starter Package Fetch Module
 * 
 * @module lib/starter-theme-fetcher
 */

'use strict';

var colors = require( 'colors' ); // for colouring output
var log = require( "../utils/logger" ); // for logging
var findReplace = require( '../utils/find-replace' ); // for find and replace of strings
var extend = require( 'util' )._extend;

/**
 * Initilaise Module
 * @returns {wpggReplacer}
 */
var wpggReplacer = function(){
};

/**
 * The Build Information
 * 
 * @type object
 */
wpggReplacer.packageInfo = {};

/**
 * The keyword to replace
 * 
 * @type String|@exp;packageInfo@arr;wpgg@pro;replace
 */
wpggReplacer.toReplace = '';

/**
 * What the keyword will be replaced with
 * 
 * @type String|@exp;packageInfo@pro;name
 */
wpggReplacer.replaceWith = '';

/**
 * Function Prefix
 * 
 * @type String|@exp;packageInfo@pro;wpgg@pro;functionPrefix
 */
wpggReplacer.functionWith = '';

/**
 * Default replacement options
 * 
 * @type type
 */
wpggReplacer.defReplaceOptions = {
	files : ['/**/*.php', '/**/*.js', '/**/style.scss']
};

/**
 * Initialise script
 * 
 * @param {object} packageInfo
 * @param {string} replaceWhat starter | component
 * @param {object} options
 * @returns {undefined}
 */
wpggReplacer.init = function( packageInfo, replaceWhat, options ) {

	this.toReplace = packageInfo.wpgg[replaceWhat].replace;
	
	this.replaceWith = packageInfo.name;
	
	this.functionWith = packageInfo.wpgg.functionPrefix;

	this.defReplaceOptions.path = './' + packageInfo.wpgg.buildDir + '/' + replaceWhat;

	this.defReplaceOptions.silent = (options.logLevel === 'info' || options.logLevel === 'verbose') ? false : true;

};

/**
 * Replace Keyword
 * 
 * @see https://github.com/Automattic/_s#getting-started
 * @returns {undefined}
 */
wpggReplacer.replaceName = function() {

	var regexReplace = { };
	
	
	regexReplace["'" + this.toReplace + "'"] = "'" + this.replaceWith + "'";
	regexReplace["@package " + this.toReplace] = "@package " + this.replaceWith;
	regexReplace[this.toReplace + "_"] = this.functionWith + "_";
	regexReplace[" " + this.toReplace] = " " + this.replaceWith;
	regexReplace[this.toReplace + "-"] = this.replaceWith + "-";
	regexReplace[this.toReplace + " "] = this.replaceWith + " ";


	var replaceOptions = extend( { }, this.defReplaceOptions );

	this.replace( regexReplace, replaceOptions );

};

/**
 * Format everything and call findReplace
 * 
 * @param {type} regexReplace
 * @param {type} replaceOptions
 * @returns {undefined}
 */
wpggReplacer.replace = function( regexReplace, replaceOptions ) {
	
	replaceOptions.match = [];

	Object.keys( regexReplace ).forEach( function( key ) {
		
		replaceOptions.match.push( {
				'replace': new RegExp(key, 'g'),
				'with': regexReplace[key]
				
		});
	} );
	
	findReplace( replaceOptions, function(err, file, output){
		if(err){
			throw err;
		}
		log.verbose( file.yellow + ' was replaced');
	});


};

/**
 * 
 * @returns {wpggReplacer}
 */
module.exports = wpggReplacer;