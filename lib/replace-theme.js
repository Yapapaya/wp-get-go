var replace = require( 'replace' ); // for find and replace of strings
var chalk = require( "chalk" );
var extend = require('util')._extend;

var wpbsReplacer = function() {
};

wpbsReplacer.packageInfo = { };

wpbsReplacer.themeHeaders = { }

wpbsReplacer.init = function( packageInfo ) {
	this.packageInfo = packageInfo;
	this.setThemeHeaders();
};

wpbsReplacer.defReplaceOptions = {
	paths: [ './' ],
	recursive: true,
	silent: false,
	exclude: "./Gruntfile.js, ./package.json, ./.gitignore, node_modules/*, .svn, ./.git"
};

wpbsReplacer.setThemeHeaders = function() {
	console.log(this.packageInfo);
	this.themeHeaders = {
		'Theme Name': this.packageInfo.wpBootStrap.prettyName,
		'Theme URI': this.packageInfo.homepage,
		'Repository': this.packageInfo.repository,
		'Author': this.packageInfo.author.name,
		'Author URI': this.packageInfo.author.url,
		'Description': this.packageInfo.description,
		'Version': this.packageInfo.version,
		'Text Domain': this.packageInfo.name
	};
};

wpbsReplacer.replaceTheme = function() {

	if ( typeof this.packageInfo.wpBootStrap.starter.replace === "string" ) {
		this.replaceStylesheet();

		this.replaceName( this.packageInfo.wpBootStrap.starter.replace );
	}
	
	if( typeof this.packageInfo.wpBootStrap.components.replace === "string"){
		if( this.packageInfo.wpBootStrap.components.installed.length>0){
			this.replaceName(this.packageInfo.wpBootStrap.components.replace);
		}
		
	}
};

wpbsReplacer.replaceStylesheet = function() {

	var themeHeaders = this.themeHeaders;

	var replaceOptions = extend({},this.defReplaceOptions);

	delete replaceOptions.exclude;

	replaceOptions.include = "style.scss";

	Object.keys( themeHeaders ).forEach( function( themeHeader ) {


		replaceOptions.regex = new RegExp( themeHeader + ":.*\n", 'g' );
		replaceOptions.replacement = themeHeader + ": " + themeHeaders[themeHeader] + "\n";

		var replacement = replace( replaceOptions );

		log.verbose( 'Replacing ' + chalk.yellow( replaceOptions.regex ) + ' with ' + chalk.yellow( replaceOptions.replacement ) );

	} );


};

wpbsReplacer.replaceFooter = function() {

};

wpbsReplacer.replaceName = function( name ) {

	var regexReplace = { };



	regexReplace["'" + name + "'"] = "'" + this.packageInfo.name + "'";

	regexReplace["" + name + "_"] = this.packageInfo.wpBootStrap.functionPrefix + "_";
	regexReplace[" " + name + ""] = " " + this.packageInfo.name;
	regexReplace["" + name + "-"] = this.packageInfo.name + "-";
	regexReplace[" " + name ] = " " + this.packageInfo.name;
	regexReplace[name + " "] = this.packageInfo.name + " ";



	regexReplace["Yapapaya"] = this.packageInfo.author.name;

	regexReplace["http://yapapaya.com"] = this.packageInfo.author.url;
	regexReplace["https://yapapaya.com"] = this.packageInfo.author.url;


	var replaceOptions = extend({},this.defReplaceOptions);
	
	console.log(replaceOptions);

	Object.keys( regexReplace ).forEach( function( key ) {

		replaceOptions.regex = key;
		replaceOptions.replacement = regexReplace[key];


		var replacement = replace( replaceOptions );

		log.verbose( 'Replacing ' + chalk.yellow( key ) + ' with ' + chalk.yellow( regexReplace[key] ) );

	} );

};

wpbsReplacer.replaceReadme = function() {

};

wpbsReplacer.replaceComponents = function() {

};

module.exports = wpbsReplacer;
