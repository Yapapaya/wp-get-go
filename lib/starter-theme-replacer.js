/**
 * Starter Package Fetch Module
 * 
 * @module lib/starter-theme-fetcher
 * @todo fix footer.php race
 */

'use strict';

var colors = require( 'colors' ); // for colouring output
var log = require( "./logger" ); // for logging
var replace = require( './replace' ).replace; // for find and replace of strings
var extend = require( 'util' )._extend;
var glob = require( 'glob' );
var readline = require( 'readline' );
var fs = require( 'fs' ); // for file system operations

var wpggStarterThemeReplacer = function() {
};

wpggStarterThemeReplacer.packageInfo = { };

wpggStarterThemeReplacer.themeHeaders = { };

wpggStarterThemeReplacer.buildDir = '';

wpggStarterThemeReplacer.includeExtns = [ 'php', 'js', 'scss', 'txt' ];

wpggStarterThemeReplacer.defReplaceOptions = {
	files : ['/**/*.php', '/**/*.js', '/**/style.scss']
};

wpggStarterThemeReplacer.init = function( packageInfo, options ) {

	this.packageInfo = packageInfo;

	this.options = options;

	this.buildDir = './' + this.packageInfo.wpgg.buildDir + '/starter';
	
	this.defReplaceOptions.path = this.buildDir;

	this.defReplaceOptions.silent = (this.options.logLevel === 'info' || this.options.logLevel === 'verbose') ? false : true;

	this.setThemeHeaders();
};


wpggStarterThemeReplacer.setThemeHeaders = function() {

	this.themeHeaders = {
		'Theme Name': this.packageInfo.wpgg.prettyName,
		'Theme URI': this.packageInfo.homepage,
		'Repository': this.packageInfo.repository,
		'Author': this.packageInfo.author.name,
		'Author URI': this.packageInfo.author.url,
		'Description': this.packageInfo.description,
		'Version': this.packageInfo.version,
		'Text Domain': this.packageInfo.name
	};
};

wpggStarterThemeReplacer.replaceTheme = function( packageInfo, options ) {

	this.init( packageInfo, options );

	if ( typeof this.packageInfo.wpgg.starter.replace === "string" ) {

		// special treatment for style.scss
		this.replaceThemeHeaders();

		this.replaceName( this.packageInfo.wpgg.starter.replace );

	} else {

		throw new Error( 'Error in replacement keyword' );
	}
};

wpggStarterThemeReplacer.replaceThemeHeaders = function() {

	var themeHeaders = this.themeHeaders;
	var replaceOptions = extend( { }, this.defReplaceOptions );

	replaceOptions.files = "/**/style.scss";
	replaceOptions.matchArray = [];

	Object.keys( themeHeaders ).forEach( function( themeHeader ) {
		var themeHeaderReg =  new RegExp( themeHeader + '[\\s\\S]*', 'g');

		replaceOptions.matchArray.push( {
				'replace': themeHeaderReg,
				'with': themeHeader + ': ' + themeHeaders[themeHeader]
				
		});

	} );
	
	this.findReplace(replaceOptions);


};

wpggStarterThemeReplacer.matchColophon = function() {

	var regexReplace = { };

	regexReplace[this.packageInfo.wpgg.starter.colophon.author] = this.packageInfo.author.name;

	regexReplace["http://" + this.packageInfo.wpgg.starter.colophon.url] = this.packageInfo.author.url;
	regexReplace["https://" + this.packageInfo.wpgg.starter.colophon.url] = this.packageInfo.author.url;

	var matchArray = [];

	Object.keys( regexReplace ).forEach( function( key ) {
		
		matchArray.push( {
				'replace': new RegExp(key, 'g'),
				'with': regexReplace[key]
				
		});
	} );
	
	return matchArray;


};

wpggStarterThemeReplacer.replaceName = function( name ) {

	var regexReplace = { };

	regexReplace["'" + name + "'"] = "'" + this.packageInfo.name + "'";
	regexReplace["@package " + name] = "@package " + this.packageInfo.name;
	regexReplace[name + "_"] = this.packageInfo.wpgg.functionPrefix + "_";
	regexReplace[" " + name] = " " + this.packageInfo.name;
	regexReplace[name + "-"] = this.packageInfo.name + "-";
	regexReplace[name + " "] = this.packageInfo.name + " ";


	var replaceOptions = extend( { }, this.defReplaceOptions );

	this.replace( regexReplace, replaceOptions );

};

wpggStarterThemeReplacer.replace = function( regexReplace, replaceOptions ) {
	
	replaceOptions.matchArray = [];

	Object.keys( regexReplace ).forEach( function( key ) {
		
		replaceOptions.matchArray.push( {
				'replace': new RegExp(key, 'g'),
				'with': regexReplace[key]
				
		});
	} );
	
	this.findReplace( replaceOptions);


};

wpggStarterThemeReplacer.findReplace = function( replaceOptions ) {

	var patterns;

	if ( typeof replaceOptions.files === 'string' ) {
		patterns = [ replaceOptions.files ];
	} else {
		patterns = replaceOptions.files;
	}
	
	var buildDir = replaceOptions.buildDir;
	
	patterns.forEach( function( pattern ) {

		glob( buildDir + pattern, { nodir: true }, function( err, files ) {

			if ( err ) {
				throw err;
			}

			files.forEach( function( file ) {
				if(file.search('/footer.php')> -1){
					replaceOptions.matchArray = replaceOptions.matchArray.concat(wpggStarterThemeReplacer.matchColophon());
				}
				wpggStarterThemeReplacer.replaceFile( file, replaceOptions.matchArray );
			} );

		} );
	} );

};

wpggStarterThemeReplacer.replaceFile = function( file, matchArray ) {
	var output = '';
	var rl = readline.createInterface( {
		input: fs.createReadStream( file )
	} );

	rl.on( 'line', function( line ) {
		var replaced = line;
		Object.keys( matchArray ).forEach( function( key ) {
			replaced = replaced.replace( matchArray[key].replace, matchArray[key].with );
		} );
		output += replaced + '\r\n';
	} );

	rl.on( 'close', function() {
		fs.writeFile( file, output, 'utf8', function( err ) {
			if ( err )
				throw err;
		} );
	} );

};

module.exports = wpggStarterThemeReplacer;