var fs = require('fs');

var wpbsUtils = function() {
};

wpbsUtils.readJSON = function(path){
	if ( !fs.existsSync( path ) ) {
		throw new Error('File ' + path + ' not found');
	}
	var obj = JSON.parse(fs.readFileSync(path, 'utf8'));
	
	return obj;
	
};

module.exports = wpbsUtils;