/**
 * Component Package Fetch Module
 * 
 * @module lib/fetch-starter
 */

'use strict';

var grunt = require( "grunt" );
var chalk = require( "chalk" );
var exec = require( 'child_process' ); // for running git commands
var extend = require('util')._extend;


var wpBootStrapComponentFetcher = function() {
};

wpBootStrapComponentFetcher.starter = null;

wpBootStrapComponentFetcher.bootStrapInfo = { };

wpBootStrapComponentFetcher.init = function( bootStrapInfo ) {
	this.bootStrapInfo = bootStrapInfo;
};

wpBootStrapComponentFetcher.svnURL = function( repo ) {
	return repo.replace( /:/gi, "/" ).replace( /^git@/gi, "https://" ).replace( /.git$/gi, "/" );
};

wpBootStrapComponentFetcher.fetch = function( bootStrapInfo ) {

	this.init( bootStrapInfo );
	grunt.verbose.write( 'Downloading components...' );
	
	this.bootStrapInfo.components.installed = [];

	var componentErrors = this.fetchComponents( this.bootStrapInfo.components.names );


	var depends = this.getDependencies();
	
	if ( depends.length > 0 ) {
		var depErrors = this.fetchComponents( depends );
		extend( componentErrors,depErrors );
	}

	if ( Object.keys( componentErrors ).length > 0 ) {
		grunt.verbose.warn();
		grunt.verbose.warn( 'Some components were not downloaded because of errors' );
		grunt.verbose.subhead( chalk.red( '<component>:' ) + ' <error description>' );
		Object.keys( componentErrors ).forEach( function( component ) {
			grunt.verbose.warn( chalk.red( component + ":" ) + " " + componentErrors[component].replace( /##/gi, chalk.yellow( '##' ) ) );
		} );


	} else {
		grunt.verbose.ok();
	}

	return this.bootStrapInfo.components.installed;

};

wpBootStrapComponentFetcher.getDependencies = function() {

	var depends = [ ];

	var names = this.bootStrapInfo.components.names;

	var buildDir = this.bootStrapInfo.buildDir;

	names.forEach( function( component ) {

		var componentJSONfile = './' + buildDir + '/' + component + '/component.json';
		
		if ( grunt.file.exists( componentJSONfile ) ) {
			var componentJSON = grunt.file.readJSON( componentJSONfile );
			
			if ( typeof componentJSON.dependencies === "object" ) {
				componentJSON.dependencies.forEach( function( dependency ) {
					if ( names.indexOf( dependency ) < 0 ) {
						depends.push( dependency );
					}

				} );
			}
			
		}

	} );
	
	return depends;

};

wpBootStrapComponentFetcher.fetchComponents = function( components ) {

	var componentErrors = { };

	var $this = this;
	
	var installed = this.bootStrapInfo.components.installed;
	
	if ( this.bootStrapInfo.components.repository.search( /github/i ) < 0 ) {


		components.forEach( function( component ) {
			var fetchErr = $this._fetchComponentGit( component );
			if ( fetchErr !== "" ) {
				componentErrors[component] = fetchErr.replace( /\s\s+/gi, ' ' ).replace( /\n$/gi, "" ).replace( /\n/gi, " ## " );
			}else{
				installed.push(component);
			}
		} );

	} else {

		this.bootStrapInfo.components.svnRemote = this.svnURL( this.bootStrapInfo.starter.repository );


		components.forEach( function( component ) {

			var fetchErr = $this._fetchComponentSVN( component );

			if ( fetchErr !== "" ) {
				componentErrors[component] = fetchErr.replace( /\s\s+/gi, ' ' ).replace( /\n$/gi, "" ).replace( /\n/gi, " ## " );
			}else{
				installed.push(component);
			}
		} );

	}
	
	this.bootStrapInfo.components.installed = installed;
	
	return componentErrors;
};



wpBootStrapComponentFetcher._fetchComponentGit = function( component ) {

	// setup starter plugin/theme command
	var gitCMD = "git archive --remote=" + this.bootStrapInfo.components.repository + " --prefix=" + this.bootStrapInfo.buildDir + "/components/ HEAD " + component + " | tar -x";

	// var resp = exec.execSync( gitCMD, { stdio: 'ignore', encoding: 'utf8' } );
	var resp = exec.spawnSync( 'sh', [ "-c", gitCMD ], { encoding: 'utf8' } );

	return resp.stderr;
};


wpBootStrapComponentFetcher._fetchComponentSVN = function( component ) {
	var resp = exec.spawnSync( 'svn', [ 'export', this.bootStrapInfo.components.svnRemote + "trunk/" + component + "/", this.bootStrapInfo.buildDir + "/components/" + component, "--force" ], { encoding: 'utf8' } );


	return resp.stderr;

};


wpBootStrapComponentFetcher.verify = function() {



};
/**
 * Initialises module
 * 
 * @param {object} grunt The grunt object
 * @returns {exports.init.exports} Instance of the functional module
 */
module.exports = wpBootStrapComponentFetcher;