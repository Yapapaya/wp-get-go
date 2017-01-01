#!/usr/bin/env node

'use strict';


var program = require('commander');

/*
 * cmd `wpgg --verbose --no-validate --no-css --no-push`
*/
program
	.version( '0.0.1' )
  .description('BootStrap a WordPress plugin theme or plugin')
	.option( '--verbose', 'Detailed log output' )
	.option( '--no-autofix', 'Fix errors in package.json & update it')
	.option( '--no-validate', 'Don\'t validate git repositories' )
	.option( '--no-css', 'Don\'t generate style.css from style.scss' )
	.option( '--no-push', 'Don\'t commit and push after bootstrapping' )
	.parse( process.argv );

var verbose = ('verbose' in program )? true: false;

var wpgg = require("./lib/wpgg.js").init(program.validate, program.autofix, program.css, program.push, verbose);

wpgg.initConfig();