/**
 * Starter Package Fetch Module
 * 
 * @module lib/fetch-starter
 */

'use strict';

var fs = require('fs');
var exec = require( 'child_process' ); // for running git commands
var chalk = require( 'chalk' ); // for colouring output
var log = require("winston"); // for logging


var wpBootStrap = function() {
	//this.initConfig();
};

wpBootStrap.bootStrapInfo = { };

wpBootStrap.init = function( bootStrapInfo ) {
	this.bootStrapInfo = bootStrapInfo;
};

// get package info from Package Info Parser Module
wpBootStrap.packageParser = require( './lib/package-info-parser' );

// initialise module to fetch starter package
// wpBootStrap.starter = require( './lib/fetch-starter' );

wpBootStrap.utils = require( './lib/utils' );
// initialise module to fetch starter package
// wpBootStrap.components = require( './lib/fetch-component' );

// wpBootStrap.replacer = require( './lib/replace-theme' );

// wpBootStrap.mapBuilder = require( './lib/build-style-map' );

wpBootStrap.packageInfo = { };

wpBootStrap.bootStrapInfo = {'buildDir':'build', 'installed': ['flex-grid', 'font-awesome'] };
		
wpBootStrap.installed = [];


wpBootStrap.initConfig = function() {

			if ( !fs.existsSync( './package.json' ) ) {
				log.error("wpBootStrap couldn't find a " + chalk.yellow( 'package.json' ) + " file!" );
			}

			this.packageInfo = this.utils.readJSON( './package.json' );
			
			console.log('debug',this.packageInfo);

			log.verbose('Parsing package information...' );

			try {
				// get package info from Package Info Parser Module
				this.packageInfo = this.packageParser.parse( this.packageInfo );
			} catch ( e ) {
				log.error( e.message );
			}

			// move wpBootStrap Information into a separate object for convenience
			this.bootStrapInfo = this.packageInfo.wpBootStrap;

			log.verbose('ok');
		};






/**
 * Initialises module
 * 
 * @param {object} grunt The grunt object
 * @returns {exports.init.exports} Instance of the functional module
 */
module.exports = wpBootStrap.initConfig();