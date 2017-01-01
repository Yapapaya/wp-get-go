/**
 * Component Package Fetch Module
 * 
 * @module lib/fetch-starter
 */

'use strict';

var chalk = require( "chalk" );
var exec = require( 'child_process' ); // for running git commands
var extend = require('util')._extend;


var wpggComponentFetcher = function() {
};

wpggComponentFetcher.starter = null;

wpggComponentFetcher.bootStrapInfo = { };

wpggComponentFetcher.init = function( bootStrapInfo ) {
	this.bootStrapInfo = bootStrapInfo;
};

wpggComponentFetcher.svnURL = function( repo ) {
	return repo.replace( /:/gi, "/" ).replace( /^git@/gi, "https://" ).replace( /.git$/gi, "/" );
};

wpggComponentFetcher.fetch = function( bootStrapInfo ) {

	this.init( bootStrapInfo );
	log.verbose( 'Downloading components...' );
	
	this.bootStrapInfo.components.installed = [];

	var componentErrors = this.fetchComponents( this.bootStrapInfo.components.names );


	var depends = this.getDependencies();
	
	if ( depends.length > 0 ) {
		var depErrors = this.fetchComponents( depends );
		extend( componentErrors,depErrors );
	}

	if ( Object.keys( componentErrors ).length > 0 ) {
		log.warn('Warning');
		log.warn( 'Some components were not downloaded because of errors' );
		glog.warn( chalk.red( '<component>:' ) + ' <error description>' );
		Object.keys( componentErrors ).forEach( function( component ) {
			log.warn( chalk.red( component + ":" ) + " " + componentErrors[component].replace( /##/gi, chalk.yellow( '##' ) ) );
		} );


	} else {
		log.verbose('OK');
	}

	return this.bootStrapInfo.components.installed;

};

wpggComponentFetcher.getDependencies = function() {

	var depends = [ ];

	var names = this.bootStrapInfo.components.names;

	var buildDir = this.bootStrapInfo.buildDir;

	names.forEach( function( component ) {

		var componentJSONfile = './' + buildDir + '/' + component + '/component.json';
		
		var componentJSON = this.readJSON( componentJSONfile );

		if ( typeof componentJSON.dependencies === "object" ) {
			componentJSON.dependencies.forEach( function( dependency ) {
				if ( names.indexOf( dependency ) < 0 ) {
					depends.push( dependency );
				}

			} );
		}
	} );
	
	return depends;

};

wpggComponentFetcher.fetchComponents = function( components ) {

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



wpggComponentFetcher._fetchComponentGit = function( component ) {

	// setup starter plugin/theme command
	var gitCMD = "git archive --remote=" + this.bootStrapInfo.components.repository + " --prefix=" + this.bootStrapInfo.buildDir + "/components/ HEAD " + component + " | tar -x";

	// var resp = exec.execSync( gitCMD, { stdio: 'ignore', encoding: 'utf8' } );
	var resp = exec.spawnSync( 'sh', [ "-c", gitCMD ], { encoding: 'utf8' } );

	return resp.stderr;
};


wpggComponentFetcher._fetchComponentSVN = function( component ) {
	var resp = exec.spawnSync( 'svn', [ 'export', this.bootStrapInfo.components.svnRemote + "trunk/" + component + "/", this.bootStrapInfo.buildDir + "/components/" + component, "--force" ], { encoding: 'utf8' } );


	return resp.stderr;

};

wpggComponentFetcher.readJSON = function(path){
	if ( !fs.existsSync( path ) ) {
		throw new Error('File ' + path + ' not found');
	}
	var obj = JSON.parse(fs.readFileSync(path, 'utf8'));
	
	return obj;
	
};


wpggComponentFetcher.verify = function() {



};
/**
 * Initialises module
 * 
 * @param {object} grunt The grunt object
 * @returns {exports.init.exports} Instance of the functional module
 */
module.exports = wpggComponentFetcher;