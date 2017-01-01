var winston = require( 'winston' ),
	fs = require( 'fs' ),
	logger;

winston.setLevels( winston.config.npm.levels );
winston.addColors( winston.config.npm.colors );

logger = new( winston.Logger )( {
	transports: [
		new winston.transports.Console( {
			level: "info",
			colorize: true
		} ),
		new winston.transports.File( {
			level: "silly",
			filename: 'wpgg_log.log',
			maxsize: 1024 * 1024 * 10, // 10MB
			colorize: false
		} )
    ],
	exceptionHandlers: [
		new winston.transports.File( {
			filename: 'log/exceptions.log'
		} )
    ]
} );


module.exports = logger;


// Use this singleton instance of logger like:
// logger = require( 'Logger.js' );
// logger.debug( 'your debug statement' );
// logger.warn( 'your warning' );