'use strict';

var grunt = require( 'grunt' );
var fixtures = require( './fixture-setup.js' ).init( 'package' );
var packageParser = {};

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

exports.wpBootStrapPackageInfoParserTest = {
	setUp: function( done ) {
		packageParser = require( '../../tasks/lib/package-info-parser' );
		done();
	},
	tearDown: function( done ) {
		packageParser = {};
		// delete all files and stuff, to start from a clear slate
		done();
	},
	testName: function( test ) {
		
		var testFixture = fixtures.name;

		test.expect( testFixture.expected );

		testFixture.valid.forEach( function( pkgInfo ) {
			packageParser.init( pkgInfo );
			test.doesNotThrow(
				function() {
					packageParser.validateName();
				},
				Error,
				'kya bhai'
				);
		} );

		testFixture.invalid.forEach( function( pkgInfo ) {
			packageParser.init( pkgInfo );
			test.throws(
				function() {
					packageParser.validateName();
				},
				/Special characters/,
				'kyun bhai'
				);
		} );

		test.done();
	},
	testPrettyName: function( test ) {
		
		var testFixture = fixtures.prettyName;

		test.expect( testFixture.expected );

		testFixture.valid.forEach( function( pkgInfo ) {
			packageParser.init( pkgInfo );
			test.doesNotThrow(
				function() {
					packageParser.validatePrettyName();
				},
				Error,
				'kya bhai'
				);
		} );

		testFixture.invalid.forEach( function( pkgInfo ) {
			packageParser.init( pkgInfo );
			test.throws(
				function() {
					packageParser.validatePrettyName();
				},
				/Special characters/,
				'kyun bhai'
				);
		} );

		test.done();


	},
	
	testFunctionPrefix: function(test){
		
		var testFixture = fixtures.functionPrefix;

		test.expect( testFixture.expected );
		
		testFixture.valid.forEach( function( pkgInfo ) {
			packageParser.init( pkgInfo );
			test.doesNotThrow(
				function() {
					packageParser.validateFunctionPrefix();
				},
				Error,
				'kya bhai'
				);
		} );

		testFixture.invalid.forEach( function( pkgInfo ) {
			packageParser.init( pkgInfo );
			test.throws(
				function() {
					packageParser.validateFunctionPrefix();
				},
				/Special characters/,
				'kyun bhai'
				);
		} );

		test.done();


	},
	testBuildDir: function( test ) {
		var testFixture = fixtures.buildDir;

		test.expect( testFixture.expected );
		
		testFixture.valid.forEach( function( pkgInfo ) {
			packageParser.init( pkgInfo );
			test.doesNotThrow(
				function() {
					packageParser.setBuildDir();
				},
				Error,
				'kya bhai'
				);
		} );

		testFixture.invalid.forEach( function( pkgInfo ) {
			packageParser.init( pkgInfo );
			test.throws(
				function() {
					packageParser.setBuildDir();
				},
				/Special characters/,
				'kyun bhai'
				);
		} );

		test.done();

	},
	
	testGitURL: function ( test ){
		
		var testFixture = fixtures.gitURL;
		
		test.expect( testFixture.expected );
		
		testFixture.valid.forEach( function( pkgInfo ) {
			packageParser.init( pkgInfo );
			test.doesNotThrow(
				function() {
					packageParser.validateGitURL(packageParser.packageInfo.repository);
				},
				Error,
				'kya bhai'
				);
		} );

		testFixture.invalid.forEach( function( pkgInfo ) {
			packageParser.init( pkgInfo );
			test.throws(
				function() {
					packageParser.validateGitURL(packageParser.packageInfo.repository);
				},
				/a valid git URL/,
				'kyun bhai'
				);
		} );
		
		test.done();

	},
	
	testGitRepo: function ( test ){
		
		var testFixture = fixtures.gitRepo;
		
		test.expect( testFixture.expected );
		
		testFixture.valid.forEach( function( pkgInfo ) {
			packageParser.init( pkgInfo );
			test.doesNotThrow(
				function() {
					packageParser.validateGitRepo(packageParser.packageInfo.repository);
				},
				Error,
				'kya bhai'
				);
		} );

		testFixture.invalid.forEach( function( pkgInfo ) {
			packageParser.init( pkgInfo );
			test.throws(
				function() {
					packageParser.validateGitRepo(packageParser.packageInfo.repository);
				},
				/fatal: Could not read from remote repository./,
				'kyun bhai'
				);
		} );
		test.done();
	},
	
	testComponentInfo: function ( test ){
		
		var testFixture = fixtures.componentInfo;
		
		test.expect( testFixture.expected );
		
		testFixture.valid.forEach( function( pkgInfo ) {
			packageParser.init( pkgInfo );
			test.doesNotThrow(
				function() {
					packageParser.setComponentInfo();
				},
				Error,
				'kya bhai'
				);
		} );

		testFixture.invalid.forEach( function( pkgInfo ) {
			packageParser.init( pkgInfo );
			test.throws(
				function() {
					packageParser.setComponentInfo();
				},
				/an array/,
				'kyun bhai'
				);
		} );
		test.done();
		
	},
	
	testPush: function ( test ){
		
		var testFixture = fixtures.push;
		
		test.expect( testFixture.expected );
		
		testFixture.valid.forEach( function( pkgInfo ) {
			packageParser.init( pkgInfo );
			test.equal(packageParser.shouldPush(), true, 'kya bhai');
		} );

		testFixture.invalid.forEach( function( pkgInfo ) {
			packageParser.init( pkgInfo );
			test.equal(packageParser.shouldPush(), false, 'kyun bhai');
		} );
		test.done();
	}

/**/

//	default_options: function( test ) {
//		test.expect( 1 );
//
//		var actual = grunt.file.read( 'tmp/default_options' );
//		var expected = grunt.file.read( 'test/expected/default_options' );
//		test.equal( actual, expected, 'should describe what the default behavior is.' );
//
//		test.done();
//	},
//	custom_options: function( test ) {
//		test.expect( 1 );
//
//		var actual = grunt.file.read( 'tmp/custom_options' );
//		var expected = grunt.file.read( 'test/expected/custom_options' );
//		test.equal( actual, expected, 'should describe what the custom option(s) behavior is.' );
//
//		test.done();
//	},
};
