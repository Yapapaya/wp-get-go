/**
 * Package Information Parser
 * 
 * @module lib/package-info-parser
 */
'use strict';

var chalk = require( 'chalk' ); // for colouring output
var exec = require( 'child_process' ); // for running git commands
var log = require("winston"); // for logging


/**
 * Processes and validates the `package.json` file
 * 
 * @param {object} grunt The grunt object
 * @returns {exports.init.packageInfo} The processed package information
 */
var wpBootStrapPackageInfoParser = function() {
};

/**
 * @type object Package Information
 */
wpBootStrapPackageInfoParser.packageInfo = { };

/**
 * Initialises parser
 * @param {object} json The default json from `package.json` file
 */
wpBootStrapPackageInfoParser.init = function( json ) {

	this.packageInfo = json;

};

/**
 * Parses and validates the package information provided
 * 
 * @param {type} json
 * @returns {object}
 */
wpBootStrapPackageInfoParser.parse = function( json ) {

	this.init( json );


	// run functions to validate and process it

	log.verbose( 'Validating package name...' );

	this.validateName();

	// // grunt.verbose.or.ok();


	log.verbose( 'Validating function prefix...' );

	this.validateFunctionPrefix();

	// grunt.verbose.or.ok();


	log.verbose( 'Checking prettyName for WP ' + chalk.yellow( 'Theme/Plugin Name:' ) + ' header...' );

	this.validatePrettyName();

	// grunt.verbose.ok('Theme/Plugin Name: '+ chalk.yellow(this.packageInfo.wpBootStrap.prettyName));


	log.verbose( 'Validating starter repository...' );

	this.validateRepo( this.packageInfo.wpBootStrap.starter.repository );

	// grunt.verbose.or.ok();


	log.verbose( 'Checking component information...' );

	this.setComponentInfo();

	// grunt.verbose.or.ok();


	if ( this.packageInfo.wpBootStrap.components.names.length > 0 ) {

		log.verbose( 'Validating component repository...' );

		this.validateRepo( this.packageInfo.wpBootStrap.components.repository );

		// grunt.verbose.or.ok();

	}

	log.verbose( 'Setting up build directory information...' );

	this.setBuildDir();

	// grunt.verbose.or.ok();


	log.verbose( 'Should commit and push after bootstrapping? ' );

	this.packageInfo.shouldPush = this.shouldPush();
	
	if(this.packageInfo.shouldPush===false){
		//grunt.verbose.warn();
		log.warn("A repository wasn't specified or had an error. Please commit and push manually.");
	}else{
		// grunt.verbose.or.ok();
		log.verbose("Will commit and push to " + this.packageInfo.repository );
	}

	return this.packageInfo;

};

/**
 * Validates the `name` from `package.json`
 */
wpBootStrapPackageInfoParser.validateName = function() {

	// make it all lowercase
	this.packageInfo.name = this.packageInfo.name.toLowerCase();

	// check if the name contains special symbols, spaces or underscores
	var invalidCharsFound = this.packageInfo.name.search( /[\'_^£$%&*()}{@#~?><>,|=+¬"\s]/i );

	// if invalid characters are found or valid characters are not found
	if ( ( invalidCharsFound !== -1 ) ) {

		var errMsg = "Special characters including _ (underscore) and spaces ";
		errMsg += "are not allowed in package name. Please rename the package.";

		throw new Error( errMsg );
	}

};

/**
 * Creates the value for `Theme Name:` header from `name` it is not supplied
 */
wpBootStrapPackageInfoParser.validatePrettyName = function() {

	if ( typeof this.packageInfo.wpBootStrap === 'undefined' ) {
		this.packageInfo.wpBootStrap = { };
	}

	if ( typeof this.packageInfo.wpBootStrap.prettyName !== 'undefined' ) {

		this.packageInfo.wpBootStrap.prettyName = this.packageInfo.wpBootStrap.prettyName.toString();

	} else {

		this.packageInfo.wpBootStrap.prettyName = "";
	}

	if ( this.packageInfo.wpBootStrap.prettyName !== "" ) {

		// check if the name contains special symbols, spaces or underscores
		var invalidCharsFound = this.packageInfo.wpBootStrap.prettyName.search( /[\'_^£$%&*()}{@#~?><>,|=+¬"]/i );

		// if invalid characters are found
		if ( ( invalidCharsFound > -1 ) ) {

			var errMsg = "Special characters including _ (underscore) and - (hyphens ";
			errMsg += "are not allowed in prettyName. Please rename it or delete to automatucally generate one.";

			throw new Error( errMsg );
		}

	} else {

		// create the pretty name by replacing all hyphens with spaces and capitalising each word (first letter uppercase)
		this.packageInfo.wpBootStrap.prettyName = this.packageInfo.name.replace( /(-|^)([^-]?)/g, function( _, prep, letter ) {
			return ( prep && ' ' ) + letter.toUpperCase();
		} );
	}
};

/**
 * Validates `functionName` used for prefixing functions and variables
 */
wpBootStrapPackageInfoParser.validateFunctionPrefix = function() {

	if ( typeof this.packageInfo.wpBootStrap === 'undefined' ) {

		this.packageInfo.wpBootStrap = { };
	}

	if ( typeof this.packageInfo.wpBootStrap.functionPrefix !== 'undefined' ) {

		this.packageInfo.wpBootStrap.functionPrefix = this.packageInfo.wpBootStrap.functionPrefix.toString();

	} else {

		this.packageInfo.wpBootStrap.functionPrefix = "";
	}

	if ( this.packageInfo.wpBootStrap.functionPrefix !== "" ) {

		// check if the name contains special symbols, spaces or underscores
		var invalidCharsFound = this.packageInfo.wpBootStrap.functionPrefix.search( /[\-'^£$%&*()}{@#~?><>,|=+¬\s"]/i );

		// if invalid characters are found or valid characters are not found
		if ( ( invalidCharsFound !== -1 ) ) {

			var errMsg = "Special characters including spaces and - (hyphens ";
			errMsg += "are not allowed in functionPrefix. Please rename it or delete to automatucally generate one.";

			throw new Error( errMsg );
		}

	} else {

		// replace hyphens with underscores for prefixing functions
		this.packageInfo.wpBootStrap.functionPrefix = this.packageInfo.name.replace( /-/g, '_' );
	}
};

/**
 * Sets up the default build directory (does not create it on filesystem)
 */
wpBootStrapPackageInfoParser.setBuildDir = function() {

	if ( typeof this.packageInfo.wpBootStrap === 'undefined' ) {

		this.packageInfo.wpBootStrap = { };
	}

	if ( typeof this.packageInfo.wpBootStrap.buildDir !== 'undefined' ) {

		this.packageInfo.wpBootStrap.buildDir = this.packageInfo.wpBootStrap.buildDir.toString();

	} else {

		this.packageInfo.wpBootStrap.buildDir = "";
	}

	if ( this.packageInfo.wpBootStrap.buildDir !== "" ) {

		// check if the name contains special symbols, spaces or underscores
		var invalidCharsFound = this.packageInfo.wpBootStrap.buildDir.search( /[\\/'^£$%&*()}{@#~?><>,|=+¬\s"]/i );

		if ( ( invalidCharsFound !== -1 ) ) {

			var errMsg = "Special characters including spaces ";
			errMsg += "are not allowed in buildDir. Please rename it or delete to automatucally generate one.";

			throw new Error( errMsg );
		}

	} else {

		this.packageInfo.wpBootStrap.buildDir = 'build';
	}

};

/**
 * Validates git URL format
 * 
 * @param {string} A git URL
 */
wpBootStrapPackageInfoParser.validateGitURL = function( repo ) {

	var patternMatch = repo.match( /^git@.+\.git$/gi );

	if ( patternMatch !== null ) {
		patternMatch = patternMatch.toString();
	} else {
		patternMatch = "";
	}

	if ( patternMatch !== repo ) {
		throw new Error( repo + " is not a valid git URL like git@somedomain.tld:namespace/repo-name.git" );
	}

};

/**
 * Valudates actual git repository
 * 
 * @param {string} repo
 */
wpBootStrapPackageInfoParser.validateGitRepo = function( repo ) {


	// see: http://stackoverflow.com/questions/32393250/nodejs-child-process-spawnsync-or-child-process-spawn-wrapped-in-yieldable-gener
	var resp = exec.spawnSync( 'git', [ "ls-remote", repo ], { encoding: 'utf8' } );

	if ( resp.stderr !== "" ) {
		throw new Error( resp.stderr );
	}

};

/**
 * Validates a git repository
 * 
 * @param {string} repo
 */
wpBootStrapPackageInfoParser.validateRepo = function( repo ) {
	this.validateGitURL( repo );

	this.validateGitRepo( repo );
};

/**
 * Sets up component information
 */
wpBootStrapPackageInfoParser.setComponentInfo = function() {

	if ( typeof this.packageInfo.wpBootStrap === 'undefined' ) {

		this.packageInfo.wpBootStrap = { };
	}
	if ( typeof this.packageInfo.wpBootStrap.components === 'undefined' ) {

		this.packageInfo.wpBootStrap.components = [ ];
	}

	if ( typeof this.packageInfo.wpBootStrap.components.names === 'undefined' ) {

		this.packageInfo.wpBootStrap.components.names = [ ];

	}

	if ( typeof ( this.packageInfo.wpBootStrap.components.names ) !== 'object' ) {
		throw new Error( "Components must be defined as an array" );
	}

};

/**
 * Checks if we need to commit and push the bootstrap to a remote
 * 
 * @returns {Boolean} if package repo exists
 */
wpBootStrapPackageInfoParser.shouldPush = function() {

	if ( typeof this.packageInfo.repository === 'undefined' ) {
		return false;
	}

	if ( this.packageInfo.repository.toString() === '' ) {
		return false;
	}

	try {
		this.validateRepo( this.packageInfo.repository );
	} catch ( e ) {
		return false;
	}
	return true;
};

// export this module
module.exports = wpBootStrapPackageInfoParser;