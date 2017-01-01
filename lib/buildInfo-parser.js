/**
 * Package Information Parser
 * 
 * @module lib/package-info-parser
 */
'use strict';

var chalk = require( 'chalk' ); // for colouring output
var exec = require( 'child_process' ); // for running git commands
var fs = require( 'fs' );

var log = require( "./logger" ); // for logging


/**
 * Processes and validates the `package.json` file
 * 
 * @param {object} grunt The grunt object
 * @returns {exports.init.buildInfo} The processed package information
 */
var wpggBuildInfoParser = function() {
};

/**
 * @type object Package Information
 */
wpggBuildInfoParser.packageInfo = { };

wpggBuildInfoParser.buildInfo = { };

wpggBuildInfoParser.options = { };

/**
 * Initialises parser
 * @param {object} json The default json from `package.json` file
 */
wpggBuildInfoParser.init = function( json, options ) {

	this.packageInfo = json;
	
	this.options = options;

	log.level = this.options.logLevel;

};

/**
 * Parses and validates the package information provided
 * 
 * @param {type} json
 * @returns {object}
 */
wpggBuildInfoParser.parse = function( json, options ) {

	this.init( json, options );

	this.validateName();

	log.silly( 'Validating function prefix...' );

	this.validateFunctionPrefix();


	log.silly( 'Checking prettyName for WP ' + chalk.yellow( 'Theme/Plugin Name:' ) + ' header...' );

	this.validatePrettyName();


	log.silly( 'Validating starter repository...' );

	this.validateRepo( this.packageInfo.wpgg.starter.repository );



	log.silly( 'Checking component information...' );

	this.setComponentInfo();



	if ( this.packageInfo.wpgg.components.names.length > 0 ) {

		log.silly( 'Validating component repository...' );

		this.validateRepo( this.packageInfo.wpgg.components.repository );


	}

	log.silly( 'Setting up build directory information...' );

	this.setBuildDir();



	log.info( 'Should commit and push after bootstrapping? ' );

	if ( this.options.push === false ) {
		log.info( 'Noted: You don\'t wish to push to a repo when we\'re done building' );
	} else {
		this.packageInfo.shouldPush = this.shouldPush();

		if ( this.packageInfo.shouldPush === false ) {

			log.info( "Invalid package repository. Can\'t push; please commit and push manually." );
		} else {

			console.log( "Will commit and push to " + this.packageInfo.repository );
		}
	}



	return this.packageInfo;

};

/**
 * Validates the `name` from `package.json`
 */
wpggBuildInfoParser.validateName = function() {
	
	var ogPackageName = this.packageInfo.name;

	// check if the name contains UPPERCASE letters, special symbols, spaces or underscores
	var invalidCharsFound = this.packageInfo.name.search( /[A-Z\'_^£$%&*()}{@#~?><>,|=+¬"\s]/ );

	// if invalid characters are found or valid characters are not found
	if ( ( invalidCharsFound !== -1 ) ) {
		
		if ( this.options.autofix === false ) {

			var errMsg = "UPPERCASE letters & special characters including _ (underscore) and spaces ";
			errMsg += "are not allowed in package name. Please rename the package.";

			throw new Error( errMsg );
			
		}else{
			
			this.packageInfo.name = this.packageInfo.name.toLowerCase();
			this.packageInfo.name = this.packageInfo.name.replace(/[\'_^£$%&*()}{@#~?><>,|=+¬"\s]/i, '-');
			log.warn('Package name has errors & will be updated from '+ ogPackageName + ' to ' + this.packageInfo.name );
		}
	}

};

/**
 * Creates the value for `Theme Name:` header from `name` it is not supplied
 */
wpggBuildInfoParser.validatePrettyName = function() {

	if ( typeof this.packageInfo.wpgg === 'undefined' ) {
		this.packageInfo.wpgg = { };
	}

	if ( typeof this.packageInfo.wpgg.prettyName !== 'undefined' ) {

		this.packageInfo.wpgg.prettyName = this.packageInfo.wpgg.prettyName.toString();

	} else {

		this.packageInfo.wpgg.prettyName = "";
	}

	if ( this.packageInfo.wpgg.prettyName !== "" ) {

		// check if the name contains special symbols, spaces or underscores
		var invalidCharsFound = this.packageInfo.wpgg.prettyName.search( /[\'_^£$%&*()}{@#~?><>,|=+¬"]/i );

		// if invalid characters are found
		if ( ( invalidCharsFound > -1 ) ) {

			var errMsg = "Special characters including _ (underscore) and - (hyphens ";
			errMsg += "are not allowed in prettyName. Please rename it or delete to automatucally generate one.";

			throw new Error( errMsg );
		}

	} else {

		// create the pretty name by replacing all hyphens with spaces and capitalising each word (first letter uppercase)
		this.packageInfo.wpgg.prettyName = this.packageInfo.name.replace( /(-|^)([^-]?)/g, function( _, prep, letter ) {
			return ( prep && ' ' ) + letter.toUpperCase();
		} );
	}
};

/**
 * Validates `functionName` used for prefixing functions and variables
 */
wpggBuildInfoParser.validateFunctionPrefix = function() {

	if ( typeof this.packageInfo.wpgg === 'undefined' ) {

		this.packageInfo.wpgg = { };
	}

	if ( typeof this.packageInfo.wpgg.functionPrefix !== 'undefined' ) {

		this.packageInfo.wpgg.functionPrefix = this.packageInfo.wpgg.functionPrefix.toString();

	} else {

		this.packageInfo.wpgg.functionPrefix = "";
	}

	if ( this.packageInfo.wpgg.functionPrefix !== "" ) {

		// check if the name contains special symbols, spaces or underscores
		var invalidCharsFound = this.packageInfo.wpgg.functionPrefix.search( /[\-'^£$%&*()}{@#~?><>,|=+¬\s"]/i );

		// if invalid characters are found or valid characters are not found
		if ( ( invalidCharsFound !== -1 ) ) {

			var errMsg = "Special characters including spaces and - (hyphens ";
			errMsg += "are not allowed in functionPrefix. Please rename it or delete to automatucally generate one.";

			throw new Error( errMsg );
		}

	} else {

		// replace hyphens with underscores for prefixing functions
		this.packageInfo.wpgg.functionPrefix = this.packageInfo.name.replace( /-/g, '_' );
	}
};

/**
 * Sets up the default build directory (does not create it on filesystem)
 */
wpggBuildInfoParser.setBuildDir = function() {

	if ( typeof this.packageInfo.wpgg === 'undefined' ) {

		this.packageInfo.wpgg = { };
	}

	if ( typeof this.packageInfo.wpgg.buildDir !== 'undefined' ) {

		this.packageInfo.wpgg.buildDir = this.packageInfo.wpgg.buildDir.toString();

	} else {

		this.packageInfo.wpgg.buildDir = "";
	}

	if ( this.packageInfo.wpgg.buildDir !== "" ) {

		// check if the name contains special symbols, spaces or underscores
		var invalidCharsFound = this.packageInfo.wpgg.buildDir.search( /[\\/'^£$%&*()}{@#~?><>,|=+¬\s"]/i );

		if ( ( invalidCharsFound !== -1 ) ) {

			var errMsg = "Special characters including spaces ";
			errMsg += "are not allowed in buildDir. Please rename it or delete to automatucally generate one.";

			throw new Error( errMsg );
		}

	} else {

		this.packageInfo.wpgg.buildDir = 'build';
	}

};

/**
 * Validates git URL format
 * 
 * @param {string} A git URL
 */
wpggBuildInfoParser.validateGitURL = function( repo ) {

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
wpggBuildInfoParser.validateGitRepo = function( repo ) {


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
wpggBuildInfoParser.validateRepo = function( repo ) {
	this.validateGitURL( repo );

	this.validateGitRepo( repo );
};

/**
 * Sets up component information
 */
wpggBuildInfoParser.setComponentInfo = function() {

	if ( typeof this.packageInfo.wpgg === 'undefined' ) {

		this.packageInfo.wpgg = { };
	}
	if ( typeof this.packageInfo.wpgg.components === 'undefined' ) {

		this.packageInfo.wpgg.components = [ ];
	}

	if ( typeof this.packageInfo.wpgg.components.names === 'undefined' ) {

		this.packageInfo.wpgg.components.names = [ ];

	}

	if ( typeof ( this.packageInfo.wpgg.components.names ) !== 'object' ) {
		throw new Error( "Components must be defined as an array" );
	}

};

/**
 * Checks if we need to commit and push the bootstrap to a remote
 * 
 * @returns {Boolean} if package repo exists
 */
wpggBuildInfoParser.shouldPush = function() {

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
module.exports = wpggBuildInfoParser;