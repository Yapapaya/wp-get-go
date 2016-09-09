'use strict';

var grunt = require( 'grunt' );

var wpbsFixtureSetup = function() {
};

wpbsFixtureSetup.init = function( dirName ) {

	var fixtures = { };

	var setup = function( type ) {

		grunt.file.recurse( './test/fixtures/' + type + '/' + dirName, function( abspath, rootdir, subdir, filename ) {


			if ( typeof fixtures[subdir] === 'undefined' ) {
				Object.defineProperty(
					fixtures,
					subdir,
					{
						value: { 'expected': 0,
							'valid': [],
							'invalid': []
						},
						writable: true,
						enumerable: true,
						configurable: true
					}
				);
			}

			fixtures[subdir].expected++;

			fixtures[subdir][type].push( grunt.file.readJSON(abspath) );

		} );
	};

	setup( 'valid' );

	setup( 'invalid' );
	
	// console.log(JSON.stringify(fixtures, null, "\t\t"));

	return fixtures;

};

module.exports = wpbsFixtureSetup;