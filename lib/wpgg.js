/**
 * Starter Package Fetch Module
 * 
 * @module lib/fetch-starter
 */

'use strict';

var fs = require('fs');
var exec = require( 'child_process' ); // for running git commands

var log = require("./logger"); // for logging

var wpGG = function() {
	//this.initConfig();
};

wpGG.bootStrapInfo = { };

wpGG.options = {
	"validate": true,
	"autofix": true,
	"css": true,
	"push": true,
	"logLevel": "info"
};
wpGG.init = function( validate, autofix, css, push, logLevel ) {
	this.options.validate = validate || this.options.validate;
	this.options.autofix = autofix || this.options.autofix;
	this.options.css = css || this.options.css;
	this.options.push = push || this.options.push;
	
	this.options.logLevel = logLevel || "info";
	log.level = this.options.logLevel;
	return this;
};

// get package info from Package Info Parser Module
var buildInfoParser = require( './buildInfo-parser' );

// initialise module to fetch starter package
// wpGG.starter = require( './lib/starterTheme-fetcher' );


// initialise module to fetch starter package
// wpGG.components = require( './lib/component-fetcher' );

// wpGG.replacer = require( './lib/replace-theme' );

// wpGG.mapBuilder = require( './lib/build-style-map' );

wpGG.packageInfo = { };

wpGG.bootStrapInfo = { 'buildDir': 'build', 'installed': [ 'flex-grid', 'font-awesome' ] };

wpGG.installed = [ ];


wpGG.readJSON = function(path){
	if ( !fs.existsSync( path ) ) {
		throw new Error('File ' + path + ' not found');
	}
	var obj = JSON.parse(fs.readFileSync(path, 'utf8'));
	
	return obj;
	
};


wpGG.initConfig = function() {
	
	log.info('Parsing build information...')

	this.packageInfo = this.readJSON( './package.json' );

	try {
		// get package info from Package Info Parser Module
		this.packageInfo = buildInfoParser.parse( this.packageInfo, this.options );
	} catch ( e ) {
		log.error( e.message );
	}

	// move wpGG Information into a separate object for convenience
	this.bootStrapInfo = this.packageInfo.wpgg;
	
	console.log(this.packageInfo, this.bootStrapInfo);

	log.verbose('ok');
};

/**
 * Initialises module
 * 
 * @param {object} grunt The grunt object
 * @returns {exports.init.exports} Instance of the functional module
 */
module.exports = wpGG;