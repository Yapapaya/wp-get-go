var grunt = require( "grunt" );

var exec = require( 'child_process' ); // for running unix commands

// use css sourcemaps

var wpbsBuild = function() {

};

wpbsBuild.init = function( bootStrapInfo ) {

	this.bootStrapInfo = bootStrapInfo;

	this.baseDir = "./" + this.bootStrapInfo.buildDir;

};

wpbsBuild.build = function( bootStrapInfo ) {

	this.init( bootStrapInfo );

	// this.deleteComponentInfo();

	this.mergeComponents();

	this.updateSaasIncludes();

	this.updatePhpIncludes();

	this.buildStyleSheet();

};

wpbsBuild.buildMap = function( bootStrapInfo ) {

	this.init( bootStrapInfo );

	var starterMapArr = grunt.file.readJSON( this.baseDir + "/starter/sass/style.css.map" );

	var starterMapArray = starterMapArr.sources;



	// remove style.scss
	starterMapArray.splice( 0, 1 );


	var starterMap = this.buildStyleMap( starterMapArray );


	var componentPaths = this.componentPaths();

	this.bootStrapInfo.componentMap = this.buildStyleMap( componentPaths );


	this.bootStrapInfo.cssMap = this.buildStyleMap( componentPaths, starterMap );

	this.bootStrapInfo.phpIncs = this.getIncs();

	return this.bootStrapInfo;

};

wpbsBuild.buildStyleMap = function( mapArray, map ) {

	map = map || { };

	// insert mixins and variables first
	if ( typeof map['variables'] === "undefined" ) {
		map['variables'] = null;
	}
	if ( typeof map['mixins'] === "undefined" ) {
		map['mixins'] = null;
	}
	/*
	 * Relying on object key order is stupid.
	 * I'm relying on insertion order,
	 * not the best way but convenient and within my reach conceptually
	 * will redo in future
	 */

	mapArray.forEach( function( element ) {

		element = element.replace( /.scss/gi, "" );
		if ( element.search( /\//i ) > -1 ) {
			var elemArray = element.split( "/" );
			var index = elemArray[0];
			if ( typeof map[index] === "undefined" || map[index] === null ) {
				map[index] = [ index + "/_" + index ];
			}

			map[index].push( elemArray.join( "/" ) );

		} else {
			var index = element.replace( /^_/gi, "" );
			if ( typeof map[index] === "undefined" ) {
				map[index] = [ ];
			}
			map[index].push( element );
		}
	} );

	return map;
};

wpbsBuild.getIncs = function() {

	var baseDir = this.baseDir;
	var patterns = [
		baseDir + "/components/*/inc/**/*.php"
	];

	var incs = grunt.file.expand( { 'filter': 'isFile' }, patterns );

	console.log( incs );

	var filteredPaths = [ ];

	incs.forEach( function( path ) {
		path = path.replace( baseDir, "" );
		path = path.replace( /\/\S*\/inc\//gi, "" );

		filteredPaths.push( path );

	} );

	console.log( filteredPaths );

	return filteredPaths;
};

wpbsBuild.componentPaths = function() {

	var baseDir = this.baseDir;
	var patterns = [
		baseDir + "/components/**/*.scss"
	];

	var styles = grunt.file.expand( { 'filter': 'isFile' }, patterns );

	var filteredPaths = [ ];

	styles.forEach( function( path ) {
		path = path.replace( baseDir, "" );
		path = path.replace( /\/\S*\/sass\//gi, "" );
		filteredPaths.push( path );
	} );
	return filteredPaths;
};

wpbsBuild.mergeComponents = function() {

	var baseDir = this.baseDir;
	this.bootStrapInfo.installed.forEach( function( component ) {

		exec.execSync( "rsync -va --exclude \"**/component.json\" " + baseDir + "/components/*/** " + baseDir + "/starter/ " );

	} );
};

wpbsBuild.updateSaasIncludes = function() {

	// ideally rewrite the file completely using comments

	var componentMap = this.bootStrapInfo.cssMap;

	var baseDir = this.baseDir + '/starter/sass/';

	var openInc = "\n" + this.generateCommentWrap( true ) + "\n";

	var closeInc = "\n" + this.generateCommentWrap( false ) + "\n";


	Object.keys( componentMap ).forEach( function( component ) {

		var components = componentMap[component];

		var noComments = false;

		if ( components.length > 1 ) {

			if ( component.toString() === "variables" || component.toString() === "mixins" ) {
				console.log( 'reached here' );
				console.log( component );
				noComments = true;
			}

			var componentIndex = components[0];

			components.splice( 0, 1 );

			console.log( components );

			var fileToUpdate = baseDir + componentIndex + '.scss';

			var componentContent = "";

			console.log( componentContent );

			var currentCount = 0;

			components.forEach( function( path ) {

				currentCount++;

				console.log( noComments );

				if ( noComments !== false ) {
					componentContent += "\n";

				} else {
					componentContent += openInc;

					componentContent += "## " + path.replace( component + "/", "" ).replace( /^_/gi, "" ).replace( /(-|^)([^-]?)/g, function( _, prep, letter ) {
						return ( prep && ' ' ) + letter.toUpperCase();
					} );

					componentContent += closeInc;
				}

				componentContent += "@import \"" + path.replace( component + "/", "" ).replace( /_/, "" ) + "\";\n";

			} );

			grunt.file.write( fileToUpdate, componentContent );
		}
	} );

};

wpbsBuild.generateCommentWrap = function( starter ) {

	var charCount = 60;

	if ( typeof starter === "undefined" ) {

		return Array( charCount + 1 ).join( "-" );

	}

	if ( starter === true ) {
		return "/*" + Array( charCount - 1 ).join( "-" );
	}

	return  Array( charCount - 1 ).join( "-" ) + "*/";

};

wpbsBuild.updatePhpIncludes = function() {
	var incs = this.bootStrapInfo.phpIncs;

	var baseDir = this.baseDir;

	var fileToUpdate = baseDir + '/starter/functions.php';

	var functionContent = grunt.file.read( fileToUpdate );

	console.log( incs );

	incs.forEach( function( incpath ) {
		var incName = incpath.replace( /.php$/gi, "" ).replace( /(-|^)([^-]?)/g, function( _, prep, letter ) {
			return ( prep && ' ' ) + letter.toUpperCase();
		} );
		functionContent += "\n\n/**\n * " + incName + ".\n */\nrequire get_template_directory() . '/inc/" + incpath + "';";
	} );

	grunt.file.write( fileToUpdate, functionContent );
};

wpbsBuild.buildStyleSheet = function() {

	// redo TOC and includes with comments

	var componentMap = this.bootStrapInfo.cssMap;

	var baseDir = this.baseDir + '/starter/sass/';

	var openInc = "\n" + this.generateCommentWrap( true ) + "\n";

	var closeInc = "\n" + this.generateCommentWrap( false ) + "\n";

	var toc = openInc + ">>> TABLE OF CONTENTS\n" + this.generateCommentWrap() + '\n';

	var styleSheet = grunt.file.read( baseDir + '/starter/sass/style.scss' );

	var styleParts = styleSheet.split( /\/\*-+\n.*TABLE OF CONTENTS:.*\n-+/gi );

	var finalStyleSheet = styleParts[0];

	Object.keys( componentMap ).forEach( function( component ) {
		var components = componentMap[component];

		var noComments = false;



		if ( component.toString() === "variables" || component.toString() === "mixins" ) {
			console.log( 'reached here' );
			console.log( component );
			noComments = true;
		}

		var componentIndex = components[0];

		var fileToUpdate = baseDir + componentIndex + '.scss';

		var componentContent = "";

		console.log( componentContent );

		var currentCount = 0;


		if ( noComments !== false ) {
			componentContent += "\n";

		} else {
			componentContent += openInc;

			componentContent += "# " + path.replace( component + "/", "" ).replace( /^_/gi, "" ).replace( /(-|^)([^-]?)/g, function( _, prep, letter ) {
				return ( prep && ' ' ) + letter.toUpperCase();
			} );

			componentContent += closeInc;
		}

		componentContent += "@import \"" + path.replace( component + "/", "" ).replace( /_/, "" ) + "\";\n";



	} );




};

wpbsBuild.moveBuild = function() {

	// clean build
	grunt.file.delete( this.baseDir + "/starter/sass/sass-cache" )
	exec.execSync( "rsync -va  " + this.baseDir + "/starter/** ./" );
};

module.exports = wpbsBuild;
