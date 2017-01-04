/**
 * Starter Package Fetch Module
 * 
 * @module lib/starter-theme-fetcher
 */

'use strict';

var colors = require( 'colors' ); // for colouring output
var exec = require( 'child_process' ); // for running git commands
var fs = require( 'fs' ); // for file system operations
var log = require( "../utils/logger" ); // for logging
var utils = require('../utils/utils'); // utility fns

/**
 * Initialise Module
 * 
 * @returns {wpggStarterThemeFetcher}
 */
var wpggStarterThemeFetcher = function() {
};

/**
 * SVN remote url for GitHub repos
 * 
 * @type string
 */
wpggStarterThemeFetcher.svnRemote = '';

/**
 * Directory where starter theme will be downloaded in
 * 
 * @type string
 */
wpggStarterThemeFetcher.buildDir = '';

/**
 * The wpgg bootstrapping info from package.json
 * 
 * @type object
 */
wpggStarterThemeFetcher.bootStrapInfo = { };

/**
 * Initialise functionality
 * 
 * @param {object} bootStrapInfo wpgg configuration from package.json
 * @param {object} options wpGG options
 * @returns {undefined}
 */
wpggStarterThemeFetcher.init = function( bootStrapInfo, options ) {
	this.bootStrapInfo = bootStrapInfo;
	this.options = options;
	this.buildDir = './' + this.bootStrapInfo.buildDir + '/starter';
	try{
		fs.mkdirSync('./' + this.bootStrapInfo.buildDir);
	}catch(e){
		// if creating build directory failed 'and' it doesn't exist already
		if ( e.code !== 'EEXIST' ) throw e;
	}
	try{
		fs.mkdirSync(this.buildDir);
	}catch(e){
		// if creating build directory failed 'and' it doesn't exist already
		if ( e.code !== 'EEXIST' ) throw e;
	}
};

/**
 * Fetch the starter theme
 * 
 * @param {object} bootStrapInfo wpgg configuration from package.json
 * @param {object} options wpGG options
 * @returns {wpggStarterThemeFetcher.fetch@call;verify|buildType}
 */
wpggStarterThemeFetcher.fetch = function( bootStrapInfo, options, callback ) {

	this.init( bootStrapInfo, options );

	log.silly( 'Checking current state...' );
	
	var starterExists = this.verify(false);
	var strStarterExists = starterExists ? 'yes'.green: 'no'.red;
	
	log.info('Does starter theme already exist? '+ strStarterExists);
	
	// assume that starter is invalid
	var validStarter = false;

	if ( starterExists === false ) {

		log.silly( 'Downloading starter...' );
		
		this.fetchRepo();
		
		log.silly('OK');
		log.silly( 'Verifying download ...' );

		validStarter = this.verify(true);

		log.silly('OK');

	} else {

		log.debug( 'Skipping fetching starter theme' );

	}
	
	callback();

	return validStarter;

};

/**
 * Verify starter theme
 * 
 * @param {Boolean} afterBuild
 * @returns {Boolean}
 */
wpggStarterThemeFetcher.verify = function(afterFetch) {
	
	// assume that there's no starter
	var starterExists = false;
	
	try {
		// check if functions.php exists & therefore starter exists
		fs.accessSync( this.buildDir + '/functions.php', fs.constants.F_OK );
		starterExists = true;
		
	} catch ( error ) {
		// otherwise starter doesn't exist
		starterExists = false;
		
		// if this is being checked after a fetch, then throw an error
		if(afterFetch === true){
			throw new Error( 'Starter theme/plugin not downloaded. Please try again later.' );
		}
	}
	
	return starterExists;
};

/**
 * Fetch Starter theme from remote
 * 
 * @returns {undefined}
 */
wpggStarterThemeFetcher.fetchRepo = function() {

	if ( this.bootStrapInfo.starter.repository.search( /github/i ) < 0 ) {
		
		log.debug('Not a GitHub repository, fetching using git');

		this._fetchGit();
		
	} else {
		
		log.debug('GitHub repository, switching to SVN');
		
		this.svnRemote = utils.httpsURL( this.bootStrapInfo.starter.repository );

		this._fetchSVN();

	}
};


/**
 * Fetch a remote git repository's main files
 * 
 * @returns {undefined}
 */
wpggStarterThemeFetcher._fetchGit = function() {

	// setup git archive command (to just get the files, no git needed
	var gitCMD = "git archive --remote=" + this.bootStrapInfo.starter.repository + " HEAD | (cd " + this.buildDir + " && tar -x)";


	// run command on shell
	var resp = exec.spawnSync( 'sh', [ "-c", gitCMD ], { encoding: 'utf8' } );

	// if there was an error
	if ( resp.stderr !== "" ) {
		throw new Error( resp.stderr );
	}

};

/**
 * Fetch the trunk of SVN repo
 * 
 * @returns {undefined}
 */
wpggStarterThemeFetcher._fetchSVN = function() {
	
	// set up export command for trunk
	var resp = exec.spawnSync( 'svn', [ 'export', this.svnRemote + "trunk/", this.buildDir, "--force" ], { encoding: 'utf8' } );

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