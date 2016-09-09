/**
 * Component Fetch Module
 * 
 * @module lib/fetch-component
 */
'use strict';

exports.init = function( grunt, bootStrapInfo ) {

	var exec = require( 'child_process' ).execSync; // for running unix commands
	var chalk = require( 'chalk' ); // for colouring output
	
	grunt.file.mkdir( bootStrapInfo.buildDir );
	
	bootStrapInfo.buildDir = './' + bootStrapInfo.buildDir + '/';

	var exports = function(grunt, bootStrapInfo){};
	
	var getComponentInfo = function( component ) {
		return grunt.file.readJSON( bootStrapInfo.buildDir + component + '/component.json' );
	};


	exports.validate = function(  ) {

			var defTOC = getDefaultTOC();

			var newTOC = defTOC;

			components.forEach( function( component ) {
				newTOC = updatedTOC( newTOC, component );
			} );

			console.log( newTOC );

			var styleSCSS = grunt.file.read( 'sass/style.scss' );
			styleSCSS = styleSCSS.replace( defTOC, newTOC );

			grunt.file.write( 'sass/style.scss', styleSCSS );


			grunt.fail.fatal( 'died' );



			console.log( JSON.stringify( defTOCJSON, null, '\t' ) );

// doesn't it make sense to just do a before field in TOC, so, we know what head we need to include this before
// and then just add the TOC before the said head
			var newTOC = defaults( compTOCJSON, defTOCJSON );

			newTOC = JSON.stringify( newTOC, null, '\t' );

			console.log( newTOC );


			


	};

	exports.fetch = function( grunt, bootStrapInfo, components ) {

		if ( components[0] != null ) {
			// components were defined in package.json

			grunt.verbose.writeln( 'Desired components found: ' + JSON.stringify( components ) );

			grunt.log.writeln( 'Getting ready to fetch components' );
			var gitCMD = '';
			components.forEach( function( component ) {
				gitCMD += "git archive --remote=" + bootStrapInfo.componentArchive.repository + " HEAD:" + component + " | (cd " + buildDir + " && mkdir " + component + " && cd " + component + " && tar xf -)\n";
			} );

			grunt.log.writeln( gitCMD );

			var componentsFetched = exec( gitCMD);

		} else {
			grunt.log.writeln( chalk.red( 'No components' ) + ' defined in ' + chalk.yellow( 'package.json' ) );
			grunt.log.ok( 'Bootstrap completed without components' );
		}




	};
	
	
	return exports;
};