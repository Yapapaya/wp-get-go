/**
 * Starter Package Fetch Module
 * 
 * @module lib/fetch-starter
 */

'use strict';

var fs = require('fs');
var exec = require( 'child_process' ); // for running git commands
var chalk = require( 'chalk' );

var wpBootStrap = function() {
	//this.initConfig();
};

wpBootStrap.bootStrapInfo = { };

wpBootStrap.options = {
	"validate": true,
	"css": true,
	"push": true,
	"verbose": false

};
wpBootStrap.init = function( validate, css, push, verbose ) {
	this.options.validate = validate || this.options.validate;
	this.options.css = css || this.options.css;
	this.options.push = push || this.options.push;
	this.options.verbose = verbose || this.options.verbose;
};

// get package info from Package Info Parser Module
wpBootStrap.packageParser = require( './package-info-parser' );

// initialise module to fetch starter package
// wpBootStrap.starter = require( './lib/fetch-starter' );

wpBootStrap.utils = require( './utils' );
// initialise module to fetch starter package
// wpBootStrap.components = require( './lib/fetch-component' );

// wpBootStrap.replacer = require( './lib/replace-theme' );

// wpBootStrap.mapBuilder = require( './lib/build-style-map' );

wpBootStrap.packageInfo = { };

wpBootStrap.bootStrapInfo = { 'buildDir': 'build', 'installed': [ 'flex-grid', 'font-awesome' ] };

wpBootStrap.installed = [ ];


wpBootStrap.initConfig = function() {


	this.packageInfo = this.utils.readJSON( './package.json' );

	console.log( 'debug', this.packageInfo );

	log.verbose( 'Parsing package information...' );

	try {
		// get package info from Package Info Parser Module
		this.packageInfo = this.packageParser.parse( this.packageInfo );
	} catch ( e ) {
		log.error( e.message );
	}

	// move wpBootStrap Information into a separate object for convenience
	this.bootStrapInfo = this.packageInfo.wpBootStrap;

	log.verbose( 'ok' );
};






/**
 * Initialises module
 * 
 * @param {object} grunt The grunt object
 * @returns {exports.init.exports} Instance of the functional module
 */
module.exports = wpBootStrap;