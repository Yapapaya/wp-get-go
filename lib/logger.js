var winston = require( "winston" ); // for logging

var logger = {};

logger = new ( winston.Logger )( {
	transports: [
		new ( winston.transports.Console )(),
		new ( winston.transports.File )( { filename: 'wpgg.log' } )
	],
	prettyPrint: true,
	colorize: true
} );

module.exports = logger;