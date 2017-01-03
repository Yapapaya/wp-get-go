/**
 * Starter Package Fetch Module
 * 
 * @module lib/starter-theme-fetcher
 * @todo fix footer.php race
 */

'use strict';

var colors = require( 'colors' ); // for colouring output
var log = require( "./utils/logger" ); // for logging
var findReplace = require( './utils/find-replace' ); // for find and replace of strings
var extend = require( 'util' )._extend;

var wpggStarterThemeReplacer = function() {
};

wpggStarterThemeReplacer.packageInfo = { };

wpggStarterThemeReplacer.themeHeaders = { };

wpggStarterThemeReplacer.buildDir = '';

wpggStarterThemeReplacer.defReplaceOptions = {
	files : ['/**/*.php', '/**/*.js', '/**/style.scss']
};

wpggStarterThemeReplacer.init = function( packageInfo, options ) {

	this.packageInfo = packageInfo;

	this.options = options;

	this.defReplaceOptions.path = './' + this.packageInfo.wpgg.buildDir + '/starter';

	this.defReplaceOptions.silent = (this.options.logLevel === 'info' || this.options.logLevel === 'verbose') ? false : true;

	this.setThemeHeaders();
};




wpggStarterThemeReplacer.setThemeHeaders = function() {

	this.themeHeaders = {
		'Theme Name': this.packageInfo.wpgg.prettyName,
		'Theme URI': this.packageInfo.homepage,
		'Author': this.packageInfo.author.name,
		'Author URI': this.packageInfo.author.url,
		'Description': this.packageInfo.description,
		'Version': this.packageInfo.version,
		'Text Domain': this.packageInfo.name
	};
	
	// handle git repo link
	this.themeHeaders[this.packageInfo.wpgg.starter.gitHeader] = this.packageInfo.repository;
};

wpggStarterThemeReplacer.replaceTheme = function( packageInfo, options ) {

	this.init( packageInfo, options );

	if ( typeof this.packageInfo.wpgg.starter.replace === "string" ) {

		// special treatment for style.scss
		this.replaceThemeHeaders();

		this.replaceName( this.packageInfo.wpgg.starter.replace );

	} else {

		throw new Error( 'Error in replacement keyword' );
	}
};

wpggStarterThemeReplacer.replaceName = function( name ) {

	var regexReplace = { };

	regexReplace["'" + name + "'"] = "'" + this.packageInfo.name + "'";
	regexReplace["@package " + name] = "@package " + this.packageInfo.name;
	regexReplace[name + "_"] = this.packageInfo.wpgg.functionPrefix + "_";
	regexReplace[" " + name] = " " + this.packageInfo.name;
	regexReplace[name + "-"] = this.packageInfo.name + "-";
	regexReplace[name + " "] = this.packageInfo.name + " ";


	var replaceOptions = extend( { }, this.defReplaceOptions );

	this.replace( regexReplace, replaceOptions );

};

wpggStarterThemeReplacer.matchColophon = function() {

	var regexReplace = { };

	regexReplace[this.packageInfo.wpgg.starter.colophon.author] = this.packageInfo.author.name;

	regexReplace["http://" + this.packageInfo.wpgg.starter.colophon.url] = this.packageInfo.author.url;
	regexReplace["https://" + this.packageInfo.wpgg.starter.colophon.url] = this.packageInfo.author.url;

	var matchArray = [];

	Object.keys( regexReplace ).forEach( function( key ) {
		
		matchArray.push( {
				'replace': new RegExp(key, 'g'),
				'with': regexReplace[key]
				
		});
	} );
	
	replaceOptions.Colophon = matchArray;


};

wpggStarterThemeReplacer.replaceThemeHeaders = function() {

	var themeHeaders = this.themeHeaders;
	var replaceOptions = extend( { }, this.defReplaceOptions );

	replaceOptions.files = "/**/style.scss";
	replaceOptions.matchArray = [];

	Object.keys( themeHeaders ).forEach( function( themeHeader ) {
		var themeHeaderReg =  new RegExp( themeHeader + '[\\s\\S]*', 'g');

		replaceOptions.matchArray.push( {
				'replace': themeHeaderReg,
				'with': themeHeader + ': ' + themeHeaders[themeHeader]
				
		});

	} );
	
	findReplace(replaceOptions, function(err, file, output){
		if(err){
			throw err;
		}
		log.verbose('Theme headers were replaced');
	});


};

wpggStarterThemeReplacer.replace = function( regexReplace, replaceOptions ) {
	
	replaceOptions.matchArray = [];

	Object.keys( regexReplace ).forEach( function( key ) {
		
		replaceOptions.matchArray.push( {
				'replace': new RegExp(key, 'g'),
				'with': regexReplace[key]
				
		});
	} );
	
	findReplace( replaceOptions);


};

module.exports = wpggStarterThemeReplacer;