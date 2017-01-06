/**
 * Component Package Fetch Module
 * 
 * @module lib/fetch-starter
 */

'use strict';

var exec = require( 'child_process' ).spawn; // for running shell commands
var extend = require( 'util' )._extend;
var log = require( "../utils/logger" ); // for logging
var utils = require( '../utils/utils' ); // utility fns
var replacer = require('./replacer');

var wpggComponentFetcher = function() {
};

wpggComponentFetcher.buildDir = '';

wpggComponentFetcher.bootStrapInfo = { };

wpggComponentFetcher.componentErrors = { };

wpggComponentFetcher.toDownload = [ ];

wpggComponentFetcher.downloaded = [ ];

wpggComponentFetcher.fetchFunction = 'SVN';


wpggComponentFetcher.init = function( packageInfo, options ) {
	this.bootStrapInfo = packageInfo.wpgg;
	this.options = options;
	this.buildDir = './' + this.bootStrapInfo.buildDir + '/components';
	
	// logging for replacement script
	this.defReplaceOptions.silent = (this.options.logLevel === 'info' || this.options.logLevel === 'verbose') ? false : true;
	
	// initialise replacement script
	replacer.init(packageInfo, 'component', this.options);
};

wpggComponentFetcher.fetch = function( bootStrapInfo, options, callback ) {

	this.init( bootStrapInfo, options );

	log.verbose( 'Downloading components...' );

	this.toDownload = this.toDownload.concat( this.bootStrapInfo.components.names );

	if ( this.bootStrapInfo.components.repository.search( /github/i ) < 0 ) {
		
		this.fetchFunction = 'Git';
		
	}
	
	this.fetchComponents(callback);

};

wpggComponentFetcher.fetchComponents = function(callback) {

	if ( this.toDownload.length < 1 ) {
		
		// everything has been downloaded, do something else
		callback(this.downloaded, this.componentErrors);
	}

	this.toDownload.forEach( function( component ) {
		var index = wpggComponentFetcher.toDownload.indexOf( component );

		if ( index > -1 ) {
			wpggComponentFetcher.toDownload.splice( index, 1 );
		}
		
		// set the path for the replacement script to run
		this.defReplaceOptions.path = './' + this.buildDir + '/' +component;
		
		utils.mkdir_p(this.defReplaceOptions.path);

		wpggComponentFetcher['_fetchComponent' + wpggComponentFetcher.fetchFunction]( component, function( fetchErr ) {

			if ( fetchErr !== "" ) {
				wpggComponentFetcher.componentErrors[component] = fetchErr.replace( /\s\s+/gi, ' ' ).replace( /\n$/gi, "" ).replace( /\n/gi, " ## " );
			}
			wpggComponentFetcher.replace(component);
			
			wpggComponentFetcher.getDependencies( component, callback );

		} );

	} );

};


wpggComponentFetcher.getDependencies = function( component, callback ) {

	var componentJSONfile = this.buildDir + component + '/component.json';

	var componentJSON = utils.readJSON( componentJSONfile );

	if ( typeof componentJSON.dependencies === "object" ) {
		componentJSON.dependencies.forEach( function( dependency ) {
			if ( wpggComponentFetcher.toDownload.indexOf( dependency ) < 0 ) {
				wpggComponentFetcher.toDownload.push( dependency );
			}
		} );
	}

	this.fetchComponents(callback);

};

wpggComponentFetcher._fetchComponentGit = function( component, callback ) {

	// setup starter plugin/theme command
	var gitCMD = "git archive --remote=" + this.bootStrapInfo.components.repository + " --prefix=" + this.buildDir + "/ HEAD " + component + " | tar -x";

	// var resp = exec.execSync( gitCMD, { stdio: 'ignore', encoding: 'utf8' } );
	var command = 'sh',
	params =[ "-c", gitCMD ];
	
	this.fetchCmd(component, command, params, callback);
	
};


wpggComponentFetcher._fetchComponentSVN = function( component, callback ) {

	var svnRemote = utils.httpsURL( this.bootStrapInfo.components.repository );

	var command = 'svn', 
		params = [ 'export', svnRemote + "trunk/" + component + "/", this.buildDir + "/" + component, "--force" ];
	
	this.fetchCmd(component, command, params, callback);

};

wpggComponentFetcher.fetchCMD = function(component, command, params, callback){
	
	var resp = exec( command, params, { encoding: 'utf8' } );
	resp.stdout.on( 'data', function( data ) {
		log.silly( 'stdout for ' + component + ': ' + data );
	} );

	resp.stderr.on( 'data', function( data ) {
		error = data;

		callback( data );
	} );

	resp.on( 'close', function() {
		log.verbose( component.yellow + ' downloaded' );
		wpggComponentFetcher.downloaded.push( component );
		callback();
	} );
};


wpggComponentFetcher.replace = function(component){
	// set the path for the replacement script to run
	this.defReplaceOptions.path = './' + this.buildDir + '/' +component;
	replacer.replaceName();
};

/**
 * Initialises module
 * 
 * @param {object} grunt The grunt object
 * @returns {exports.init.exports} Instance of the functional module
 */
module.exports = wpggComponentFetcher;