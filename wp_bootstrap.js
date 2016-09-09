/*
 * grunt-wp-theme-bootstrap
 * 
 *
 * Copyright (c) 2016 Saurabh Shukla
 * Licensed under the GPL, 2.0 licenses.
 * 
 * @todo add repository field to package.json and to the theme header to be used by shared engine
 * @todo add unit tests using https://github.com/caolan/nodeunit and https://www.sitepoint.com/build-and-publish-your-own-grunt-plugin/
 * @done validate component info in package.json
 * @done recursive directory files
 * @done replace _s with package name using instructions in Readme.md
 * @todo rebuild style.scss from scratch 
 * @see: https://jsfiddle.net/fb5shenc/1/ for an experiment to merge the tabbed text
 * @done replace automattic.com with yapapaya.com
 * @todo delete index.json
 * @todo delete Readme.md
 * @todo delete CONTRIBUTING.md
 * @todo create Readme.md from Readme.txt
 */

'use strict';



// node dependencies
var exec = require( 'child_process' ); // for running unix commands
var chalk = require( 'chalk' ); // for colouring output
var fs = require( 'fs' );
//var defaults = require( 'defaults-deep' );


// get package info from Package Info Parser Module
var packageParser = require( './lib/package-info-parser' );
// initialise module to fetch starter package
var starter = require( './lib/fetch-starter' );
// initialise module to fetch starter package
var components = require( './lib/fetch-component' );

var replacer = require( './lib/replace-theme' );

var mapBuilder = require( './lib/build-style-map' );

var packageInfo = { };

		var bootStrapInfo = {'buildDir':'build', 'installed': ['flex-grid', 'font-awesome'] };
		
		var installed = [];

// initialise grunt module on node
module.exports = function( grunt ) {



	// initilaise module to fetch components
	//var components = require( './lib/fetch-components' );

	// register the plugin's task for grunt
	grunt.registerTask( 'wpBootStrap', 'A grunt plugin to bootstrap WordPress theme/ plugin development', function() {

		

		var initConfig = function() {

			if ( !grunt.file.exists( './package.json' ) ) {
				grunt.fail.fatal( "wpBootStrap couldn't find a " + chalk.yellow( 'package.json' ) + " file!" );
			}

			packageInfo = grunt.file.readJSON( './package.json' );

			grunt.verbose.or.write( 'Parsing package information...' );

			try {
				// get package info from Package Info Parser Module
				packageInfo = packageParser.parse( packageInfo );
			} catch ( e ) {
				grunt.fail.fatal( e.message );
			}

			// move wpBootStrap Information into a separate object for convenience
			bootStrapInfo = packageInfo.wpBootStrap;

			grunt.verbose.or.ok();
		};

		var fetchStarter = function() {

			grunt.verbose.or.write( 'Fetching starter package...' );

			try {
				starter.fetch(bootStrapInfo);
			} catch ( e ) {
				grunt.fail.fatal( e.message );
			}

			grunt.verbose.or.ok();	

		};
		
		var fetchComponents = function(){
			
			grunt.verbose.or.write( 'Fetching components...' );
			bootStrapInfo.components.installed = [];
			try {
				bootStrapInfo.components.installed = components.fetch(bootStrapInfo);
			} catch ( e ) {
				grunt.fail.fatal( e.message );
			}
			grunt.verbose.or.ok();
			
			console.log(bootStrapInfo);

			grunt.log.ok('Downloaded ' + chalk.yellow(bootStrapInfo.components.installed.join(', ')));
			
			// findReplaceName( packageInfo.wpBootStrap.componentArchive.keyword );
			
		};
		
		var replace = function(){
			grunt.verbose.or.write( 'Fetching components...' );
			replacer.init(packageInfo);
			replacer.replaceTheme();
			grunt.verbose.or.ok();
			
			
			
		};
		
		var buildStyleMap = function(){
			grunt.verbose.write('building stylemap...');
			bootStrapInfo = mapBuilder.buildMap(bootStrapInfo);
			
			mapBuilder.build(bootStrapInfo);
			
		};

		var cleanup = function() {

			var cleanables = [
				'./index.json',
				'./languages/',
				'./CONTRIBUTING.md',
				'README.md',
				'.svn'
			];
			cleanables.forEach( function( cleanable ) {
				grunt.file.delete( cleanable );
			} );


		};

		grunt.log.writeln( 'Initialising ' + chalk.yellow( 'wpBootStrap' ) );

		// initConfig();
		// fetchStarter();
		buildStyleMap();
		//fetchComponents();
		
		//replace();
		
		//buildStyleMap();
		


	} );


};