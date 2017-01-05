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


var wpggReplacer = function(){
	
};
wpggReplacer.packageInfo = {};

wpggReplacer.toReplace = '';

wpggReplacer.replaceWith = '';

wpggReplacer.functionWith = '';

wpggReplacer.defReplaceOptions = {
	files : ['/**/*.php', '/**/*.js', '/**/style.scss']
};

wpggReplacer.init = function( packageInfo, replaceWhat, options ) {

	this.toReplace = packageInfo.wpgg[replaceWhat].replace;
	
	this.replaceWith = packageInfo.name;
	
	this.functionWith = packageInfo.wpgg.functionPrefix;

	this.defReplaceOptions.path = './' + packageInfo.wpgg.buildDir + '/' + replaceWhat;

	this.defReplaceOptions.silent = (options.logLevel === 'info' || options.logLevel === 'verbose') ? false : true;

};

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

module.exports = wpggReplacer;
