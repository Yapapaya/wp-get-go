/**
 * Main wpGG Module
 * 
 * @module lib/wpgg
 */

'use strict';

var fs = require( 'fs' ); // for file system operations
var exec = require( 'child_process' ); // for running git commands
var log = require( "./logger" ); // for logging

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
	this.options.validate = validate || this.options.validate;
	this.options.autofix = autofix || this.options.autofix;
	this.options.css = css || this.options.css;
	this.options.push = push || this.options.push;
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
var buildInfoParser = require( './buildInfo-parser' );

// initialise module to fetch starter package
var starterThemeFetcher = require( './lib/starterTheme-fetcher' );


// initialise module to fetch starter package
// wpGG.components = require( './lib/component-fetcher' );

// wpGG.replacer = require( './lib/replace-theme' );

// wpGG.mapBuilder = require( './lib/build-style-map' );

/**
 * Read contents of a json file into a json object
 * 
 * @param {type} path
 * @returns {JSON.parse.j|Array|Object}
 */
wpGG.readJSON = function( path ) {
	if ( !fs.existsSync( path ) ) {
		throw new Error( 'File ' + path + ' not found' );
	}
	var obj = JSON.parse( fs.readFileSync( path, 'utf8' ) );

	return obj;

};

/**
 * Initialise wpGG configuration
 */
wpGG.initConfig = function() {

	log.debug( 'Parsing build information...' )

	this.packageInfo = this.readJSON( './package.json' );

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
 * Exports wpGG module
 * 
 * @returns {wpGG}
 */
module.exports = wpGG;