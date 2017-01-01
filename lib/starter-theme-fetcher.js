/**
 * Starter Package Fetch Module
 * 
 * @module lib/starter-theme-fetcher
 */

'use strict';

var grunt = require( "grunt" );
var exec = require( 'child_process' ); // for running git commands
var log = require("winston"); // for logging


var wpggStarterThemeFetcher = function() {
};

wpggStarterThemeFetcher.starter = null;

wpggStarterThemeFetcher.bootStrapInfo = { };

wpggStarterThemeFetcher.init = function( bootStrapInfo ) {
	this.bootStrapInfo = bootStrapInfo;
};

wpggStarterThemeFetcher.fetch = function( bootStrapInfo ) {

	this.init( bootStrapInfo );

	log.verbose( 'Checking current state...' );
	
	var buildType = this.verify();

	var validStarter = buildType;
	
	log.verbose('OK');

	if ( buildType === false ) {

		log.verbose.write( 'Downloading starter...' );
		
		this.fetchStarter();
		
		log.verbose('OK');
		log.verbose.write( 'Verifying download ...' );

		validStarter = this.verify();

		log.verbose('OK');

	} else {

		log.info( 'Starter ' + buildType + ' already exists' );

	}

	return validStarter;

};

wpggStarterThemeFetcher.verify = function() {
	
	var buildType = false;
	
	var pluginIndex = './' + this.bootStrapInfo.buildDir + '/starter/' + this.bootStrapInfo.name + '.php';
	
	var themeFunctions = './' + this.bootStrapInfo.buildDir + '/starter/functions.php';
	
	try{
		fs.accessSync( pluginIndex, fs.constants.F_OK );
		buildType = 'plugin';
	}catch(error){
		try {
			fs.accessSync( themeFunctions, fs.constants.F_OK );
			buildType = 'theme';
		} catch ( error ) {
			throw new Error( 'Starter theme/plugin not downloaded. Please try again later.' );
		}
	}
	
	return buildType;
};

wpggStarterThemeFetcher.svnURL = function( repo ) {
	return repo.replace( /:/gi, "/" ).replace( /^git@/gi, "https://" ).replace( /.git$/gi, "/" );
};

wpggStarterThemeFetcher.fetchStarter = function() {

	if ( this.bootStrapInfo.starter.repository.search( /github/i ) < 0 ) {

		this._fetchStarterGit();
	} else {

		this.bootStrapInfo.starter.svnRemote = this.svnURL( this.bootStrapInfo.starter.repository );

		this._fetchStarterSVN();

	}
};


wpggStarterThemeFetcher._fetchStarterGit = function() {

	// setup starter plugin/theme command
	var gitCMD = "git archive --remote=" + this.bootStrapInfo.starter.repository + " HEAD starter | tar -x";


	// var resp = exec.execSync( gitCMD, { stdio: 'ignore', encoding: 'utf8' } );
	var resp = exec.spawnSync( 'sh', [ "-c", gitCMD ], { encoding: 'utf8' } );

	if ( resp.stderr !== "" ) {
		throw new Error( resp.stderr );
	}

};


wpggStarterThemeFetcher._fetchStarterSVN = function() {

	var resp = exec.spawnSync( 'svn', [ 'export', this.bootStrapInfo.starter.svnRemote + "trunk/", this.bootStrapInfo.buildDir + "/starter", "--force" ], { encoding: 'utf8' } );

	if ( resp.stderr !== "" ) {
		throw new Error( resp.stderr );
	}

};



/**
 * Initialises module
 * 
 * @param {object} grunt The grunt object
 * @returns {exports.init.exports} Instance of the functional module
 */
module.exports = wpggStarterThemeFetcher;