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
var utils = require('../utils/utils');
var replacer = require('./replacer');

/**
 * Initialise module
 * 
 * @returns {wpggStarterThemeReplacer}
 */
var wpggStarterThemeReplacer = function() {
};

/**
 * Build Information
 * 
 * @type object
 */
wpggStarterThemeReplacer.packageInfo = { };

/**
 * Theme Headers
 * 
 * @type object
 */
wpggStarterThemeReplacer.themeHeaders = { };

/**
 * Build Directory
 * 
 * @type String
 */
wpggStarterThemeReplacer.buildDir = '';

/**
 * Default Replacement Options
 * 
 * @type object
 */
wpggStarterThemeReplacer.defReplaceOptions = {};

/**
 * Initialise script
 * 
 * @param {object} packageInfo
 * @param {object} options
 * @returns {undefined}
 */
wpggStarterThemeReplacer.init = function( packageInfo, options ) {

	this.packageInfo = packageInfo;

	this.options = options;
	
	// set the path for the replacement script to run
	this.defReplaceOptions.path = './' + this.packageInfo.wpgg.buildDir + '/starter';

	// logging for replacement script
	this.defReplaceOptions.silent = (this.options.logLevel === 'info' || this.options.logLevel === 'verbose') ? false : true;
	
	// set up theme headers
	this.setThemeHeaders();
	
	// initialise replacement script
	replacer.init(this.packageInfo, 'starter', this.options);
};

/**
 * Setup Theme Headers
 * 
 * @returns {undefined}
 */
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
};

/**
 * Setup Git Header
 * 
 * @returns {undefined}
 */
wpggStarterThemeReplacer.setGitHeader = function(){
	
	if(! 'gitHeader' in this.packageInfo.wpgg.starter){
		return;
	}
	
	var gitHeaderType = 'git';
	var repository = this.packageInfo.repository;
	
	if( 'gitHeaderType' in this.packageInfo.wpgg.starter){
		gitHeaderType = this.packageInfo.wpgg.starter.gitHeaderType;
	}
	
	if(gitHeaderType==='https'){
		repository = utils.httpsURL(repository);
	}
	
	// handle git repo link
	this.themeHeaders[this.packageInfo.wpgg.starter.gitHeader] = repository;
	
};

/**
 * Replace Colophon info in footer.php
 * 
 * @returns {undefined}
 */
wpggStarterThemeReplacer.replaceColophon = function() {

	var regexReplace = { };

	regexReplace[this.packageInfo.wpgg.starter.colophon.author] = this.packageInfo.author.name;

	regexReplace["http://" + this.packageInfo.wpgg.starter.colophon.url] = this.packageInfo.author.url;
	regexReplace["https://" + this.packageInfo.wpgg.starter.colophon.url] = this.packageInfo.author.url;

	var replaceOptions = extend( { }, this.defReplaceOptions );
	
	replaceOptions.files = "/**/footer.php";
	replaceOptions.match = [];

	Object.keys( regexReplace ).forEach( function( key ) {
		
		replaceOptions.match.push( {
				'replace': new RegExp(key, 'g'),
				'with': regexReplace[key]
				
		});
	} );
	
	findReplace(replaceOptions, function(err, file, output){
		if(err){
			throw err;
		}
		log.verbose('Colophon was replaced');
	});


};

/**
 * Replace Theme Headers in style.scss
 * 
 * @param {function} callback
 * @returns {undefined}
 */
wpggStarterThemeReplacer.replaceThemeHeaders = function(callback) {

	var themeHeaders = this.themeHeaders;
	var replaceOptions = extend( { }, this.defReplaceOptions );

	replaceOptions.files = "/**/style.scss";
	replaceOptions.match = [];

	Object.keys( themeHeaders ).forEach( function( themeHeader ) {
		
		// the [\s\S] is required for replacing the whole line
		var themeHeaderReg =  new RegExp( themeHeader + '[\\s\\S]*', 'g');

		replaceOptions.match.push( {
				'replace': themeHeaderReg,
				'with': themeHeader + ': ' + themeHeaders[themeHeader]
				
		});

	} );
	
	// replace
	findReplace(replaceOptions, function(err, file, output){
		if(err){
			throw err;
		}
		log.verbose('Theme headers were replaced');
		callback();
	});


};

/**
 * Replace everything in the theme files
 * 
 * @param {object} packageInfo
 * @param {object} options
 * @returns {undefined}
 */
wpggStarterThemeReplacer.replaceTheme = function( packageInfo, options ) {
	
	// initialise this script
	this.init( packageInfo, options );
	
	// just make sure the replacement keyword is fine
	if ( typeof this.packageInfo.wpgg.starter.replace === "string" ) {

		// special treatment for style.scss
		this.replaceThemeHeaders(function(){
			// special treatement for footer.php
			wpggStarterThemeReplacer.replaceColophon();
		});
		
		// replace everything else
		replacer.replaceName();

	} else {

		throw new Error( 'Error in replacement keyword' );
	}
};

/**
 * Export Module
 * 
 * @returns {wpggStarterThemeReplacer}
 */
module.exports = wpggStarterThemeReplacer;