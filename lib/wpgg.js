/**
 * Main wpGG Module
 * 
 * @module lib/wpgg
 */

'use strict';

var fs = require( 'fs' ); // for file system operations
var exec = require( 'child_process' ); // for running git commands
var log = require( "../utils/logger" ); // for logging
var utils = require('../utils/utils'); // utility fns

/**
 * Initialise wpGG class
 * 
 * @returns {wpGG}
 */
var wpGG = function() {
};

/**
 * Options for wpGG
 * 
 * @type object
 */
wpGG.options = {
	"validate": true,
	"autofix": true,
	"css": true,
	"push": true,
	"logLevel": "info"
};

/**
 * The package information
 * 
 * @type @exp;wpGG@pro;readJSON@pro;obj|@exp;buildInfoParser@call;parse
 */
wpGG.packageInfo = { };

/**
 * Bootstrapping Information
 * 
 * @type wpGG.packageInfo.wpgg
 */
wpGG.bootStrapInfo = { };

/**
 * Installed Components
 * 
 * @type Array
 */
wpGG.installed = [ ];

/**
 * Initialise wpGG
 * 
 * @param {bool} validate Whether to validate Git Repositories
 * @param {bool} autofix Whether to automatically fix Package.json
 * @param {bool} css Whether to create 'style.css' at the end of build
 * @param {bool} push Whether to push the build to a remote git repo
 * @param {string} logLevel The logging level
 * @returns {wpGG}
 */
wpGG.init = function( validate, autofix, css, push, logLevel ) {
	
	// populate options
	this.options.validate = validate;
	this.options.autofix = autofix;
	this.options.css = css;
	this.options.push = push;
	this.options.logLevel = logLevel || "info";
	
	// set logging levels
	log.level = this.options.logLevel;
	return this;
};

/**
 * Parser for build information
 * 
 * @type object
 */
var buildInfoParser = require( './build-info-parser' );

// initialise module to fetch starter package
var starterThemeFetcher = require( './starter-theme-fetcher' );

var starterThemeReplacer = require( './starter-theme-replacer' );


// initialise module to fetch starter package
// wpGG.components = require( './lib/component-fetcher' );

// wpGG.replacer = require( './lib/replace-theme' );

// wpGG.mapBuilder = require( './lib/build-style-map' );

/**
 * Initialise wpGG configuration
 */
wpGG.initConfig = function() {

	log.debug( 'Parsing build information...' )

	this.packageInfo = utils.readJSON( './package.json' );

	try {
		// get package info from Package Info Parser Module
		this.packageInfo = buildInfoParser.parse( this.packageInfo, this.options );
	} catch ( e ) {
		log.error( e.message );
	}

	// move wpGG Information into a separate object for convenience
	this.bootStrapInfo = this.packageInfo.wpgg;

	log.silly( this.packageInfo );

	log.silly( this.bootStrapInfo );

	log.debug( 'ok' );
};

/**
 * Fetch everything
 * @returns {undefined}
 */
wpGG.fetch = function(){
	
	log.debug('Fetching starter repository');
	
	var packageInfo = this.packageInfo;
	var bootStrapInfo = this.bootStrapInfo;
	var options = this.options;
	
	starterThemeFetcher.fetch(bootStrapInfo, options, function(){
		starterThemeReplacer.replaceTheme(packageInfo, options);
	});
	
	log.debug('ok');
	
	
};


/**
 * Exports wpGG module
 * 
 * @returns {wpGG}
 */
module.exports = wpGG;