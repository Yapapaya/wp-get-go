var winston = require( "winston" ); // for logging

var logger = { };

logger = new ( winston.Logger )( {
	transports: [
		new ( winston.transports.Console )( {
			prettyPrint: true,
			colorize: true
		} ),
		new ( winston.transports.File )( { filename: 'wpgg.log' } )
	],
} );

module.exports = logger;