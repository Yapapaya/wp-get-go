#!/usr/bin/env node

'use strict';

/*
 * 
 * Why not call this wp-crank or wp-get-go(ing) because it cranks out WordPress projects
 */

var program = require('commander');

var log = require("winston"); // for logging

/*
 * cmd `wpbootstrap --no-validate --no-css --no-push`
*/

program
	.version( '0.0.1' )
.command('wp-gg')
.alias('wpgetgo')
  .alias('wpgg')
  .alias('wp-get-go')
  .alias('wp-get-go')
  .description('BootStrap a WordPress plugin theme or plugin')
	// .option( '--log [level]', 'The level of logging desired' )
	.option( '--no-validate', 'Don\'t validate git repositories' )
	.option( '--no-css', 'Don\'t generate style.css from style.scss' )
	.option( '--no-push', 'Don\'t commit and push after bootstrapping' )
	.option('-v, --verbose', 'Detailed log output')
	.parse( process.argv );


console.log('Starting bootstrap process...');

var wpbs = require("./lib/wpbs.js");

wpbs.init(program.validate, program.css, program.push, program.verbose);

console.log('Parsing Package Information...');

wpbs.initConfig();