/**
 * Starter Package Fetch Module
 * 
 * @module lib/fetch-starter
 */

'use strict';

var grunt = require( "grunt" );
var exec = require( 'child_process' ); // for running git commands


var wpBootStrapStarterFetcher = function() {
};

wpBootStrapStarterFetcher.starter = null;

wpBootStrapStarterFetcher.bootStrapInfo = { };

wpBootStrapStarterFetcher.init = function( bootStrapInfo ) {
	this.bootStrapInfo = bootStrapInfo;
};

wpBootStrapStarterFetcher.fetch = function( bootStrapInfo ) {

	this.init( bootStrapInfo );

	grunt.verbose.write( 'Checking current state...' );
	
	var buildType = this.themeOrPlugin();

	var validStarter = buildType;
	
	grunt.verbose.ok();

	if ( buildType === false ) {

		grunt.verbose.write( 'Downloading starter...' );
		
		this.fetchStarter();
		
		grunt.verbose.ok();
		grunt.verbose.write( 'Verifying download ...' );

		validStarter = this.verify();

		grunt.verbose.ok();

	} else {

		grunt.log.writeln( 'Starter ' + buildType + ' already exists' );

	}

	return validStarter;

};

wpBootStrapStarterFetcher.verify = function() {
	
	var buildType = false;

	if ( grunt.file.exists( './'+this.bootStrapInfo.buildDir +'/starter/' + this.bootStrapInfo.name + '.php' ) ) {
		// this is a plugin because `{my-project-name}.php` exists

		buildType = true;
		
	} else if ( grunt.file.exists( './'+this.bootStrapInfo.buildDir+'/starter/functions.php' ) ) {

		buildType = true;
	}

	if ( buildType === false ) {
		throw new Error( 'Starter theme/plugin not downloaded. Please try again later.' );
	}

	return buildType;


};

wpBootStrapStarterFetcher.themeOrPlugin = function() {

	if ( grunt.file.exists( this.bootStrapInfo.name + '.php' ) ) {
		// this is a plugin because `{my-project-name}.php` exists

		return 'plugin';
	} else if ( grunt.file.exists( 'functions.php' ) ) {

		return 'theme';
	}

	return false;

};

wpBootStrapStarterFetcher.svnURL = function( repo ) {
	return repo.replace( /:/gi, "/" ).replace( /^git@/gi, "https://" ).replace( /.git$/gi, "/" );
};

wpBootStrapStarterFetcher.fetchStarter = function() {

	if ( this.bootStrapInfo.starter.repository.search( /github/i ) < 0 ) {

		this._fetchStarterGit();
	} else {

		this.bootStrapInfo.starter.svnRemote = this.svnURL( this.bootStrapInfo.starter.repository );

		this._fetchStarterSVN();

	}
};


wpBootStrapStarterFetcher._fetchStarterGit = function() {

	// setup starter plugin/theme command
	var gitCMD = "git archive --remote=" + this.bootStrapInfo.starter.repository + " HEAD starter | tar -x";


	// var resp = exec.execSync( gitCMD, { stdio: 'ignore', encoding: 'utf8' } );
	var resp = exec.spawnSync( 'sh', [ "-c", gitCMD ], { encoding: 'utf8' } );

	if ( resp.stderr !== "" ) {
		throw new Error( resp.stderr );
	}

};


wpBootStrapStarterFetcher._fetchStarterSVN = function() {

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
module.exports = wpBootStrapStarterFetcher;