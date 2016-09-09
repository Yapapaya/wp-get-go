'use strict';

var grunt = require( 'grunt' );

/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit
 
 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

exports.wp_bootstrap = {
	
	setUp: function( done ) {

		// load a semblance of the default package.json
		this.packageInfo = grunt.file.readJSON( 'test/fixtures/default.json' );
		
		// load default wpBootStrap params from package.json itself
		this.bootStrapInfo = this.packageInfo.wpBootStrap;
		
		// create a temporary folder to download bootstrapped theme and components
		grunt.file.mkdir('tmp');
		done();
	},
	
	tearDown: function( done ) {
		
		// delete all files and stuff, to start from a clear slate
		grunt.file.delete('tmp');
		done();
	},
	
	group:{
		test_default: function(test){
			test.expect(1);
			
		}
	},
	
	default_options: function( test ) {
		test.expect( 1 );

		var actual = grunt.file.read( 'tmp/default_options' );
		var expected = grunt.file.read( 'test/expected/default_options' );
		test.equal( actual, expected, 'should describe what the default behavior is.' );

		test.done();
	},
	custom_options: function( test ) {
		test.expect( 1 );

		var actual = grunt.file.read( 'tmp/custom_options' );
		var expected = grunt.file.read( 'test/expected/custom_options' );
		test.equal( actual, expected, 'should describe what the custom option(s) behavior is.' );

		test.done();
	},
};
